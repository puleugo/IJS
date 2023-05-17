import { Module } from '@nestjs/common';
import { UniversityEventCrawlerClient } from '@app/crawler/university-event-crawler/university-event-crawler.client';

@Module({
  providers: [UniversityEventCrawlerClient],
})
export class UniversityEventCrawlerModule {}
