import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UniversityLecture } from './university-lecture.entity';

@Entity('university_semesters')
export class UniversitySemester {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('smallint')
  year: number;

  @Column('date')
  startedAt: Date;

  @Column('date')
  endedAt: Date;

  @OneToMany(() => UniversityLecture, (lecture) => lecture.semester)
  lectures: UniversityLecture[];
}
