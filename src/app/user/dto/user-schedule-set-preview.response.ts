import { UserScheduleSetPreviewResponseCommand } from '@app/user/command/user-schedule-set-preview-response.command';
import { IUserScheduleSet } from '@domain/user/user-schedule-set.interface';

export class UserScheduleSetPreviewResponse
  implements UserScheduleSetPreviewResponseCommand
{
  id: string;
  userCount: number;
  createdAt: Date;

  constructor({ scheduleSet }: IUserScheduleSet) {
    this.id = scheduleSet.id;
    this.userCount = scheduleSet.users.length;
    this.createdAt = scheduleSet.createdAt;
  }
}
