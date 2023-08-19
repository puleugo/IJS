import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';
import { OauthLoginRequestCommand } from '@app/auth/authentication/command/oauth-login-request.command';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class OauthLoginRequest implements OauthLoginRequestCommand {
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
