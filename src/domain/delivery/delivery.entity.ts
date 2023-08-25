import {
	Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('deliveries')
export class Delivery {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderName: string;

    @Column()
    storeUrl: string;

    @Column()
    orderUrl: string;

    @Column()
    deliveryUrl: string;

    // @OneToMany(() => User, ({ delivery, }) => delivery)
    // users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;
}
