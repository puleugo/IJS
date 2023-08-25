import { Module, } from '@nestjs/common';
import { UniversityBusScheduleCrawlerClient, } from '@app/crawler/university-bus-schedule-crawler/university-bus-schedule-crawler.client';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { UniversityBusSchedule, } from '@domain/university/university-bus-schedule.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UniversityBusSchedule,]), ],
	providers: [UniversityBusScheduleCrawlerClient,],
	exports: [UniversityBusScheduleCrawlerClient,],
})
export class UniversityBusScheduleCrawlerModule {
}
