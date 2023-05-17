import { Module } from '@nestjs/common';
import { UniversityMealCrawlerModule } from '@app/crawler/university-meal-crawler/university-meal-crawler.module';
import { UniversityBusScheduleCrawlerModule } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.module';
import { UniversityEventCrawlerModule } from '@app/crawler/university-event-crawler/university-event-crawler.module';
import { UniversityLectureCrawlerModule } from '@app/crawler/university-lecture-crawler/university-lecture-crawler.module';
import { UniversityMajorCrawlerModule } from '@app/crawler/university-major-crawler/university-major-crawler.module';
import { UniversityMajorNoticeCrawlerModule } from '@app/crawler/university-major-notice-crawler/university-major-notice-crawler.module';
import { UniversityProgramCrawlerModule } from '@app/crawler/university-program-crawler/university-program-crawler.module';

@Module({
  imports: [
    UniversityBusScheduleCrawlerModule,
    UniversityEventCrawlerModule,
    UniversityLectureCrawlerModule,
    UniversityMajorCrawlerModule,
    UniversityMajorNoticeCrawlerModule,
    UniversityMealCrawlerModule,
    UniversityProgramCrawlerModule,
  ],
})
export class CrawlerModule {}
