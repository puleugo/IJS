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
  readonly Apr: MonthlyEventDTO['Apr'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Mar: MonthlyEventDTO['Mar'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly May: MonthlyEventDTO['May'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Jun: MonthlyEventDTO['Jun'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Jul: MonthlyEventDTO['Jul'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Aug: MonthlyEventDTO['Aug'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Sep: MonthlyEventDTO['Sep'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Oct: MonthlyEventDTO['Oct'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Nov: MonthlyEventDTO['Nov'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Dec: MonthlyEventDTO['Dec'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Jan: MonthlyEventDTO['Jan'];

  @ApiProperty({ type: [UniversityCalendarProfileResponse] })
  readonly Feb: MonthlyEventDTO['Feb'];

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
