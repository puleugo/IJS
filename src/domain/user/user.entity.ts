import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import { UserSchedule } from './user-schedule.entity';
import { UserAuth } from './user-auth.entity';
import { UserProfile } from './user-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @Column('varchar', { nullable: true, length: 255 })
  @IsEmail()
  schoolEmail: string | null;

  @OneToMany(() => UserSchedule, (schedule) => schedule.user, {
    onUpdate: 'CASCADE',
  })
  schedules: UserSchedule[];

  @OneToMany(() => UserAuth, (auth) => auth.user)
  auth: UserAuth[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
