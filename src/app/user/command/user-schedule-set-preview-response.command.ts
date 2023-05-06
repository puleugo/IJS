import { IScheduleSet } from '@domain/user/schedule-set.interface';

type userCountInfo = { userCount: number };

export type UserScheduleSetPreviewResponseCommand = Pick<
  IScheduleSet,
  'id' | 'createdAt'
> &
  userCountInfo;
