import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniversityMajor } from './university-major.entity';

@Entity('university_events')
export class UniversityEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  majorId: number | null;

  @Column('date')
  startedAt: Date;

  @Column('date')
  endedAt: Date;

  @Column('boolean')
  isFinishDate: boolean;

  @Column('boolean')
  isStartedDate: boolean;

  @ManyToOne(() => UniversityMajor, (major) => major.events)
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: UniversityMajor;
}
