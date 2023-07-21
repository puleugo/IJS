import { User } from './user.entity';
import { UserAuthProvider } from './user-auth-provider.entity';

export interface IUserAuth {
  username: string;
  userId: string;
  providerId: number;
  user: User;
  provider: UserAuthProvider;
}
