import { IUserSetting } from '@domain/user/user-setting.interface';

export type UserUpdateSettingRequestCommand = Partial<
  Pick<
    IUserSetting,
    | 'isIgnoredCouncilNotification'
    | 'isIgnoredMealNotification'
    | 'isIgnoredNoticeNotification'
  >
>;