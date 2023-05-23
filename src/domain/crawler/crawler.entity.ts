import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CrawlerLog } from '@domain/crawler/crawler-log.entity';

@Entity('crawlers')
export class Crawler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text', default: '* 0 * * * *' }) // 0~6, 0: Sunday, 6: Saturday
  cronTime: string;

  @OneToMany(() => CrawlerLog, (log) => log.crawler)
  logs: CrawlerLog[];

  @CreateDateColumn()
  createdAt: Date;
}
