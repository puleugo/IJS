import { UserAuth } from './user-auth.entity';

export interface IUserAuthProvider {
  id: number;
  name: string;
  userAuth: UserAuth[];
}
