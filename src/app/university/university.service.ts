import { Injectable } from '@nestjs/common';
import { UniversityMealInfoProfileResponseCommand } from '@app/university/command/university-meal-info-profile-response.command';
import { UniversityProgramProfileResponseCommand } from '@app/university/command/university-program-profile-response.command';
import { UniversityNoticeProfileResponseCommand } from '@app/university/command/university-notice-profile-response.command';
import { UniversityNearBusResponseCommand } from '@app/university/command/university-near-bus-response.command';
import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';
import { UniversityCalendarResponseCommand } from '@app/university/command/university-calendar-response.command';
import { UniversityBusResponseCommand } from '@app/university/command/university-bus-response.command';

@Injectable()
export class UniversityService {
  async getUniversityMealInfoByDate(
    date: Date,
  ): Promise<UniversityMealInfoProfileResponseCommand[]> {
    return;
  }

  async getUniversityPrograms(): Promise<
    UniversityProgramProfileResponseCommand[]
  > {
    return;
  }

  async getUniversityNotices(data: {
    slug: string;
  }): Promise<UniversityNoticeProfileResponseCommand[]> {
    return;
  }

  async getUniversityNearBusInfo(): Promise<
    UniversityNearBusResponseCommand[]
  > {
    return;
  }

  async getUniversityFinishDate(): Promise<UniversityFinishDateProfileResponseCommand> {
    return;
  }

  async getUniversityCalendarInfo(): Promise<UniversityCalendarResponseCommand> {
    return;
  }

  async getUniversityBusInfo(): Promise<UniversityBusResponseCommand> {
    return;
  }
}
