import { UniversityLectureProfileResponseCommand } from '@app/university/command/university-lecture-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityLectureProfileResponse
  implements UniversityLectureProfileResponseCommand
{
  @ApiProperty({
    example: 1,
    description: '강의 식별자',
  })
  id: number;
  @ApiProperty({
    example: 'C++프로그래밍',
    description: '강의명',
  })
  title: string;
  @ApiProperty({
    example: 4,
    description: '강의 시작 교시',
    minimum: 0,
    maximum: 9,
  })
  startAt: number;
  @ApiProperty({
    example: 9,
    description: '강의 종료 교시',
    minimum: 0,
    maximum: 9,
  })
  endAt: number;

  constructor({
    id,
    title,
    startAt,
    endAt,
  }: UniversityLectureProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
