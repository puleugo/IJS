import { UniversityMajor } from './university-major.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsUrl } from 'class-validator';
import { IUniversityNotice } from '@domain/university/university-major-notice.interface';

@Entity('university_notices')
@Index(['title', 'majorId', 'slug'])
export class UniversityNotice implements IUniversityNotice {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ type: 'char', length: 4000 })
  content: string;

  @Column()
  @IsUrl()
  url: string;

  @Column()
  author: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'simple-array' })
  files: string[];

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ type: 'smallint', nullable: true })
  majorId: number | null;

  @ManyToOne(() => UniversityMajor, (major) => major.notices, {
    nullable: true,
  })
  @JoinColumn({ name: 'major_id' })
  major: UniversityMajor;

  @Column('timestamp')
  wroteAt: Date;
}
