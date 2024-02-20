import { Module, } from '@nestjs/common';
import { UniversityModule, } from '@app/university/university.module';
import { HealthCheckModule, } from '@app/health/health-check.module';
import { UserModule, } from '@app/user/user.module';
import { AuthModule, } from '@app/auth/auth.module';
import { CrawlerModule, } from '@app/crawler/crawler.module';
import { CommunityModule, } from '@app/community/community.module';
import { NotificationModule, } from './notification/notification.module';
import { CronModule, } from '@app/cron/cron.module';

@Module({
	imports: [
		UniversityModule,
		HealthCheckModule,
		UserModule,
		AuthModule,
		CrawlerModule,
		CommunityModule,
		NotificationModule,
		CronModule,
	],
})
export class AppModule {
}
