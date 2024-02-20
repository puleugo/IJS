import { Module, } from '@nestjs/common';
import { CrawlerService, } from '@app/crawler/service/crawler.service';
import { ScheduleModule, } from '@nestjs/schedule';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { Crawler, } from '@app/crawler/domain/crawler.entity';
import { UniversityBusScheduleCrawlerClient, } from '@app/crawler/service/university-bus-schedule-crawler.client';
import { UniversityEventCrawlerClient, } from '@app/crawler/service/university-event-crawler.client';
import { UniversityLectureCrawlerClient, } from '@app/crawler/service/university-lecture-crawler.client';
import { UniversityMajorCrawlerClient, } from '@app/crawler/service/university-major-crawler.client';
import { UniversityMajorNoticeCrawlerClient, } from '@app/crawler/service/university-major-notice-crawler.client';
import { UniversityMealCrawlerClient, } from '@app/crawler/service/university-meal-crawler.client';
import { UniversityProgramCrawlerClient, } from '@app/crawler/service/university-program-crawler.client';
import { UniversityMeal, } from '@app/university/domain/university-meal.entity';
import { UniversityBusSchedule, } from '@app/university/domain/university-bus-schedule.entity';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';
import { UniversityNotice, } from '@app/university/domain/university-notice.entity';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';
import { UniversityProgram, } from '@app/university/domain/university-program.entity';
import { UniversityEvent, } from '@app/university/domain/university-event.entity';
import { UniversitySemester, } from '@app/university/domain/university-semester.entity';
import { UniversityDepartment, } from '@app/university/domain/university-department.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Crawler,
			UniversityMeal,
			UniversityBusSchedule,
			UniversityLecture,
			UniversityNotice,
			UniversityMajor,
			UniversityMeal,
			UniversityEvent,
			UniversitySemester,
			UniversityProgram,
			UniversityDepartment,
		]),
		ScheduleModule.forRoot(),
	],
	providers: [
		CrawlerService,
		UniversityBusScheduleCrawlerClient,
		UniversityEventCrawlerClient,
		UniversityLectureCrawlerClient,
		UniversityMajorCrawlerClient,
		UniversityMajorNoticeCrawlerClient,
		UniversityMealCrawlerClient,
		UniversityProgramCrawlerClient,
	],
	exports: [CrawlerService,],
})
export class CrawlerModule {
}
