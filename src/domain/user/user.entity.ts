import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';
import { UserProfile } from './user-profile.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @OneToMany(() => UserAuth, (auth) => auth.user)
  auth: UserAuth[];

  @OneToMany(() => UserScheduleSet, (userScheduleSet) => userScheduleSet.user)
  userScheduleSets: UserScheduleSet[];

  @OneToMany(() => ScheduleSet, (scheduleSet) => scheduleSet.owner)
  createdScheduleSets: ScheduleSet[];

  @OneToMany(() => UserLecture, (lecture) => lecture.user)
  lectures: UserLecture[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
