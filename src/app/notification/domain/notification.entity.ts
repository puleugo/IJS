import {
	Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationToken, } from '@app/notification/domain/notification-token.entity';
import { NotificationCategoryEnum, } from '@app/notification/domain/notification-category.enum';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => NotificationToken)
    @JoinColumn({
    	name: 'notification_token_id',
    	referencedColumnName: 'id',
    })
    notificationToken: NotificationToken;

    @Column()
    title: string;

    @Column({
    	type: 'text',
    	nullable: true,
    })
    body: string;

    @Column('int2', { default: NotificationCategoryEnum.Unknown, })
    category: NotificationCategoryEnum;
}
