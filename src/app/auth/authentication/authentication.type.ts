import { OauthLoginProviderEnum, } from '@app/auth/authentication/oauth-login-provider.enum';
import { IUser, } from '@domain/user/user.interface';

export type OauthLoginRequestType = {
    accessToken: string;
    provider: OauthLoginProviderEnum;
};

export type OauthLoginResponseType = {
    accessToken: string;
    refreshToken: string;
};

export type UserAuthenticationType = Pick<
    IUser,
    'id' | 'schoolEmail' | 'schoolId' | 'majorId'
>;
