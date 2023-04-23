import { UniversityMajor } from './university-major.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('university_major_notices')
export class UniversityMajorNotice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @Column()
  authorNickname: string;

  @Column()
  noticeId: string;

  @Column('timestamp')
  wroteAt: Date;

  @ManyToOne(() => UniversityMajor, (major) => major.notices)
  major: UniversityMajor;
}
