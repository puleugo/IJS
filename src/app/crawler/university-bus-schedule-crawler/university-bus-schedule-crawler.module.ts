import { Module } from '@nestjs/common';
import { UniversityBusScheduleCrawlerClient } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.client';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityBusSchedule } from '@domain/university/university-bus-schedule.entity';
import { UtilModule } from '@infrastructure/utils/util.module';

@Module({
  imports: [TypeOrmModule.forFeature([UniversityBusSchedule]), UtilModule],
  providers: [UniversityBusScheduleCrawlerClient],
  exports: [UniversityBusScheduleCrawlerClient],
})
export class UniversityBusScheduleCrawlerModule {}
