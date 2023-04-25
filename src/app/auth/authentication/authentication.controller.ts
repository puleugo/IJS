import { Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  async oauthLogin() {
    await this.authenticationService.oauthLogin();
  }

  @Post()
  async verifySchoolEmail() {
    await this.authenticationService.verifySchoolEmail();
  }
}
