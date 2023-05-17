import { Module } from '@nestjs/common';
import { UniversityMajorNoticeCrawlerClient } from '@app/crawler/university-major-notice-crawler/university-major-notice-crawler.client';

@Module({
  providers: [UniversityMajorNoticeCrawlerClient],
})
export class UniversityMajorNoticeCrawlerModule {}
