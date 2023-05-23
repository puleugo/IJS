import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UniversityMajorNotice } from './university-major-notice.entity';
import { UniversityEvent } from './university-event.entity';
import { IUniversityMajor } from './university-major.interface';
import { UniversityDepartment } from '@domain/university/university-department.entity';

@Entity('university_majors')
@Unique(['name', 'departmentId'])
export class UniversityMajor implements IUniversityMajor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 50, unique: true, nullable: true })
  slug: string;

  @Column('int')
  departmentId: number;

  @Column('text', { unique: true, nullable: true })
  noticeUrl: string;

  @ManyToOne(() => UniversityDepartment, (department) => department.majors)
  @JoinColumn({ name: 'department_id', referencedColumnName: 'id' })
  department: UniversityDepartment;

  @OneToMany(() => UniversityMajorNotice, (notice) => notice.major)
  notices: UniversityMajorNotice[];

  @OneToMany(() => UniversityEvent, (event) => event.major)
  events: UniversityEvent[];
}
