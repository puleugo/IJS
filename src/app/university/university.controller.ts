import { Controller, Get } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityCalendarResponse } from '@app/university/dto/university-calendar.response';
import { UniversityFinishDateProfileResponse } from '@app/university/command/university-finish-date-profile-response.command';
import { UniversityNearBusResponse } from '@app/university/dto/university-near-bus.response';
import { UniversityNoticeProfileResponse } from '@app/university/dto/university-notice-profile.response';
import { UniversityProgramProfileResponse } from '@app/university/dto/university-program-profile.response';
import { UniversityMealInfoProfileResponse } from '@app/university/dto/university-meal-info-profile.response';
import { UniversityBusResponse } from '@app/university/dto/university-bus.response';

@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get()
  async getUniversityMealInfo(): Promise<UniversityMealInfoProfileResponse[]> {
    return;
  }

  @Get()
  async getUniversityPrograms(): Promise<UniversityProgramProfileResponse[]> {
    return;
  }

  @Get()
  async getUniversityNotices(): Promise<UniversityNoticeProfileResponse[]> {
    return;
  }

  @Get()
  async getUniversityNearBusInfo(): Promise<UniversityNearBusResponse[]> {
    return;
  }

  @Get()
  async getUniversityFinishDate(): Promise<UniversityFinishDateProfileResponse> {
    return;
  }

  @Get()
  async getUniversityCalendarInfo(): Promise<UniversityCalendarResponse> {
    return;
  }

  @Get()
  async getUniversityBusInfo(): Promise<UniversityBusResponse> {
    return;
  }
}
