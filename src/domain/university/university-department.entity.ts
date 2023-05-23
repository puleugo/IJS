import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { IUniversityDepartment } from '@domain/university/university-department.interface';

@Entity({ name: 'university_departments' })
@Unique(['name', 'url'])
export class UniversityDepartment implements IUniversityDepartment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  url: string | null;

  @Column({ nullable: true })
  slug: string | null;

  @OneToMany(() => UniversityMajor, (major) => major.department)
  majors: UniversityMajor[];
}
