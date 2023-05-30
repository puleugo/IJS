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
import { ACCESS_TOKEN_EXPIRE } from '../../../contants';
import { JwtSubjectType } from '@infrastructure/types/jwt.types';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async oauthLogin(
    oauthLoginRequest: OauthLoginRequestCommand,
  ): Promise<TokenResponse> {
    let user: User;
    switch (oauthLoginRequest.provider) {
      case OauthLoginProviderEnum.KAKAO:
        user = await this.kakaoOauthLogin(oauthLoginRequest.code);
        break;
      case OauthLoginProviderEnum.GOOGLE:
        user = await this.googleOauthLogin(oauthLoginRequest.code);
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

  async googleOauthLogin(code: string): Promise<User> {
    try {
      const googleTokenInfo = await this.httpService.axiosRef.request({
        method: 'POST',
        url: `https://oauth2.googleapis.com/token`,
        data: {
          client_id: `${process.env.GOOGLE_API_KEY}`,
          client_secret: `${process.env.GOOGLE_API_SECRET}`,
          redirect_uri: `${process.env.GOOGLE_REDIRECT_URI}`,
          grant_type: `authorization_code`,
          code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const googleAccessToken = googleTokenInfo.data.access_token;

      const googleUserInfo = await this.httpService.axiosRef.request({
        method: 'GET',
        url: 'https://people.googleapis.com/v1/people/me',
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
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

  async kakaoOauthLogin(code: string): Promise<User> {
    try {
      const kakaoTokenInfo = await this.httpService.axiosRef.request({
        method: 'POST',
        url: `https://kauth.kakao.com/oauth/token`,
        data: {
          grant_type: 'authorization_code',
          client_id: `${process.env.KAKAO_API_KEY}`,
          redirect_uri: `${process.env.KAKAO_REDIRECT_URI}`,
          code,
        },
        headers: {
          'Content-Type': "application/x-www-form-urlencoded;charset=utf-8'",
        },
      });

      const kakaoAccessToken = kakaoTokenInfo.data.access_token;

      const kakaoUserInfo = await this.httpService.axiosRef.request({
        method: 'GET',
        url: `https://kapi.kakao.com/v2/user/me`,
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
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
      if (user) {
        return user;
      }
      return await this.userService.joinUserByOauth({
        providerUsername: kakaoUserInfo.data.id,
        providerName: OauthLoginProviderEnum.KAKAO,
      });
    } catch (e) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }
  }

  async getMyProfile(userId: string): Promise<UserProfileResponse> {
    const user = await this.userService.findUserById(userId);
    return new UserProfileResponse(user);
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
    schoolEmail: string;
    schoolId: string;
    schoolMajor: string;
  }) {
    const { schoolEmail, schoolId, schoolMajor } = data;

    await this.verifySchoolEmail(schoolEmail);
  }

  async verifySchoolEmail(email: string) {
    console.log('verifySchoolEmail', email);
    this.mailerService
      .sendMail({
        to: email, // list of receivers
        subject: '인제생 인증 메일입니다.', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then(() => {
        console.log('이메일 송신에 성공했습니다.');
      })
      .catch(() => {
        throw new BadRequestException('이메일 송신에 실패했습니다.');
      });
  }

  async getProfile(userId: string): Promise<User> {
    return await this.userService.findUserById(userId);
  }
}
