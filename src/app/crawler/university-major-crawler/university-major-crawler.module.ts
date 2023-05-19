import { Module } from '@nestjs/common';
import { UniversityMajorCrawlerClient } from '@app/crawler/university-major-crawler/university-major-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { UniversityDepartment } from '@domain/university/university-department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityMajor, UniversityDepartment])],
  providers: [UniversityMajorCrawlerClient],
})
export class UniversityMajorCrawlerModule {}
