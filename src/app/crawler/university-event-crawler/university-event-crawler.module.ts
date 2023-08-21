import { Module } from '@nestjs/common';
import { UniversityEventCrawlerClient } from '@app/crawler/university-event-crawler/university-event-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityEvent } from '@domain/university/university-event.entity';
import { UniversitySemester } from '@domain/university/university-semester.entity';
import { Crawler } from '@domain/crawler/crawler.entity';
import { UtilModule } from '@infrastructure/utils/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityEvent, UniversitySemester, Crawler]),
    UtilModule,
  ],
  providers: [UniversityEventCrawlerClient],
  exports: [UniversityEventCrawlerClient],
})
export class UniversityEventCrawlerModule {}
