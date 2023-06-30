import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OauthLoginRequestCommand } from '@app/auth/authentication/command/oauth-login-request.command';
import { User } from '@domain/user/user.entity';
import { TokenResponse } from '@app/auth/authentication/dto/token.response';
import { UserService } from '@app/user/user.service';
import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ACCESS_TOKEN_EXPIRE, API_PREFIX } from '../../../contants';
import { JwtSubjectType } from '@infrastructure/types/jwt.types';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async oauthLogin(
    oauthLoginRequest: OauthLoginRequestCommand,
  ): Promise<TokenResponse> {
    let user: User;
    switch (oauthLoginRequest.provider) {
      case OauthLoginProviderEnum.KAKAO:
        user = await this.kakaoOauthLogin(oauthLoginRequest.accessToken);
        break;
      case OauthLoginProviderEnum.GOOGLE:
        user = await this.googleOauthLogin(oauthLoginRequest.accessToken);
        break;
      default:
        throw new UnauthorizedException();
    }
    if (user) {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user.id),
        this.generateRefreshToken(user.id),
      ]);
      return { accessToken, refreshToken };
    }
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

      const user = await this.userService.findUserById(googleUserInfo.data.id, {
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
    try {
      const kakaoUserInfo = await this.httpService.axiosRef.request({
        method: 'GET',
        url: `https://kapi.kakao.com/v2/user/me`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await this.userService.findUserById(kakaoUserInfo.data.id, {
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
    } catch (e) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }
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
        expiresIn: ACCESS_TOKEN_EXPIRE,
        subject: JwtSubjectType.REFRESH,
      },
    );
  }

  async verifySchoolId(data: {
    user: User;
    schoolEmail: string;
    schoolId: string;
    majorId: number;
  }) {
    const { user, schoolEmail, schoolId, majorId } = data;
    await this.verifySchoolEmail(user.id, {
      schoolEmail,
      schoolId,
      majorId,
    });
  }

  async verifySchoolEmailByAuthenticationCode(code: string): Promise<boolean> {
    const userData: {
      userId: string;
      schoolEmail: string;
      schoolId: string;
      majorId: number;
    } = JSON.parse(await this.redis.get(`code_${code}`));
    console.log('verifySchoolEmailByAuthenticationCode', code, '호출');
    const { userId, schoolEmail, schoolId, majorId } = userData;
    if (!userData) {
      throw new BadRequestException('인증 코드가 잘못되었습니다.');
    }
    await this.redis.del(`code_${code}`);

    return await this.userService.updateUserProfile(userId, {
      schoolEmail,
      schoolId,
      majorId,
    });
  }

  async verifySchoolEmail(
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

  async getProfile(userId: string): Promise<User> {
    return await this.userService.findUserById(userId);
  }
}
