import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniversitySemester } from './university-semester.entity';
import { IUniversityLecture } from './university-lecture.interface';

@Entity('university_lectures')
export class UniversityLecture implements IUniversityLecture {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  @Index()
  title: string;

  @Column('smallint')
  weekdayIndex: number;

  @Column('text')
  classRoom: string;

  @ManyToOne(() => UniversitySemester, (semester) => semester.lectures)
  semester: UniversitySemester;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    if (this.weekdayIndex < 0 || this.weekdayIndex > 4) {
      throw new Error('weekdayIndex must be between 0 and 4');
    }
  }
}
