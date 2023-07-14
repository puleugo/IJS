import { Module, OnModuleInit } from '@nestjs/common';
import { UserModule } from '@app/user/user.module';
import { AuthenticationService } from '@app/auth/authentication/authentication.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/auth/authentication/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { AuthenticationController } from '@app/auth/authentication/authentication.controller';
import { AuthPhotoClient } from '@app/auth/authentication/utils/auth-photo.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuthProvider } from '@domain/user/user-auth-provider.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAuthProvider]),
    UserModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const issuer = configService.get<string>(
          'APP_URL',
          'https://localhost',
        );
        return {
          secret: configService.get<string>('APP_SECRET', ''),
          verifyOptions: { issuer },
          signOptions: { issuer, notBefore: 0 },
        };
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secure: false,
          auth: {
            user: process.env.EMAIL_ID, // generated ethereal user
            pass: process.env.EMAIL_PASS, // generated ethereal password
          },
        },
        defaults: {
          from: '"인제생 개발팀" <modules@gmail.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    {
      provide: 'AuthPhotoClient',
      useClass: AuthPhotoClient,
    },
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule implements OnModuleInit {
  constructor(private readonly authenticationService: AuthenticationService) {}

  onModuleInit(): any {
    Promise.all([this.authenticationService.initializeAuthProvider()]).then();
  }
}
