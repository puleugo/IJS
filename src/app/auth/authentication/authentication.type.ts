import { OauthLoginProviderEnum } from '@app/auth/authentication/oauth-login-provider.enum';

export type OauthLoginRequestType = {
  accessToken: string;
  provider: OauthLoginProviderEnum;
};

export type OauthLoginResponseType = {
  accessToken: string;
  refreshToken: string;
};
