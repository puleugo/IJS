import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { UniversityMajor } from '../university/university-major.entity';
import { IsEmail } from 'class-validator';

@Entity('user_profile')
export class UserProfile {
  @PrimaryColumn('uuid')
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

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
}
