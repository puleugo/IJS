import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IUniversityBusSchedule } from '@domain/university/university-bus-schedule.interface';

@Entity('university_bus_schedules')
export class UniversityBusSchedule implements IUniversityBusSchedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column('smallint')
  price: number;

  @Column('time')
  departedOn: Date;

  @Column({ type: 'boolean' })
  toSchool: boolean;

  @Column({ type: 'boolean' })
  fromSchool: boolean;
}
