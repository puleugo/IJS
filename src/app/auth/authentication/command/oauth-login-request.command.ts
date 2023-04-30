import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';

export type OauthLoginRequestCommand = {
  code: string;
  provider: OauthLoginProviderEnum;
};
