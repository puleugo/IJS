import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUniversitySemester } from '@domain/university/university-semester.interface';
import { UniversityLecture } from '@domain/university/university-lecture.entity';

@Entity('university_semesters')
export class UniversitySemester implements IUniversitySemester {
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
