import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserAuthProvider } from './user-auth-vendor.entity';

export interface IUserAuth {
  username: string;
  userId: string;
  providerId: number;
  user: User;
  provider: UserAuthProvider;
}
