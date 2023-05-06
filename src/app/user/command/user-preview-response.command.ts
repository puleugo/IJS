import { User } from '@domain/user/user.entity';
import { IUser } from '@domain/user/user.interface';

export type UserPreviewResponseCommand = Pick<IUser, 'id'>;
