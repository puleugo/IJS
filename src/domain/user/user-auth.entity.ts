import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserAuthProvider } from './user-auth-provider.entity';
import { IUserAuth } from '@domain/user/user-auth.interface';

@Entity('user_auth')
export class UserAuth implements IUserAuth {
  @Column('varchar', { length: 50, primary: true })
  username: string;

  @Column('uuid', { primary: true })
  userId: string;

  @Column('smallint', { primary: true })
  providerId: number;

  @ManyToOne(() => User, (user) => user.auth)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => UserAuthProvider, (vendor) => vendor.userAuth)
  @JoinColumn({ name: 'vendor_provider_id', referencedColumnName: 'id' })
  provider: UserAuthProvider;
}
