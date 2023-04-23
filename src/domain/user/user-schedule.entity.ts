import { User } from './user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_schedules')
export class UserSchedule {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 100 })
  title: string;

  @Column('time')
  startTime: Date;

  @Column('time')
  endTime: Date;

  @ManyToOne(() => User, (user) => user.schedules)
  user: User;
}
