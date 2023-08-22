import { IUniversityBusSchedule, } from '@domain/university/university-bus-schedule.interface';
import { IUniversityEvent, } from '@domain/university/university-event.interface';
import { IUniversityLecture, } from '@domain/university/university-lecture.interface';
import { IUniversityMajor, } from '@domain/university/university-major.interface';
import { IUniversityNotice, } from '@domain/university/university-major-notice.interface';
import { IUniversityProgram, } from '@domain/university/university-program.interface';

export type UniversityBusProfileResponseType = Pick<
  IUniversityBusSchedule,
  'id' | 'title' | 'price' | 'departedOn'
>;
export type UniversityBusResponseType = {
    toSchool: UniversityBusProfileResponseType[];
    fromSchool: UniversityBusProfileResponseType[];
};

export type UniversityCalendarProfileResponseType = Pick<
  IUniversityEvent,
  'id' | 'title' | 'startAt' | 'endAt'
>;

export type MonthlyEventsResponse = {
    [key: string]: UniversityCalendarProfileResponseType[];
};

export interface UniversityCalendarResponseType {
    Mar: MonthlyEventsResponse['Mar'];
    Apr: MonthlyEventsResponse['Apr'];
    May: MonthlyEventsResponse['May'];
    Jun: MonthlyEventsResponse['Jun'];
    Jul: MonthlyEventsResponse['Jul'];
    Aug: MonthlyEventsResponse['Aug'];
    Sep: MonthlyEventsResponse['Sep'];
    Oct: MonthlyEventsResponse['Oct'];
    Nov: MonthlyEventsResponse['Nov'];
    Dec: MonthlyEventsResponse['Dec'];
    Jan: MonthlyEventsResponse['Jan'];
    Feb: MonthlyEventsResponse['Feb'];
}

export type UniversityFinishDateProfileResponseType = {
    isFinished: boolean;
    comingFinishDate: Date;
    apiCalled: Date;
    semester: number;
    middleExamAt?: Date;
    finalExamAt?: Date;
};

export type UniversityLectureProfileResponseType = Pick<
  IUniversityLecture,
  'id' | 'title' | 'startAt' | 'endAt'
>;

export type UniversityMajorProfileResponseType = Pick<
  IUniversityMajor,
  'id' | 'name'
>;

export type UniversityMealSearchQuery = {
    timeRange?: 'today' | 'weekly';
};

export type UniversityMealInfo = {
    courseA: string[];
    courseB: string[];
    courseC: string[];
};

export type UniversityMealInfoProfileResponseType = {
    time_range: 'today' | 'weekly';
    '0': UniversityMealInfo;
    '1'?: UniversityMealInfo;
    '2'?: UniversityMealInfo;
    '3'?: UniversityMealInfo;
    '4'?: UniversityMealInfo;
};

export type UniversityNearBusResponseType = {
    busNumber: string; //버스 번호
    busType: string; //저상버스, 일반버스 x
    routeType: string; // 노선 유형 x
    remainStationCount: number; //도착까지 남은 정류장 수
    remainMinute: number; // 버스 도착예상시간
    stationName: string; //정류장 이름 x
    stationId: string; // 정류장 고유 id x
};

export type UniversityNoticePreviewResponseType = Pick<
  IUniversityNotice,
  'id' | 'title' | 'wroteAt'
>;

export type UniversityNoticeProfileResponseType = Pick<
  IUniversityNotice,
  | 'id'
  | 'title'
  | 'content'
  | 'url'
  | 'files'
  | 'viewsCount'
  | 'wroteAt'
  | 'majorId'
> & { majorName: string };

export type UniversityProgramProfileResponseType = Pick<
  IUniversityProgram,
  'id' | 'title' | 'url' | 'author' | 'endAt'
>;
