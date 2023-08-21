import { ApiProperty } from '@nestjs/swagger';
import { UniversityCalendarProfileResponseType } from '@app/university/university.type';

export class UniversityCalendarProfileResponse
  implements UniversityCalendarProfileResponseType
{
  @ApiProperty({
    example: 1,
    description: '학사 일정 식별자',
  })
  readonly id: number;

  @ApiProperty({
    example: '2023학년도 1학기 개강',
    description: '학사 일정 제목',
  })
  readonly title: string;

  @ApiProperty({
    example: '2023-03-02',
    description: '학사 일정 시작일',
  })
  readonly startAt: Date;

  @ApiProperty({
    example: '2023-03-02',
    description: '학사 일정 종료일',
  })
  readonly endAt: Date;

  constructor({
    id,
    title,
    startAt,
    endAt,
  }: UniversityCalendarProfileResponseType) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
