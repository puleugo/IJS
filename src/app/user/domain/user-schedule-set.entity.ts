import {
	Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { User, } from '@app/user/domain/user.entity';
import { ScheduleSet, } from '@app/user/domain/schedule-set.entity';

@Entity('user_schedule_sets')
@Unique(['userId', 'scheduleSetId',])
export class UserScheduleSet {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('uuid')
    userId: string;

    @Column('number')
    scheduleSetId: string;

    @ManyToOne(() => User, ({ userScheduleSets, }) => userScheduleSets)
    @JoinColumn({
    	name: 'user_id',
    	referencedColumnName: 'id',
    })
    user: User;

    @ManyToOne(() => ScheduleSet, ({ users, }) => users)
    @JoinColumn({
    	name: 'schedule_set_id',
    	referencedColumnName: 'id',
    })
    scheduleSet: ScheduleSet;

    @CreateDateColumn()
    createdAt: Date;
}
