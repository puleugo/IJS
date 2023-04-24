import { Controller, Get, Param } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityCalendarResponse } from '@app/university/dto/university-calendar.response';
import { UniversityFinishDateProfileResponse } from '@app/university/command/university-finish-date-profile-response.command';
import { UniversityNoticeProfileResponse } from '@app/university/dto/university-notice-profile.response';
import { UniversityProgramProfileResponse } from '@app/university/dto/university-program-profile.response';
import { UniversityMealInfoProfileResponse } from '@app/university/dto/university-meal-info-profile.response';
import { UniversityBusResponse } from '@app/university/dto/university-bus.response';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UniversityMajorProfileResponse } from '@app/university/dto/university-major-profile.response';

@ApiTags('University')
@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('meals')
  @ApiOperation({ summary: '오늘의 식단 정보를 가져옵니다.' })
  async getTodayUniversityMealInfo(): Promise<
    UniversityMealInfoProfileResponse[]
  > {
    const meals = await this.universityService.getUniversityMealInfoByDate(
      new Date(),
    );
    return meals.map((meal) => new UniversityMealInfoProfileResponse(meal));
  }

  @Get('programs')
  @ApiOperation({
    summary: '신청할 수 있는 비교과 프로그램 목록을 가져옵니다.',
  })
  async getUniversityPrograms(): Promise<UniversityProgramProfileResponse[]> {
    const programs = await this.universityService.getUniversityProgramsByDate(
      new Date(),
    );
    return programs.map(
      (program) => new UniversityProgramProfileResponse(program),
    );
  }

  @Get('majors')
  @ApiOperation({
    summary: '학과 목록을 가져옵니다.',
  })
  async getMajorProfiles() {
    const majors = await this.universityService.getMajors();
    return majors.map((major) => new UniversityMajorProfileResponse(major));
  }

  @Get('notices/:majorSlug')
  @ApiOperation({ summary: '해당 학과의 공지사항 목록을 가져옵니다.' })
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

  @Get('finish-date')
  @ApiOperation({ summary: '학기 종료일(방학 시작일)을 가져옵니다.' })
  async getUniversityFinishDate(): Promise<UniversityFinishDateProfileResponse> {
    const finishDate = await this.universityService.getUniversityFinishDate(
      new Date(),
    );
    return new UniversityFinishDateProfileResponse(finishDate);
  }

  @Get('calendars')
  @ApiOperation({
    summary: '금년 학사 일정을 가져옵니다.',
    externalDocs: {
      url: 'https://www.inje.ac.kr/kor/Template/Bsub_page.asp?Ltype=4&Ltype2=1&Ltype3=0&Tname=S_Schedule&Ldir=board/S_Schedule&Lpage=Tboard_L&d1n=4&d2n=2&d3n=1&d4n=1',
    },
  })
  async getUniversityCalendarInfo(): Promise<UniversityCalendarResponse> {
    const calendarInfo = await this.universityService.getUniversityCalendarInfo(
      new Date(),
    );
    return new UniversityCalendarResponse(calendarInfo);
  }

  @Get('bus-info')
  @ApiOperation({ summary: '통학 버스 정보를 가져옵니다.' })
  async getUniversityBusInfo(): Promise<UniversityBusResponse> {
    const busInfo = await this.universityService.getUniversityBusInfo();
    return new UniversityBusResponse(busInfo);
  }
}
