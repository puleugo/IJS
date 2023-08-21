import { OauthLoginProviderEnum } from '@app/auth/authentication/oauth-login-provider.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { OauthLoginRequestType } from '@app/auth/authentication/authentication.type';

export class OauthLoginRequest implements OauthLoginRequestType {
  @IsString()
  @ApiProperty({ default: 'aaa.bbb.ccc' })
  readonly accessToken: string;

  @IsEnum(OauthLoginProviderEnum)
  @ApiProperty({
    enum: OauthLoginProviderEnum,
    default: OauthLoginProviderEnum.GOOGLE,
  })
  readonly provider: OauthLoginProviderEnum;
}
