import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';
import { OauthLoginRequest } from '@app/auth/authentication/dto/oauth-login.request';
import { TokenResponse } from '@app/auth/authentication/dto/token.response';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';
import { Request } from '@infrastructure/types/request.types';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterRequest } from '@app/auth/authentication/dto/register-request';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({ summary: 'Oauth 로그인' })
  @ApiBody({ type: OauthLoginRequest })
  @ApiResponse({ type: TokenResponse })
  @Post('oauth-login')
  async oauthLogin(
    @Body() oauthLoginRequest: OauthLoginRequest,
  ): Promise<TokenResponse> {
    return await this.authenticationService.oauthLogin(oauthLoginRequest);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @Post('refresh')
  @ApiResponse({ type: TokenResponse })
  async refreshAccessToken(@Req() request: Request): Promise<TokenResponse> {
    return await this.authenticationService.refreshAccessToken(request);
  }

  @ApiOperation({ summary: '회원 정보 조회' })
  @ApiBearerAuth()
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserProfileResponse })
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
  ): Promise<void> {
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
  ): Promise<void> {
    const isUpdated =
      await this.authenticationService.verifySchoolEmailByAuthenticationCode(
        code,
      );
    if (!isUpdated) throw new InternalServerErrorException();
  }

  @Post('verify/identification')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: RegisterRequest,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 인증 이미지(학생증, 합격증명서) 업로드' })
  async uploadRegisterImage(
    @Req() { user }: Request,
    @Body() registerRequest: RegisterRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    await this.authenticationService.uploadRegisterImage(
      registerRequest,
      file.buffer,
      user,
    );
  }

  @Post('approve/identification/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '학생 인증 이미지(학생증, 합격증명서) 승인' })
  async approveRegisterImage(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.authenticationService.approveRegisterImage(userId);
  }
}
