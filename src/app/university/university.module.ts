import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { UniversitySemester } from '@domain/university/university-semester.entity';
import { UniversityEvent } from '@domain/university/university-event.entity';
import { UniversityMeal } from '@domain/university/university-meal.entity';
import { UniversityProgram } from '@domain/university/university-program.entity';
import { UniversityNotice } from '@domain/university/university-notice.entity';
import { UniversityBusSchedule } from '@domain/university/university-bus-schedule.entity';
import { UniversityController } from '@app/university/university.controller';
import { UniversityService } from '@app/university/university.service';

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
  controllers: [UniversityController],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
