import { Module } from '@nestjs/common';
import { UniversityLectureCrawlerClient } from '@app/crawler/university-lecture-crawler/university-lecture-crawler.client';

@Module({
  providers: [UniversityLectureCrawlerClient],
  exports: [UniversityLectureCrawlerClient],
})
export class UniversityLectureCrawlerModule {}
