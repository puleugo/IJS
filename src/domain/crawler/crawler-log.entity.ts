import {
	Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { Crawler, } from '@domain/crawler/crawler.entity';
import { CrawlerStateEnum, } from '@domain/crawler/crawler-state.enum';

@Entity('crawler_logs')
export class CrawlerLog {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    crawlerName: string;

    @Column('text')
    state: CrawlerStateEnum;

    @ManyToOne(() => Crawler, (crawler) => crawler.logs)
    @JoinColumn({
    	name: 'crawlerName',
    	referencedColumnName: 'name',
    })
    crawler: Crawler;

    @CreateDateColumn()
    createdAt: Date;
}
