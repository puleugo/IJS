import { Module, } from '@nestjs/common';
import { NotificationService, } from '@app/notification/notification.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { Notification, } from '@domain/user/notification/notification.entity';
import { NotificationToken, } from '@domain/user/notification/notification-token.entity';
import { LoggerService, } from '@infrastructure/utils/logger.service';

@Module({
	imports: [TypeOrmModule.forFeature([Notification, NotificationToken,]),],
	providers: [NotificationService, LoggerService,],
	exports: [NotificationService,],
})
export class NotificationModule {
}
