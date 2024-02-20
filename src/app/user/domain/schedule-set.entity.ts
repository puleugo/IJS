import {
	Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { UserScheduleSet, } from '@app/user/domain/user-schedule-set.entity';
import { User, } from '@app/user/domain/user.entity';

@Entity('schedule_sets')
export class ScheduleSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  ownerId: string;

  @ManyToOne(() => User, ({ createdScheduleSets, }) => createdScheduleSets)
  owner: User;

  @OneToMany(() => UserScheduleSet, ({ scheduleSet, }) => scheduleSet)
  users: UserScheduleSet[];

  @CreateDateColumn()
  createdAt: Date;
}
