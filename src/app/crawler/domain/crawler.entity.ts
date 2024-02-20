import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('crawlers')
export class Crawler extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, })
    name: string;

    @Column({
    	type: 'varchar',
    	length: 20,
    	default: '* 0 * * * *',
    }) // 0~6, 0: Sunday, 6: Saturday
    cronTime: string;

    @Column({ default: 'STOPPED', })
    state: 'RUNNING' | 'STOPPED' | 'FAILED';

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    private validateCronTime(): void {
    	if (!this.cronTime) return;
    	const splitCronTime = this.cronTime.split(' ').slice(0, 6);
    	if (splitCronTime.length !== 6) {
    		this.cronTime = '0 * * * * 1';
    	}
    	splitCronTime.map((time) => {
    		if (time === '*' && typeof Number(time) === 'number') {
    			this.cronTime = splitCronTime.join(' ');

    			return;
    		}
    		this.cronTime = '0 * * * * 1';

    		return;
    	});
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validateState(): void {
    	if (
    		this.state !== 'RUNNING' &&
            this.state !== 'STOPPED' &&
            this.state !== 'FAILED'
    	) {
    		this.state = 'STOPPED';
    	}
    }
}
