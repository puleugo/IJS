import { UniversityNoticeProfileResponseCommand } from '@app/university/command/university-notice-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityNoticeProfileResponse
  implements UniversityNoticeProfileResponseCommand
{
  @ApiProperty({ example: 1, description: '학과 공지사항 식별자' })
  id: number;
  @ApiProperty({
    example: '학과 공지사항 제목',
    description: '학과 공지사항 제목',
  })
  title: string;

  @ApiProperty({
    example:
      'https://cs.inje.ac.kr/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD/?uid=4414&mod=document&pageid=1',
    description: '학과 공지사항 링크',
  })
  url: string;

  @ApiProperty({
    example: '학과사무실',
    description: '학과 공지사항 작성자',
  })
  author: string;
  @ApiProperty({
    example: '2023-03-20T16:36:00.000Z',
    description: '학과 공지사항 작성일',
  })
  wroteAt: Date;

  @ApiProperty({
    example: '컴퓨터공학과',
    description: '학과 공지사항 학과',
  })
  major: string;

  constructor({
    id,
    title,
    url,
    author,
    wroteAt,
  }: UniversityNoticeProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.author = author;
    this.wroteAt = wroteAt;
  }
}
