import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserAuthVendor } from './user-auth-vendor.entity';

@Entity('user_auth')
export class UserAuth {
  @Column('varchar', { length: 50, primary: true })
  username: string;

  @Column('uuid', { primary: true })
  userId: string;

  @Column('smallint', { primary: true })
  vendorId: number;

  @ManyToOne(() => User, (user) => user.auth)
  user: User;

  @ManyToOne(() => UserAuthVendor, (vendor) => vendor.userAuth)
  vendor: UserAuthVendor;
}
