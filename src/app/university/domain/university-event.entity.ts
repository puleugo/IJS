import {
	Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';

@Entity('university_events')
@Unique(['title',
	'startAt',
	'endAt',])
export class UniversityEvent {
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
