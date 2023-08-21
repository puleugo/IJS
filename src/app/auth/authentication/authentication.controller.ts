import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
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
import { OauthLoginProviderEnum } from '@app/auth/authentication/oauth-login-provider.enum';
import { User } from '@domain/user/user.entity';
import {
  JwtDecodedData,
  JwtSubjectType,
} from '@infrastructure/types/jwt.types';
import { UserService } from '@app/user/user.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { UniversityService } from '@app/university/university.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly universityService: UniversityService,
    private readonly configService: ConfigService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @ApiOperation({ summary: 'Oauth 로그인' })
  @ApiBody({ type: OauthLoginRequest })
  @ApiResponse({ type: TokenResponse })
  @Post('oauth-login')
  async oauthLogin(
    @Body() oauthLoginRequest: OauthLoginRequest,
  ): Promise<TokenResponse> {
    let user: User;
    switch (oauthLoginRequest.provider) {
      case OauthLoginProviderEnum.KAKAO:
        user = await this.authenticationService.kakaoOauthLogin(
          oauthLoginRequest.accessToken,
        );
        break;
      case OauthLoginProviderEnum.GOOGLE:
        user = await this.authenticationService.googleOauthLogin(
          oauthLoginRequest.accessToken,
        );
        break;
      default:
        throw new UnauthorizedException();
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.authenticationService.generateAccessToken(user.id),
      this.authenticationService.generateRefreshToken(user.id),
    ]);
    return new TokenResponse(accessToken, refreshToken);
  }

  @ApiOperation({ summary: '토큰 갱신' })
  @Post('refresh')
  @ApiResponse({ type: TokenResponse })
  async refreshAccessToken(@Req() request: Request): Promise<TokenResponse> {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException();

    const token = <JwtDecodedData>this.jwtService.decode(refreshToken);
    if (!token || token.sub !== JwtSubjectType.REFRESH) {
      throw new UnauthorizedException('invalid token');
    }

    const account = await this.userService.findById(token.user_id);
    const accessToken = await this.authenticationService.generateAccessToken(
      account.id,
    );

    return new TokenResponse(accessToken, refreshToken);
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
    @Query('schoolEmail') schoolEmail: string,
    @Query('schoolId') schoolId: string,
    @Query('majorId', ParseIntPipe) majorId: number,
    @Req() { user }: Request,
  ): Promise<void> {
    await this.authenticationService.sendVerifySchoolMail(user.id, {
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
    @Req() { user }: Request,
  ): Promise<void> {
    const userData =
      await this.authenticationService.getUserInRedisByAuthenticationCode(code);
    if (!userData || userData.id !== user.id) {
      throw new BadRequestException('잘못된 인증 코드입니다.');
    }
    await this.authenticationService.deleteRedisDataByKey(`code_${code}`);

    await this.userService.updateUserById(userData.id, {
      ...userData,
      isVerified: true,
    });
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
    const photoUrl = await this.authenticationService.uploadRegisterImage(
      file.buffer,
    );
    await this.authenticationService.requestVerificationWithSlack(
      registerRequest,
      user.id,
      photoUrl,
    );
  }

  @Post('approve/identification/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '학생 인증 이미지(학생증, 합격증명서) 승인 (어드민용 API)',
  })
  async approveRegisterImage(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    await this.authenticationService.updateUserSchoolAuthentication(userId);
  }
}
