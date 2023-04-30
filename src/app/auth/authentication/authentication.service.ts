import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthLoginRequestCommand } from '@app/auth/authentication/command/oauth-login-request.command';
import { User } from '@domain/user/user.entity';
import { TokenResponse } from '@app/auth/authentication/dto/token.response';
import { UserService } from '@app/user/user.service';
import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
  ) {}

  async oauthLogin(
    oauthLoginRequest: OauthLoginRequestCommand,
  ): Promise<TokenResponse> {
    const user = await this.userService.findUserByOauthId({
      code: oauthLoginRequest.code,
      provider: oauthLoginRequest.provider,
    });
    if (user) {
      const [accessToken, refreshToken] = await Promise.all([
        this.generateAccessToken(user.id),
        this.generateRefreshToken(user.id),
      ]);
      return { accessToken, refreshToken };
    }

    const registeredUser = await this.oauthRegister(oauthLoginRequest);
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(registeredUser.id),
      this.generateRefreshToken(registeredUser.id),
    ]);
    return { accessToken, refreshToken };
  }

  async oauthRegister(
    oauthLoginRequest: OauthLoginRequestCommand,
  ): Promise<User> {
    switch (oauthLoginRequest.provider) {
      case OauthLoginProviderEnum.KAKAO:
        return await this.kakaoOauthRegister(oauthLoginRequest.code);
    }
  }

  async kakaoOauthRegister(code: string): Promise<User> {
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
      return await this.userService.joinUserByOauth({
        providerUsername: kakaoUserInfo.data.id,
        providerName: OauthLoginProviderEnum.KAKAO,
      });
    } catch (e) {
      throw new UnauthorizedException('인증 정보가 잘못되었습니다.');
    }
  }

  async generateAccessToken(id: string): Promise<string> {
    return 'test';
  }

  async generateRefreshToken(id: string): Promise<string> {
    return 'test';
  }

  async verifySchoolEmail() {}
}
