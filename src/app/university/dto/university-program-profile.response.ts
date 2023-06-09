import { UniversityProgramProfileResponseCommand } from '@app/university/command/university-program-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityProgramProfileResponse
  implements UniversityProgramProfileResponseCommand
{
  @ApiProperty({ example: 1, description: '비교과 프로그램 식별자' })
  id: number;
  @ApiProperty({
    example: '비교과 프로그램 제목',
    description: '비교과 프로그램 제목',
  })
  title: string;
  @ApiProperty({
    example:
      'https://edu.inje.ac.kr/program/EProgE0011S.aspx?yy=2023&smt=1&code=000000028&dept=03455&no=29&mc=0152',
    description: '비교과 프로그램 신청 링크',
  })
  url: string;
  @ApiProperty({
    example: '학생복지처',
    description: '비교과 프로그램 작성자',
  })
  author: string;
  @ApiProperty({
    example: '2023-05-14T19:00:00.000Z',
    description: '비교과 프로그램 신청 마감일',
  })
  endAt: Date;

  constructor({
    id,
    title,
    url,
    author,
    endAt,
  }: UniversityProgramProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.endAt = endAt;
    this.author = author;
  }
}
