import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UniversityMajorNotice } from './university-major-notice.entity';
import { UniversityEvent } from './university-event.entity';

@Entity('university_majors')
export class UniversityMajor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 10, unique: true })
  slug: string;

  @Column('text', { unique: true })
  noticeUrl: string;

  @OneToMany(() => UniversityMajorNotice, (notice) => notice.major)
  notices: UniversityMajorNotice[];

  @OneToMany(() => UniversityEvent, (event) => event.major)
  events: UniversityEvent[];
}
