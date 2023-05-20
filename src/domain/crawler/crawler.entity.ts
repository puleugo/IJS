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

  @Column({ type: 'int' })
  executeIntervalHours: number;

  @OneToMany(() => CrawlerLog, (log) => log.crawler)
  logs: CrawlerLog[];

  @CreateDateColumn()
  createdAt: Date;
}
