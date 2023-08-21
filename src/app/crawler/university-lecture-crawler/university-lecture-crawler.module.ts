import { Module } from '@nestjs/common';
import { UniversityLectureCrawlerClient } from '@app/crawler/university-lecture-crawler/university-lecture-crawler.client';
import { UtilModule } from '@infrastructure/utils/util.module';

@Module({
  imports: [UtilModule],
  providers: [UniversityLectureCrawlerClient],
  exports: [UniversityLectureCrawlerClient],
})
export class UniversityLectureCrawlerModule {}
