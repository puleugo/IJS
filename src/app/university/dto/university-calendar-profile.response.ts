import { UniversityCalendarProfileResponseCommand } from '@app/university/command/university-calendar-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityCalendarProfileResponse
  implements UniversityCalendarProfileResponseCommand
{
  @ApiProperty({
    example: 1,
    description: '학사 일정 식별자',
  })
  id: number;
  @ApiProperty({
    example: '2023학년도 1학기 개강',
    description: '학사 일정 제목',
  })
  title: string;
  @ApiProperty({
    example: '2023-03-02',
    description: '학사 일정 시작일',
  })
  startAt: Date;
  @ApiProperty({
    example: '2023-03-02',
    description: '학사 일정 종료일',
  })
  endAt: Date;

  constructor({
    id,
    title,
    startAt,
    endAt,
  }: UniversityCalendarProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
