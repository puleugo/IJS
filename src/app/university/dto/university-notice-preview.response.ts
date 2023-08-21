import { ApiProperty } from '@nestjs/swagger';
import { UniversityNoticePreviewResponseType } from '@app/university/university.type';

export class UniversityNoticePreviewResponse
  implements UniversityNoticePreviewResponseType
{
  @ApiProperty({ description: '공지 게시글 ID', example: 1 })
  readonly id: number;

  @ApiProperty({
    description: '공지 게시글 제목',
    example: '2023년도 학사 일정',
  })
  readonly title: string;

  @ApiProperty({
    description: '공지 작성 일',
    example: new Date(),
  })
  readonly wroteAt: Date;

  constructor(data: UniversityNoticePreviewResponseType) {
    this.id = data.id;
    this.title = data.title;
    this.wroteAt = data.wroteAt;
  }
}
