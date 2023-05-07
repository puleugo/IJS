import { UniversityCalendarProfileResponse } from '@app/university/dto/university-calendar-profile.response';
import {
  MonthlyEventDTO,
  UniversityCalendarResponseCommand,
} from '@app/university/command/university-calendar-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityCalendarResponse
  implements UniversityCalendarResponseCommand
{
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Apr: MonthlyEventDTO['Apr'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Mar: MonthlyEventDTO['Mar'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  May: MonthlyEventDTO['May'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Jun: MonthlyEventDTO['Jun'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Jul: MonthlyEventDTO['Jul'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Aug: MonthlyEventDTO['Aug'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Sep: MonthlyEventDTO['Sep'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Oct: MonthlyEventDTO['Oct'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Nov: MonthlyEventDTO['Nov'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Dec: MonthlyEventDTO['Dec'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  Jan: MonthlyEventDTO['Jan'];
  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
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
