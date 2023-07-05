import { IUser } from '@domain/user/user.interface';

export type UserProfileResponseCommand = Pick<
  IUser,
  'id' | 'isVerified' | 'majorId' | 'schoolId' | 'schoolEmail'
>;
