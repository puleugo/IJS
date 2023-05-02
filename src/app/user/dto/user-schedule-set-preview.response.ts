import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';

export class UserScheduleSetPreviewResponse {
  id: string;
  userCount: number;
  createdAt: Date;

  constructor({ scheduleSet }: UserScheduleSet) {
    this.id = scheduleSet.id;
    this.userCount = scheduleSet.users.length;
    this.createdAt = scheduleSet.createdAt;
  }
}
