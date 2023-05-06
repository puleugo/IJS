import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '@domain/user/user.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { IUserScheduleSet } from '@domain/user/user-schedule-set.interface';

@Entity('user_schedule_sets')
@Unique(['userId', 'scheduleSetId'])
export class UserScheduleSet implements IUserScheduleSet {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid')
  userId: string;

  @Column('number')
  scheduleSetId: string;

  @ManyToOne(() => User, (user) => user.userScheduleSets)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => ScheduleSet, (scheduleSet) => scheduleSet.users)
  @JoinColumn({ name: 'schedule_set_id', referencedColumnName: 'id' })
  scheduleSet: ScheduleSet;

  @CreateDateColumn()
  createdAt: Date;
}
