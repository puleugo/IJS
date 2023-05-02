import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from '@domain/user/user.entity';

@Entity('user_follows')
export class UserFollow {
  @PrimaryColumn('uuid')
  userId: string;

  @PrimaryColumn('uuid')
  toFollowId: string;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'to_follow_id', referencedColumnName: 'id' })
  toFollow: User;
}
