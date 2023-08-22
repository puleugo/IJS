import { User, } from '@domain/user/user.entity';
import { Request as ExpressRequest, } from 'express';

export type Request = ExpressRequest & {
    user: User;
};
