import { Module } from '@nestjs/common';
import { UniversityEventCrawlerClient } from '@app/crawler/university-event-crawler/university-event-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityEvent } from '@domain/university/university-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityEvent])],
  providers: [UniversityEventCrawlerClient],
})
export class UniversityEventCrawlerModule {}
