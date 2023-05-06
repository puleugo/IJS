import { UniversityMajor } from './university-major.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsUrl } from 'class-validator';
import { IUniversityMajorNotice } from '@domain/university/university-major-notice.interface';

@Entity('university_major_notices')
export class UniversityMajorNotice implements IUniversityMajorNotice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column()
  @IsUrl()
  url: string;

  @Column()
  author: string;

  @Column('timestamp')
  wroteAt: Date;

  @ManyToOne(() => UniversityMajor, (major) => major.notices)
  major: UniversityMajor;
}
