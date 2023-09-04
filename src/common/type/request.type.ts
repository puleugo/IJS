import { User, } from '@app/user/domain/user.entity';
import { Request as ExpressRequest, } from 'express';

export type Request = ExpressRequest & {
    user: User;
};
