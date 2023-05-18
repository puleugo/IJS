import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAuth } from './user-auth.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { IsEmail } from 'class-validator';
import { IUser } from '@domain/user/user.interface';
import { Delivery } from '@domain/delivery/delivery.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int', { nullable: true })
  majorId: number | null;

  @ManyToOne(() => UniversityMajor, (major) => major.notices, {
    nullable: true,
  })
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: UniversityMajor;

  @Column('varchar', { nullable: true, length: 20 })
  schoolId: string | null;

  @Column('varchar', { nullable: true, length: 255 })
  @IsEmail()
  schoolEmail: string | null;

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

  @ManyToOne(() => Delivery, (delivery) => delivery.users, { nullable: true })
  delivery: Delivery | null;
}
