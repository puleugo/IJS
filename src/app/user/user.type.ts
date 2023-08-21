import { IUser } from '@domain/user/user.interface';
import { IUserSetting } from '@domain/user/user-setting.interface';
import { UniversityLectureProfileResponseType } from '@app/university/university.type';
import { IScheduleSet } from '@domain/user/schedule-set.interface';
import { UserScheduleRoleEnum } from '@app/user/user-schedule-role.enum';

export type ScheduleSetProfileResponseType = {
  scheduleSetId: string;
  qrUrl: string;
};

export type UserPreviewResponseType = Pick<IUser, 'id'>;

export type UserProfileResponseType = Pick<
  IUser,
  'id' | 'isVerified' | 'majorId' | 'schoolId' | 'schoolEmail'
> & {
  settings: Pick<
    IUserSetting,
    | 'isIgnoredMealNotification'
    | 'isIgnoredCouncilNotification'
    | 'isIgnoredNoticeNotification'
  >;
};

export type UserScheduleProfileResponseType = {
  lectures: { [day: string]: UniversityLectureProfileResponseType[] };
};

type userCountInfo = { userCount: number };

export type UserScheduleSetPreviewResponseType = Pick<
  IScheduleSet,
  'id' | 'createdAt'
> &
  userCountInfo;

export type UserScheduleSetProfileResponseType = {
  userId: string;
  role: UserScheduleRoleEnum;
} & UserScheduleProfileResponseType;

export type UserUpdateSettingRequestType = Partial<
  Pick<
    IUserSetting,
    | 'isIgnoredCouncilNotification'
    | 'isIgnoredMealNotification'
    | 'isIgnoredNoticeNotification'
  >
>;

export type UserVerificationRequestType = Pick<
  IUser,
  'name' | 'schoolId' | 'majorId'
>;
