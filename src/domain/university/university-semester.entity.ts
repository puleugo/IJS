import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { IUniversitySemester } from '@domain/university/university-semester.interface';
import { UniversityLecture } from '@domain/university/university-lecture.entity';

@Entity('university_semesters')
@Unique(['year', 'semesterNumber'])
export class UniversitySemester implements IUniversitySemester {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50, unique: true })
  name: string;

  @Column('smallint')
  year: number;

  @Column('date')
  startedAt: Date;

  @Column('date')
  endedAt: Date;

  @Column('smallint')
  semesterNumber: number;

  @Column('date')
  middleExamAt: Date;

  @Column('date')
  finalExamAt: Date;

  @OneToMany(() => UniversityLecture, (lecture) => lecture.semester)
  lectures: UniversityLecture[];
}
