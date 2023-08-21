import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@domain/user/user.entity';
import { UserService } from '@app/user/user.service';
import { OauthLoginProviderEnum } from '@app/auth/authentication/oauth-login-provider.enum';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_EXPIRE,
  API_PREFIX,
  REFRESH_TOKEN_EXPIRE,
} from '../../../contants';
import { JwtSubjectType } from '@infrastructure/types/jwt.types';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuthProvider } from '@domain/user/user-auth-provider.entity';
import { Repository } from 'typeorm';
import { PhotoClient } from '@infrastructure/utils/photo.client';
import { UniversityService } from '@app/university/university.service';
import { ConfigService } from '@nestjs/config';
import {
  UserProfileResponseType,
  UserVerificationRequestType,
} from '@app/user/user.type';

import * as TelegramBot from 'node-telegram-bot-api';
import { UserAuthenticationType } from '@app/auth/authentication/authentication.type';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthenticationService {
  private readonly bot: any;
  private readonly chatId: string;

  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly universityService: UniversityService,
    private readonly configService: ConfigService,
    @InjectRedis()
    private readonly redis: Redis,
    @Inject('AuthPhotoClient')
    private readonly authPhotoClient: PhotoClient,
    @InjectRepository(UserAuthProvider)
    private readonly userAuthProviderRepository: Repository<UserAuthProvider>,
  ) {
    const telegramBotKey = this.configService.get('TELEGRAM_BOT_KEY', '');
    this.chatId = this.configService.get('TELEGRAM_CHAT_ID', '6279443618');
    this.bot = new TelegramBot(telegramBotKey, { polling: true });
    this.bot.on('callback_query', (msg) => {
      this.answerVerification(msg);
    });
    this.bot.on('polling_error', console.log);
  }

  async googleOauthLogin(accessToken: string): Promise<User> {
    try {
      const googleUserInfo = await this.httpService.axiosRef.request({
        method: 'GET',
        url: 'https://people.googleapis.com/v1/people/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          personFields: 'names,metadata',
        },
      });

      const user = await this.userService.findById(googleUserInfo.data.id, {
        where: {
          auth: {
            provider: {
              name: OauthLoginProviderEnum.GOOGLE,
            },
            username: googleUserInfo.data.id,
          },
        },
      });
      if (user) {
        return user;
      }
      return await this.userService.joinUserByOauth({
        providerUsername: googleUserInfo.data.id,
        providerName: OauthLoginProviderEnum.GOOGLE,
      });
    } catch (e) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }
  }

  async kakaoOauthLogin(accessToken: string): Promise<User> {
    let kakaoUserInfo: AxiosResponse<any, any>;
    try {
      kakaoUserInfo = await this.httpService.axiosRef.request({
        method: 'GET',
        url: `https://kapi.kakao.com/v2/user/me`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (e) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }
    if (!kakaoUserInfo)
      throw new UnauthorizedException('카카오 로그인에 실패했습니다.');

    const user = await this.userService.findById(kakaoUserInfo.data.id, {
      where: {
        auth: {
          provider: {
            name: OauthLoginProviderEnum.KAKAO,
          },
          username: kakaoUserInfo.data.id,
        },
      },
    });
    if (user) return user;

    return await this.userService.joinUserByOauth({
      providerUsername: kakaoUserInfo.data.id,
      providerName: OauthLoginProviderEnum.KAKAO,
    });
  }

  async generateAccessToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: ACCESS_TOKEN_EXPIRE,
        subject: JwtSubjectType.ACCESS,
      },
    );
  }

  async generateRefreshToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync(
      { user_id: userId },
      {
        expiresIn: REFRESH_TOKEN_EXPIRE,
        subject: JwtSubjectType.REFRESH,
      },
    );
  }

  async getUserInRedisByAuthenticationCode(
    code: string,
  ): Promise<UserAuthenticationType> {
    return JSON.parse(await this.redis.get(`code_${code}`));
  }

  async deleteRedisDataByKey(code: string): Promise<void> {
    await this.redis.del(`code_${code}`);
  }

  async sendVerifySchoolMail(
    userId: string,
    userSchoolData: {
      schoolEmail: string;
      schoolId: string;
      majorId: number;
    },
  ) {
    const { schoolEmail, schoolId, majorId } = userSchoolData;

    const randomKey = uuidv4();
    await this.mailerService
      .sendMail({
        to: schoolEmail, // list of receivers
        subject: '인제생 인증 메일입니다.', // Subject line
        html: `인증을 위해 아래 링크를 클릭해주세요. ${process.env.APP_URL}/${API_PREFIX}/auth/mail-auth?code=${randomKey}`, // HTML body content
      })
      .then(() => {
        this.redis.set(
          `code_${randomKey}`,
          `{"userId": "${userId}", "schoolEmail": "${schoolEmail}", "schoolId": "${schoolId}", "majorId": "${majorId}" }`,
        );

        this.redis.expire(`${randomKey}`, 60 * 60 * 24);
      })
      .catch((e) => {
        console.log(e);
        throw new BadRequestException('이메일 송신에 실패했습니다.');
      });
  }

  async getProfile(userId: string): Promise<UserProfileResponseType> {
    return await this.userService.findById(userId, {
      relations: { settings: true },
    });
  }

  async uploadRegisterImage(photo: Buffer): Promise<string> {
    const resizedPhoto = await this.authPhotoClient.resizePhoto(photo);
    return await this.authPhotoClient.uploadPhoto(resizedPhoto);
  }

  async updateUserSchoolAuthentication(
    userId: string,
    majorId?: number,
    schoolId?: string,
    schoolEmail?: string,
  ): Promise<void> {
    await this.userService.updateUserById(userId, {
      isVerified: true,
      majorId,
      schoolId,
      schoolEmail,
    });
  }

  async initializeAuthProvider() {
    const [providersName, foundProviders] = await Promise.all([
      Object.values(OauthLoginProviderEnum),
      this.userAuthProviderRepository.find({
        select: { name: true },
      }),
    ]);

    const missingProvidersName = providersName.filter(
      (provider) =>
        !foundProviders
          .map((foundProvider) => foundProvider.name)
          .includes(provider),
    );

    const createdProviders = missingProvidersName.map((provider) =>
      this.userAuthProviderRepository.create({
        name: provider,
      }),
    );
    await this.userAuthProviderRepository.save(createdProviders);
  }

  async requestVerificationWithSlack(
    userVerificationRequest: UserVerificationRequestType,
    userId: string,
    photoUrl: string,
  ) {
    const { name, schoolId, majorId } = userVerificationRequest;
    const majorName =
      await this.universityService.getUniversityMajorNameByMajorId(majorId);
    await this.bot.sendPhoto(
      this.chatId,
      `https://duscltkrckrf7.cloudfront.net/${photoUrl}`,
      {
        caption: `인제생 회원가입 인증 요청입니다\n사용자명: ${name}\n학번: ${schoolId}\n전공 명: ${majorName}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '수락',
                callback_data: `${userId}:${schoolId}:${majorId}:accept`,
              },
            ],
            [
              {
                text: '거절',
                callback_data: `${userId}:${schoolId}:${majorId}:reject`,
              },
            ],
          ],
        },
      },
    );
  }

  private answerVerification(callbackData: any) {
    const data: string = callbackData.data;
    const [userId, studentId, majorId, action] = data.split(':');
    switch (action) {
      case 'accept':
        const isVerification = this.userService.verifyUser(userId, {
          studentId,
          majorId: parseInt(majorId),
        });

        if (isVerification) {
          return this.bot.sendMessage(this.chatId, '인증이 완료되었습니다.');
        }
        return this.bot.sendMessage(this.chatId, '인증에 실패했습니다.');
      case 'reject':
        return this.bot.sendMessage(this.chatId, '인증이 거절되었습니다.');
      default:
        return this.bot.sendMessage(this.chatId, '응답에 실패했습니다.');
    }
  }
}
