import { IUser } from '@domain/user/user.interface';

export type UserPreviewResponseCommand = Pick<IUser, 'id'>;
