import {
	Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { User, } from '@app/user/domain/user.entity';

@Entity('notification_tokens')
export class NotificationToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;

    @JoinColumn({
    	name: 'user_id',
    	referencedColumnName: 'id',
    })
    @ManyToOne(() => User)
    user: User;

    @Column()
    deviceType: string;

    @Column()
    notificationToken: string;

    @Column({ default: false, })
    isDisable: boolean;
}
