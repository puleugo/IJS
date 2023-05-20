import { Module } from '@nestjs/common';
import { UniversityMajorCrawlerClient } from '@app/crawler/university-major-crawler/university-major-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { UniversityDepartment } from '@domain/university/university-department.entity';
import { Crawler } from '@domain/crawler/crawler.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UniversityMajor, UniversityDepartment, Crawler]),
  ],
  providers: [UniversityMajorCrawlerClient],
  exports: [UniversityMajorCrawlerClient],
})
export class UniversityMajorCrawlerModule {}
