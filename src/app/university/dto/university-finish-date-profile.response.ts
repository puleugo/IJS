import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityFinishDateProfileResponse
  implements UniversityFinishDateProfileResponseCommand
{
  @ApiProperty({
    description: '학기가 끝났는지 여부',
    example: false,
  })
  readonly isFinished: boolean;

  @ApiProperty({
    description: '학기가 끝난 날짜(시험 마지막날 1일 후)',
    example: '2023-06-22T00:00:00.000Z',
  })
  readonly comingFinishDate: Date;

  @ApiProperty({
    description: 'API 호출 시간',
    example: '2023-06-01T15:00:00.000Z',
  })
  readonly apiCalled: Date;

  @ApiProperty({
    description: '학기',
    example: 1,
  })
  readonly semester: number;

  @ApiProperty({
    description: '중간고사 시작 날짜',
    example: '2023-04-01T15:00:00.000Z',
    required: false,
  })
  readonly middleExamAt?: Date;

  @ApiProperty({
    description: '기말고사 시작 날짜',
    example: '2023-06-01T15:00:00.000Z',
    required: false,
  })
  readonly finalExamAt?: Date;

  constructor({
    isFinished,
    comingFinishDate,
    apiCalled,
    semester,
    middleExamAt,
    finalExamAt,
  }: UniversityFinishDateProfileResponseCommand) {
    this.isFinished = isFinished;
    this.comingFinishDate = comingFinishDate;
    this.apiCalled = apiCalled;
    this.semester = semester;
    this.middleExamAt = middleExamAt;
    this.finalExamAt = finalExamAt;
  }
}
