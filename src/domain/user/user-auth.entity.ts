import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { UserAuthProvider } from './user-auth-vendor.entity';

@Entity('user_auth')
export class UserAuth {
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
