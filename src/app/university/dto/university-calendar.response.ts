import { UniversityCalendarProfileResponse } from '@app/university/dto/university-calendar-profile.response';
import {
  MonthlyEventDTO,
  UniversityCalendarResponseCommand,
} from '@app/university/command/university-calendar-response.command';

export class UniversityCalendarResponse
  implements UniversityCalendarResponseCommand
{
  Mar: MonthlyEventDTO['Mar'];
  Apr: MonthlyEventDTO['Apr'];
  May: MonthlyEventDTO['May'];
  Jun: MonthlyEventDTO['Jun'];
  Jul: MonthlyEventDTO['Jul'];
  Aug: MonthlyEventDTO['Aug'];
  Sep: MonthlyEventDTO['Sep'];
  Oct: MonthlyEventDTO['Oct'];
  Nov: MonthlyEventDTO['Nov'];
  Dec: MonthlyEventDTO['Dec'];
  Jan: MonthlyEventDTO['Jan'];
  Feb: MonthlyEventDTO['Feb'];

  constructor({
    Mar,
    Apr,
    May,
    Jun,
    Jul,
    Aug,
    Sep,
    Oct,
    Nov,
    Dec,
    Jan,
    Feb,
  }: UniversityCalendarResponseCommand) {
    this.Mar = Mar.map((event) => new UniversityCalendarProfileResponse(event));
    this.Apr = Apr.map((event) => new UniversityCalendarProfileResponse(event));
    this.May = May.map((event) => new UniversityCalendarProfileResponse(event));
    this.Jun = Jun.map((event) => new UniversityCalendarProfileResponse(event));
    this.Jul = Jul.map((event) => new UniversityCalendarProfileResponse(event));
    this.Aug = Aug.map((event) => new UniversityCalendarProfileResponse(event));
    this.Sep = Sep.map((event) => new UniversityCalendarProfileResponse(event));
    this.Oct = Oct.map((event) => new UniversityCalendarProfileResponse(event));
    this.Nov = Nov.map((event) => new UniversityCalendarProfileResponse(event));
    this.Dec = Dec.map((event) => new UniversityCalendarProfileResponse(event));
    this.Jan = Jan.map((event) => new UniversityCalendarProfileResponse(event));
    this.Feb = Feb.map((event) => new UniversityCalendarProfileResponse(event));
  }
}
