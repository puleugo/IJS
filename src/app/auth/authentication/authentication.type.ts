import { OauthLoginProviderEnum, } from '@app/auth/authentication/oauth-login-provider.enum';
import { User, } from '@app/user/domain/user.entity';

export const approveMailAuthenticationURL = 'approve/mail';

export type OauthLoginRequestType = {
    accessToken: string;
    provider: OauthLoginProviderEnum;
};

export type OauthLoginResponseType = {
    accessToken: string;
    refreshToken: string;
};

export type UserAuthenticationType = Pick<
    User,
    'id' | 'schoolEmail' | 'schoolId' | 'majorId'| 'name'
>;

export type UserAuthenticationCodeRequestType = Pick<User,'id' |  'schoolEmail' | 'schoolId' | 'majorId' | 'name'>
