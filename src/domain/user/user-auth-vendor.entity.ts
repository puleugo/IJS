import {
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity('user_auth_vendors')
export class UserAuthVendor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn('varchar', { length: 50 })
  name: string;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.vendor)
  userAuth: UserAuth[];
}
