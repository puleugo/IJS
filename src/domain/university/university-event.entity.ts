import {
	Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { IUniversityEvent, } from '@domain/university/university-event.interface';
import { UniversityMajor, } from '@domain/university/university-major.entity';

@Entity('university_events')
@Unique(['title',
	'startAt',
	'endAt',])
export class UniversityEvent implements IUniversityEvent {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column({ nullable: true, })
    majorId: number | null;

    @Column('date')
    startAt: Date;

    @Column('date')
    endAt: Date;

    @ManyToOne(() => UniversityMajor, ({ events, }) => events)
    @JoinColumn({
    	name: 'major_id',
    	referencedColumnName: 'id',
    })
    major: UniversityMajor;
}
