import { Module, } from '@nestjs/common';
import { UserService, } from '@app/user/user.service';
import { UserController, } from '@app/user/user.controller';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { User, } from '@app/user/domain/user.entity';
import { UserAuth, } from '@app/user/domain/user-auth.entity';
import { UserAuthProvider, } from '@app/user/domain/user-auth-provider.entity';
import { ScheduleSet, } from '@app/user/domain/schedule-set.entity';
import { UserScheduleSet, } from '@app/user/domain/user-schedule-set.entity';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';
import { UserLecture, } from '@app/user/domain/user-lecture.entity';
import { UserFollow, } from '@app/user/domain/user-follow.entity';
import { UserPhotoClient, } from '@app/user/utils/user-photo.client';
import { UserOcrClient, } from '@app/user/utils/user-ocr.client';
import { HttpModule, } from '@nestjs/axios';
import { JwtModule, } from '@nestjs/jwt';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { UserSetting, } from '@app/user/domain/user-setting.entity';
import { NotificationModule, } from '@app/notification/notification.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			UserSetting,
			UserAuth,
			UserAuthProvider,
			UserLecture,
			UserFollow,
			ScheduleSet,
			UserScheduleSet,
			UniversityLecture,
		]),
		HttpModule,
		NotificationModule,
		JwtModule.registerAsync({
			imports: [ConfigModule,],
			inject: [ConfigService,],
			useFactory: (configService: ConfigService) => {
				const issuer = configService.get<string>(
					'APP_URL', 'https://localhost'
				);

				return {
					secret: configService.get<string>('STUDENT_QR_SECRET', ''),
					verifyOptions: { issuer, },
					signOptions: {
						issuer,
						notBefore: 0,
					},
				};
			},
		}),
	],
	providers: [
		UserService,
		{
			provide: 'UserPhotoClient',
			useClass: UserPhotoClient,
		},
		UserOcrClient,
	],
	controllers: [UserController,],
	exports: [UserService,],
})
export class UserModule {
}
