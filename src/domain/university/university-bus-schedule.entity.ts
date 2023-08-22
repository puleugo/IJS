import {
	Column, Entity, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { IUniversityBusSchedule, } from '@domain/university/university-bus-schedule.interface';

@Entity('university_bus_schedules')
@Unique(['title',
	'departedOn',
	'price',
	'toSchool',
	'fromSchool',])
export class UniversityBusSchedule implements IUniversityBusSchedule {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
    	type: 'varchar',
    	length: 20,
    })
    title: string;

    @Column('smallint')
    price: number;

    @Column('time')
    departedOn: Date;

    @Column({
    	type: 'boolean',
    	default: false,
    })
    toSchool: boolean;

    @Column({
    	type: 'boolean',
    	default: false,
    })
    fromSchool: boolean;
}
