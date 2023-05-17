import { Module } from '@nestjs/common';
import { UniversityBusScheduleCrawlerClient } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.client';

@Module({
  providers: [UniversityBusScheduleCrawlerClient],
})
export class UniversityBusScheduleCrawlerModule {}
