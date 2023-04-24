import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UniversityMajor } from './university-major.entity';
import { IUniversityEvent } from './university-event.interface';

@Entity('university_events')
export class UniversityEvent implements IUniversityEvent {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  majorId: number | null;

  @Column('date')
  startAt: Date;

  @Column('date')
  endAt: Date;

  @ManyToOne(() => UniversityMajor, (major) => major.events)
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: UniversityMajor;
}
