import { ApiProperty } from '@nestjs/swagger';
import { UniversityNoticePreviewResponseCommand } from '@app/university/command/university-notice-preview-response.command';

export class UniversityNoticePreviewResponse
  implements UniversityNoticePreviewResponseCommand
{
  @ApiProperty({ example: 1, description: '학과 공지사항 식별자' })
  id: number;

  @ApiProperty({
    example: '학과 공지사항 제목',
    description: '학과 공지사항 제목',
  })
  title: string;

  @ApiProperty({
    example: '학과사무실',
    description: '학과 공지사항 작성자',
  })
  author: string;

  @ApiProperty({
    example: 1,
    description: '공지 조회수',
  })
  viewsCount: number;

  @ApiProperty({
    example: '2023-03-20T16:36:00.000Z',
    description: '학과 공지사항 작성일',
  })
  wroteAt: Date;

  constructor({
    id,
    title,
    viewsCount,
    author,
    wroteAt,
  }: UniversityNoticePreviewResponseCommand) {
    this.id = id;
    this.title = title;
    this.viewsCount = viewsCount;
    this.author = author;
    this.wroteAt = wroteAt;
  }
}
