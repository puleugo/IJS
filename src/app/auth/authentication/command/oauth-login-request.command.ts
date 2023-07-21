import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';

export type OauthLoginRequestCommand = {
  accessToken: string;
  provider: OauthLoginProviderEnum;
};
