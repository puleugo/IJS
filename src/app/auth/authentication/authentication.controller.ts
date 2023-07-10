import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
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

  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() { user }: Request): Promise<UserProfileResponse> {
    const foundUser = await this.authenticationService.getProfile(user.id);
    return new UserProfileResponse(foundUser);
  }

  @Post('verify/mail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 이메일 인증 및 학과 등록' })
  async verifySchoolId(
    @Query('schoolEmail')
    schoolEmail: string,
    @Query('schoolId') schoolId: string,
    @Query('majorId', ParseIntPipe) majorId: number,
    @Req() { user }: Request,
  ) {
    await this.authenticationService.verifySchoolId({
      user,
      schoolEmail,
      schoolId,
      majorId,
    });
  }

  @Post('approve/mail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학교 이메일 인증 및 학과 등록' })
  async verifySchoolEmailByAuthenticationCode(
    @Query('code') code: string,
  ): Promise<string> {
    const updated =
      await this.authenticationService.verifySchoolEmailByAuthenticationCode(
        code,
      );
    if (updated) {
      return '인증이 완료되었습니다.';
    }
  }

  @Post('verify/identification')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 인증 이미지(학생증, 합격증명서) 업로드' })
  async uploadRegisterImage(
    @Req() { user }: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    await this.authenticationService.uploadRegisterImage(file.buffer, user);
    return '인증 이미지가 업로드 되었습니다.';
  }

  @Post('approve/identification/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 인증 이미지(학생증, 합격증명서) 승인' })
  async approveRegisterImage(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<string> {
    await this.authenticationService.approveRegisterImage(userId);
    return '인증이 완료되었습니다.';
  }
}
