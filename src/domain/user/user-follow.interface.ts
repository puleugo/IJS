import { User, } from '@domain/user/user.entity';

export interface IUserFollow {
    userId: string;
    toFollowId: string;
    user: User;
    toFollow: User;
}
