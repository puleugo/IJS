import { Module, } from '@nestjs/common';
import { NotificationService, } from '@app/notification/notification.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { Notification, } from '@app/notification/domain/notification.entity';
import { NotificationToken, } from '@app/notification/domain/notification-token.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Notification, NotificationToken,]),],
	providers: [NotificationService,],
	exports: [NotificationService,],
})
export class NotificationModule {
}
