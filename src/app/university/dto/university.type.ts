import { UniversityBusSchedule, } from '@app/university/domain/university-bus-schedule.entity';
import { UniversityEvent, } from '@app/university/domain/university-event.entity';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';
import { UniversityNotice, } from '@app/university/domain/university-notice.entity';
import { UniversityProgram, } from '@app/university/domain/university-program.entity';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';

export type UniversityBusProfileResponseType = Pick<
  UniversityBusSchedule,
  'id' | 'title' | 'price' | 'departedOn'
>;
export type UniversityBusResponseType = {
    toSchool: UniversityBusProfileResponseType[];
    fromSchool: UniversityBusProfileResponseType[];
};

export type UniversityCalendarProfileResponseType = Pick<
  UniversityEvent,
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
  UniversityLecture,
  'id' | 'title' | 'startAt' | 'endAt'
>;

export type UniversityMajorProfileResponseType = Pick<
  UniversityMajor,
  'id' | 'name'
>;

export type UniversityMealSearchQuery = {
    timeRange?: 'today' | 'weekly';
};

export type UniversityMealsMenuInfo = {
    courseA: string[];
    courseB: string[];
    courseC: string[];
};

export type UniversityMealInfoProfileResponseType = {
    time_range: 'today' | 'weekly';
    '0': UniversityMealsMenuInfo;
    '1'?: UniversityMealsMenuInfo;
    '2'?: UniversityMealsMenuInfo;
    '3'?: UniversityMealsMenuInfo;
    '4'?: UniversityMealsMenuInfo;
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
  UniversityNotice,
  'id' | 'title' | 'wroteAt'
>;

export type UniversityNoticeProfileResponseType = Pick<
  UniversityNotice,
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
  UniversityProgram,
  'id' | 'title' | 'url' | 'author' | 'endAt'
>;
