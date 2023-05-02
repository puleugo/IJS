import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IUniversityLecture } from '@domain/university/university-lecture.interface';
import { UniversitySemester } from '@domain/university/university-semester.entity';
import { User } from '@domain/user/user.entity';

@Entity('university_lectures')
export class UniversityLecture implements IUniversityLecture {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  @Index()
  title: string;

  @Column('smallint')
  weekdayIndex: number;

  @Column('varchar', { length: 30 })
  classRoom: string;

  @Column('smallint')
  startAt: number;

  @Column('smallint')
  endAt: number;

  @ManyToOne(() => UniversitySemester, (semester) => semester.lectures)
  semester: UniversitySemester;

  @OneToMany(() => User, (user) => user.lectures, { cascade: true })
  users: User[];

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    if (this.weekdayIndex < 0 || this.weekdayIndex > 4) {
      throw new Error('weekdayIndex must be between 0 and 4');
    }
    if (this.startAt < 0 || this.startAt > 9) {
      throw new Error('startAt must be between 0 and 9');
    }
    if (this.endAt < 0 || this.endAt > 9) {
      throw new Error('endAt must be between 0 and 9');
    }
  }
}
