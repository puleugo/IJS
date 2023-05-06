import { IUser } from '@domain/user/user.interface';

export type UserProfileResponseCommand = Pick<
  IUser,
  'id' | 'majorId' | 'schoolId' | 'schoolEmail'
>;
