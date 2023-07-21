import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAuth } from './user-auth.entity';
import { IUserAuthProvider } from '@domain/user/user-auth-provider.interface';

@Entity('user_auth_providers')
export class UserAuthProvider implements IUserAuthProvider {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50, unique: true })
  name: string;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.provider)
  userAuth: UserAuth[];
}
