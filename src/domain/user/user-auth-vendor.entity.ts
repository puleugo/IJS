import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAuth } from './user-auth.entity';

@Entity('user_auth_providers')
export class UserAuthProvider {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @OneToMany(() => UserAuth, (userAuth) => userAuth.provider)
  userAuth: UserAuth[];
}
