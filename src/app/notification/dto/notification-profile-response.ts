import { Notification } from '@domain/user/notification/notification.entity';
import { NotificationCategoryEnum } from '@app/notification/notification-category.enum';

type NotificationProfileResponseCommand = Pick<Notification, 'title' | 'body'> &
  Partial<Pick<Notification, 'category'>> & { categoryName?: string };

const NotificationCategoryName = new Map<number, string>([
  [NotificationCategoryEnum.Unknown, '확인되지 않음'],
  [NotificationCategoryEnum.Meal, '오늘의 학식'],
  [NotificationCategoryEnum.Council, '학생회'],
  [NotificationCategoryEnum.Notice, '학부 공지사항'],
]);

export class NotificationProfileResponse
  implements NotificationProfileResponseCommand
{
  body: string;
  title: string;
  categoryName: string;

  constructor(command: NotificationProfileResponseCommand) {
    this.body = command.body;
    this.title = command.title;
    this.categoryName = NotificationCategoryName.get(command.category);
  }
}
