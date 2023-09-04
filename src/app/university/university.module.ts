import { Module, } from '@nestjs/common';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';
import { UniversitySemester, } from '@app/university/domain/university-semester.entity';
import { UniversityEvent, } from '@app/university/domain/university-event.entity';
import { UniversityMeal, } from '@app/university/domain/university-meal.entity';
import { UniversityProgram, } from '@app/university/domain/university-program.entity';
import { UniversityNotice, } from '@app/university/domain/university-notice.entity';
import { UniversityBusSchedule, } from '@app/university/domain/university-bus-schedule.entity';
import { UniversityController, } from '@app/university/university.controller';
import { UniversityService, } from '@app/university/university.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			UniversityMajor,
			UniversitySemester,
			UniversityEvent,
			UniversityMeal,
			UniversityProgram,
			UniversityNotice,
			UniversityBusSchedule,
		]),
	],
	controllers: [UniversityController,],
	providers: [UniversityService,],
	exports: [UniversityService,],
})
export class UniversityModule {
}
