import { Controller, Get, Param } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityCalendarResponse } from '@app/university/dto/university-calendar.response';
import { UniversityFinishDateProfileResponse } from '@app/university/command/university-finish-date-profile-response.command';
import { UniversityNoticeProfileResponse } from '@app/university/dto/university-notice-profile.response';
import { UniversityProgramProfileResponse } from '@app/university/dto/university-program-profile.response';
import { UniversityMealInfoProfileResponse } from '@app/university/dto/university-meal-info-profile.response';
import { UniversityBusResponse } from '@app/university/dto/university-bus.response';

@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('meals')
  async getTodayUniversityMealInfo(): Promise<
    UniversityMealInfoProfileResponse[]
  > {
    const meals = await this.universityService.getUniversityMealInfoByDate(
      new Date(),
    );
    return meals.map((meal) => new UniversityMealInfoProfileResponse(meal));
  }

  @Get('programs')
  async getUniversityPrograms(): Promise<UniversityProgramProfileResponse[]> {
    const programs = await this.universityService.getUniversityPrograms();
    return programs.map(
      (program) => new UniversityProgramProfileResponse(program),
    );
  }

  @Get('notices/:majorSlug')
  async getUniversityNotices(
    @Param('majorSlug') slug: string,
  ): Promise<UniversityNoticeProfileResponse[]> {
    const notices = await this.universityService.getUniversityNotices({
      slug,
    });
    return notices.map((notice) => new UniversityNoticeProfileResponse(notice));
  }

  // @Get()
  // async getUniversityNearBusInfo(): Promise<UniversityNearBusResponse[]> {
  //   const busInfos = await this.universityService.getUniversityNearBusInfo();
  //   return busInfos.map((busInfo) => new UniversityNearBusResponse(busInfo));
  // }

  @Get()
  async getUniversityFinishDate(): Promise<UniversityFinishDateProfileResponse> {
    const finishDate = await this.universityService.getUniversityFinishDate();
    return new UniversityFinishDateProfileResponse(finishDate);
  }

  @Get('calendars')
  async getUniversityCalendarInfo(): Promise<UniversityCalendarResponse> {
    const calendarInfo =
      await this.universityService.getUniversityCalendarInfo();
    return new UniversityCalendarResponse(calendarInfo);
  }

  @Get('bus-info')
  async getUniversityBusInfo(): Promise<UniversityBusResponse> {
    const busInfo = await this.universityService.getUniversityBusInfo();
    return new UniversityBusResponse(busInfo);
  }
}
