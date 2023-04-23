import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('university_bus_schedules')
export class UniversityBusSchedule {
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
