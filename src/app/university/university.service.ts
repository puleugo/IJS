import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UniversityMealSearchQuery } from '@app/university/command/university-meal-info-profile-response.command';
import { UniversityProgramProfileResponseCommand } from '@app/university/command/university-program-profile-response.command';
import { UniversityNoticeProfileResponseCommand } from '@app/university/command/university-notice-profile-response.command';
import { UniversityNearBusResponseCommand } from '@app/university/command/university-near-bus-response.command';
import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';
import { UniversityCalendarResponseCommand } from '@app/university/command/university-calendar-response.command';
import {
  UniversityBusProfileCommand,
  UniversityBusResponseCommand,
} from '@app/university/command/university-bus-response.command';
import {
  Between,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UniversitySemester } from '@domain/university/university-semester.entity';
import { UniversityEvent } from '@domain/university/university-event.entity';
import { UniversityMeal } from '@domain/university/university-meal.entity';
import { UniversityProgram } from '@domain/university/university-program.entity';
import { UniversityMajorNotice } from '@domain/university/university-major-notice.entity';
import { UniversityBusSchedule } from '@domain/university/university-bus-schedule.entity';
import {
  IUniversityMealInfo,
  MealCourseEnum,
} from '@domain/university/university-meal.interface';
import { getDateByTime } from '@infrastructure/utils/get-date-by-time';
import { getLastMondayByDate } from '@infrastructure/utils/get-last-monday-by-date';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(UniversityMajor)
    private readonly universityMajorRepository: Repository<UniversityMajor>,
    @InjectRepository(UniversitySemester)
    private readonly universitySemesterRepository: Repository<UniversitySemester>,
    @InjectRepository(UniversityEvent)
    private readonly universityEventRepository: Repository<UniversityEvent>,
    @InjectRepository(UniversityMeal)
    private readonly universityMealRepository: Repository<UniversityMeal>,
    @InjectRepository(UniversityProgram)
    private readonly universityProgramRepository: Repository<UniversityProgram>,
    @InjectRepository(UniversityMajorNotice)
    private readonly universityMajorNoticeRepository: Repository<UniversityMajorNotice>,
    @InjectRepository(UniversityBusSchedule)
    private readonly universityBusScheduleRepository: Repository<UniversityBusSchedule>,
  ) {}

  //TODO: 레디스로 캐시처리
  async getUniversityMealInfoByDate(
    UniversityMealSearchQuery: UniversityMealSearchQuery,
    date: Date,
  ): Promise<IUniversityMealInfo[]> {
    switch (UniversityMealSearchQuery.timeRange) {
      case 'today':
        return await this.getUniversityMealInfoByToday(date);
      case 'weekly':
        return await this.getUniversityMealInfoByWeekly(date);
      default:
        throw new BadRequestException('탐색 쿼리가 존재하지 않습니다.');
    }
  }

  async getUniversityProgramsByDate(
    date: Date,
  ): Promise<UniversityProgramProfileResponseCommand[]> {
    return await this.universityProgramRepository.find({
      where: {
        endAt: MoreThan(date),
      },
    });
  }

  async getUniversityNotices(data: {
    slug: string;
  }): Promise<UniversityNoticeProfileResponseCommand[]> {
    const major = await this.universityMajorRepository.findOne({
      where: { slug: data.slug },
    });
    if (!major) throw new NotFoundException('학과를 찾을 수 없습니다.');
    return await this.universityMajorNoticeRepository.find({
      where: { major },
    });
  }

  async getUniversityNearBusInfo(): Promise<
    UniversityNearBusResponseCommand[]
  > {
    return;
  }

  async getUniversityFinishDate(
    date: Date,
  ): Promise<UniversityFinishDateProfileResponseCommand> {
    const semester = await this.getUniversitySemesterByDate(date);

    if (!semester) {
      const comingSemester = await this.getUniversityComingSemesterByDate(date);
      if (!comingSemester)
        throw new NotFoundException('학기를 찾을 수 없습니다.');
      return {
        isFinished: true,
        semester: comingSemester.semesterNumber,
        comingFinishDate: comingSemester.startedAt,
        apiCalled: date,
      };
    }
    const endAt = new Date(semester.endedAt);
    const endNextDate = new Date(endAt.setDate(endAt.getDate() + 1));

    return {
      isFinished: false,
      semester: semester.semesterNumber,
      comingFinishDate: endNextDate,
      apiCalled: date,
      middleExamAt: semester.middleExamAt,
      finalExamAt: semester.finalExamAt,
    };
  }

  async getUniversityCalendarInfo(
    date: Date,
  ): Promise<UniversityCalendarResponseCommand> {
    const events = await this.universityEventRepository.find({
      where: {
        startAt: MoreThanOrEqual(new Date(date.getFullYear(), 2, 1)),
        endAt: LessThanOrEqual(new Date(date.getFullYear() + 1, 1, 31)),
      },
    });
    return await this.groupEventByMonth(events);
  }

  async getUniversityBusInfo(): Promise<UniversityBusResponseCommand> {
    const toSchoolBus = await this.universityBusScheduleRepository.find({
      where: { toSchool: true },
    });
    const fromSchoolBus = await this.universityBusScheduleRepository.find({
      where: { fromSchool: true },
    });

    return {
      toSchool: toSchoolBus,
      fromSchool: fromSchoolBus,
    };
  }

  async getMajors() {
    return await this.universityMajorRepository.find();
  }

  async getUniversityNextBusInfo(
    currentTime: Date,
    stationName?: string,
  ): Promise<UniversityBusProfileCommand[]> {
    const busInfo = await this.universityBusScheduleRepository.find({
      where: {
        title: stationName,
        fromSchool: true,
      },
      order: {
        departedOn: 'ASC',
      },
    });
    busInfo.map(
      (bus) => (bus.departedOn = getDateByTime(bus.departedOn.toString())),
    );

    return busInfo.filter((bus) => bus.departedOn > currentTime);
  }

  private async getUniversitySemesterByDate(
    date: Date,
  ): Promise<UniversitySemester> {
    return await this.universitySemesterRepository.findOne({
      where: {
        startedAt: LessThanOrEqual(date),
        endedAt: MoreThan(date),
      },
    });
  }

  private async getUniversityComingSemesterByDate(
    date: Date,
  ): Promise<UniversitySemester> {
    const semesters = await this.universitySemesterRepository.find({
      where: {
        startedAt: MoreThanOrEqual(date),
      },
      order: {
        startedAt: 'ASC',
      },
    });
    return semesters[0];
  }

  private async groupEventByMonth(
    events: UniversityEvent[],
  ): Promise<UniversityCalendarResponseCommand> {
    const result: UniversityCalendarResponseCommand = {
      Mar: [],
      Apr: [],
      May: [],
      Jun: [],
      Jul: [],
      Aug: [],
      Sep: [],
      Oct: [],
      Nov: [],
      Dec: [],
      Jan: [],
      Feb: [],
    };
    events.forEach((event) => {
      const month = new Date(event.startAt).getMonth();
      switch (month) {
        case 2:
          result.Mar.push(event);
          break;
        case 3:
          result.Apr.push(event);
          break;
        case 4:
          result.May.push(event);
          break;
        case 5:
          result.Jun.push(event);
          break;
        case 6:
          result.Jul.push(event);
          break;
        case 7:
          result.Aug.push(event);
          break;
        case 8:
          result.Sep.push(event);
          break;
        case 9:
          result.Oct.push(event);
          break;
        case 10:
          result.Nov.push(event);
          break;
        case 11:
          result.Dec.push(event);
          break;
        case 0:
          result.Jan.push(event);
          break;
        case 1:
          result.Feb.push(event);
          break;
      }
    });

    return result;
  }

  private async getUniversityMealInfoByToday(
    date: Date,
  ): Promise<IUniversityMealInfo[]> {
    const meals = await this.universityMealRepository.find({
      where: {
        publishedAt: date,
      },
    });

    if (meals.length === 0)
      throw new NotFoundException('해당주에 식단 정보가 없습니다.');
    const courseA = meals.find((meal) => meal.course === MealCourseEnum.A);
    const courseB = meals.find((meal) => meal.course === MealCourseEnum.B);
    const courseC = meals.find((meal) => meal.course === MealCourseEnum.C);
    return [{ courseA, courseB, courseC }];
  }

  private async getUniversityMealInfoByWeekly(
    date: Date,
  ): Promise<IUniversityMealInfo[]> {
    const lastMonday = getLastMondayByDate(date);
    const thisFriday = new Date(
      date.getFullYear(),
      date.getMonth(),
      lastMonday.getDate() + 4,
    );

    const meals = await this.universityMealRepository.find({
      where: {
        publishedAt: Between(lastMonday, thisFriday),
      },
      order: {
        publishedAt: 'ASC',
      },
    });

    if (meals.length === 0)
      throw new NotFoundException('해당 날짜의 식단 정보가 없습니다.');
    const courseA = meals.filter((meal) => meal.course === 'A');
    const courseB = meals.filter((meal) => meal.course === 'B');
    const courseC = meals.filter((meal) => meal.course === 'C');

    const result: IUniversityMealInfo[] = [];
    for (let i = 0; i < 5; i++) {
      result.push({
        courseA: courseA[i],
        courseB: courseB[i],
        courseC: courseC[i],
      });
    }
    return result;
  }
}
