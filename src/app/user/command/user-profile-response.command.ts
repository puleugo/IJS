import { IUser } from '@domain/user/user.interface';
import { IUserSetting } from '@domain/user/user-setting.interface';

export type UserProfileResponseCommand = Pick<
  IUser,
  'id' | 'isVerified' | 'majorId' | 'schoolId' | 'schoolEmail'
> & {
  settings: Pick<
    IUserSetting,
    | 'isIgnoredGeneralNotification'
    | 'isIgnoredMealNotification'
    | 'isIgnoredCouncilNotification'
    | 'isIgnoredNoticeNotification'
  >;
};
