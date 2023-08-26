import { Injectable, } from '@nestjs/common';
import { NotificationCreateRequest, } from '@app/notification/dto/notification-create.request';
import { NotificationToken, } from '@domain/user/notification/notification-token.entity';
import { Notification, } from '@domain/user/notification/notification.entity';
import { Repository, } from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { NotificationUpdateRequest, } from '@app/notification/dto/notification-update.request';
import { NotificationCategoryEnum, } from '@app/notification/notification-category.enum';
import * as firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { LoggerService, } from '@infrastructure/utils/logger.service';
import { NotificationResponseType, } from '@app/notification/notification.type';

dotenv.config();
const serviceAccount: firebaseAdmin.ServiceAccount = {
	projectId: process.env.FIREBASE_PROJECT_ID,
	privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
	clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

firebaseAdmin.initializeApp({ credential: firebaseAdmin.credential.cert(serviceAccount), });

@Injectable()
export class NotificationService {
	constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepository: Repository<NotificationToken>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly loggerService: LoggerService
	) {
	}

	async acceptPushNotification(
		userId: string,
		notificationCreateRequest: NotificationCreateRequest
	): Promise<NotificationToken> {
		const notificationToken = this.notificationTokenRepository.create({
			userId,
			deviceType: notificationCreateRequest.deviceType,
			notificationToken: notificationCreateRequest.notificationToken,
		});

		return await this.notificationTokenRepository.save(notificationToken);
	}

	async disablePushNotification(
		userId: string,
		notificationUpdateRequest: NotificationUpdateRequest
	): Promise<void> {
		await this.notificationTokenRepository.update(
			{
				userId,
				deviceType: notificationUpdateRequest.deviceType,
			}, { isDisable: true, }
		);
	}

	async getNotifications(userId: string): Promise<Notification[]> {
		return await this.notificationRepository.find({ where: { notificationToken: { userId, }, }, });
	}

	async sendMessageByUserId(
		userId: string,
		notification: NotificationResponseType,
		category: NotificationCategoryEnum
	): Promise<void> {
		const notificationToken = await this.notificationTokenRepository.findOne({
        	where: {
        		userId,
        		isDisable: false,
        	},
		});
		notification.title ??= this.getNotificationTitleByCategory(category);

		if (!notificationToken) return;
		try {
			await Promise.all([
				this.notificationRepository.save({
					notificationToken,
					title: this.getNotificationTitleByCategory(category),
					body: notification.body,
					category,
				}),
				firebaseAdmin.messaging().send({
					token: notificationToken.notificationToken,
					notification,
					android: { priority: 'high', },
				}),
			]);
		} catch (error) {
			this.loggerService.error(error);
		}
	}

	//TODO: Implement this method
	async sendMessageToCategoryAssigners(): Promise<void> {
		return;
	}

	getNotificationTitleByCategory(category: NotificationCategoryEnum): string {
    	switch (category) {
        	case NotificationCategoryEnum.Meal:
        		return '학식 알림이 도착했습니다.';
    		case NotificationCategoryEnum.Notice:
    			return '학부 공지 알림이 도착했습니다.';
    		case NotificationCategoryEnum.Council:
    			return '학생회 공지 알림이 도착했습니다.';
    		default:
        		return '알림이 도착했습니다.';
    	}
	}
}
