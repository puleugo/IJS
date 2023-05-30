import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';
import { OauthLoginRequest } from '@app/auth/authentication/dto/oauth-login.request';
import { TokenResponse } from '@app/auth/authentication/dto/token.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { Request } from '@infrastructure/types/request.types';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
// import { GoogleOAuthGuard } from '@app/auth/authentication/src/auth.google.gaurd';
// import { Controller, Get, Request, UseGuards } from '@nestjs/common';
// import { AppService } from '@app/auth/authentication/src/auth.google.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Oauth 로그인' })
  @ApiBody({ type: OauthLoginRequest })
  @ApiResponse({ type: TokenResponse })
  @Post('oauth')
  async oauthLogin(
    @Body() oauthLoginRequest: OauthLoginRequest,
  ): Promise<TokenResponse> {
    return await this.authenticationService.oauthLogin(oauthLoginRequest);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() { user }: Request): Promise<UserProfileResponse> {
    return new UserProfileResponse(user);
  }

  @Post('verify/school-id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 이메일 인증 및 학과 등록' })
  async verifySchoolId(
    @Query('schoolEmail') schoolEmail: string,
    @Query('schoolId') schoolId: string,
    @Query('schoolMajor') schoolMajor: string,
  ) {
    await this.authenticationService.verifySchoolId({
      schoolEmail,
      schoolId,
      schoolMajor,
    });
  }

  // @Get()
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuth(@Request() req) {}

  // @Get('google-redirect')
  // @UseGuards(GoogleOAuthGuard)
  // googleAuthRedirect(@Request() req) {
  //   return this.appService.googleLogin(req);
  // }
}