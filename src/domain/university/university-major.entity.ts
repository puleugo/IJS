import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniversityMajorNotice } from './university-major-notice.entity';

@Entity('university_majors')
export class UniversityMajor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @PrimaryColumn('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 10, unique: true })
  slug: string;

  @Column('text', { unique: true })
  noticeUrl: string;

  @OneToMany(() => UniversityMajorNotice, (notice) => notice.major)
  notices: UniversityMajorNotice[];
}
