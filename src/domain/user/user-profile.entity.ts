import { Entity, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { UniversityMajor } from '../university/university-major.entity';

@Entity('user_profile')
export class UserProfile {
  @PrimaryColumn('uuid')
  userId: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @ManyToOne(() => UniversityMajor, (major) => major.notices)
  major: UniversityMajor;
}
