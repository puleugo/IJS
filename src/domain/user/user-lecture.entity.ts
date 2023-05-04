import { User } from '@domain/user/user.entity';
import { UniversityLecture } from '@domain/university/university-lecture.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUserLecture } from '@domain/user/user-lecture.interface';

@Entity('user_lectures')
@Unique(['userId', 'lectureId'])
export class UserLecture implements IUserLecture {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('uuid')
  userId: string;

  @Column('int')
  lectureId: number;

  @ManyToOne(() => User, (user) => user.lectures)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => UniversityLecture, (lecture) => lecture.users)
  @JoinColumn({ name: 'lecture_id', referencedColumnName: 'id' })
  lecture: UniversityLecture;
}
