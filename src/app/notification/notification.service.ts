import { Injectable } from '@nestjs/common';
import { NotificationCreateRequest } from '@app/notification/dto/notification-create.request';
import { NotificationToken } from '@domain/user/notification/notification-token.entity';
import { Notification } from '@domain/user/notification/notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationUpdateRequest } from '@app/notification/dto/notification-update.request';
import { NotificationProfileResponse } from '@app/notification/dto/notification-profile.response';
import { NotificationCategoryEnum } from '@app/notification/notification-category.enum';
import * as firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();
const serviceAccount: firebaseAdmin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationToken)
    private readonly notificationTokenRepository: Repository<NotificationToken>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async acceptPushNotification(
    userId: string,
    notificationCreateRequest: NotificationCreateRequest,
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
    notificationUpdateRequest: NotificationUpdateRequest,
  ): Promise<void> {
    await this.notificationTokenRepository.update(
      { userId, deviceType: notificationUpdateRequest.deviceType },
      {
        isDisable: true,
      },
    );
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { notificationToken: { userId } },
    });
  }

  async sendPush(
    userId: string,
    title: string,
    body: string,
    category: NotificationCategoryEnum,
  ): Promise<void> {
    try {
      const notificationToken = await this.notificationTokenRepository.findOne({
        where: { userId, isDisable: false },
      });
      if (notificationToken) {
        await this.notificationRepository.save({
          notificationToken,
          title,
          body,
          category,
        });
        await firebaseAdmin
          .messaging()
          .send({
            notification: new NotificationProfileResponse({
              title,
              body,
              category,
            }),
            token: notificationToken.notificationToken,
            android: { priority: 'high' },
          })
          .catch((error: any) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
