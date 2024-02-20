import { NotificationToken, } from '@app/notification/domain/notification-token.entity';
import { Notification, } from '@app/notification/domain/notification.entity';
import { Notification as FirebaseNotification, } from 'firebase-admin/messaging';

export type NotificationCreateRequestType = Pick<
    NotificationToken,
    'notificationToken' | 'deviceType'
>;

export type NotificationUpdateRequestType = Partial<
    Pick<NotificationCreateRequestType, 'deviceType'>
>;

export type NotificationProfileResponseType = Pick<
    Notification,
    'title' | 'body'
> &
    Partial<Pick<Notification, 'category'>> & { categoryName?: string };

export type NotificationRequestType = Pick<FirebaseNotification, 'title' | 'body'>
