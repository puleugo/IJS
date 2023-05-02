import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { User } from '@domain/user/user.entity';

@Entity('schedule_sets')
export class ScheduleSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User, (owner) => owner.createdScheduleSets)
  owner: User;

  @OneToMany(
    () => UserScheduleSet,
    (userScheduleSet) => userScheduleSet.scheduleSet,
  )
  users: UserScheduleSet[];

  @CreateDateColumn()
  createdAt: Date;
}
