import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';
import { OauthLoginRequest } from '@app/auth/authentication/dto/oauth-login.request';
import { TokenResponse } from '@app/auth/authentication/dto/token.response';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('oauth')
  @ApiOperation({ summary: 'Oauth 로그인' })
  @ApiBody({ type: OauthLoginRequest })
  async oauthLogin(
    @Body() oauthLoginRequest: OauthLoginRequest,
  ): Promise<TokenResponse> {
    return await this.authenticationService.oauthLogin(oauthLoginRequest);
  }

  @Post('verify/school-email')
  @ApiOperation({ summary: '학교 이메일 인증' })
  async verifySchoolEmail() {
    await this.authenticationService.verifySchoolEmail();
  }
}
