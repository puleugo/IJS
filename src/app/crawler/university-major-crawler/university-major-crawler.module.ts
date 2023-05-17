import { Module } from '@nestjs/common';
import { UniversityMajorCrawlerClient } from '@app/crawler/university-major-crawler/university-major-crawler.client';

@Module({
  providers: [UniversityMajorCrawlerClient],
})
export class UniversityMajorCrawlerModule {}
