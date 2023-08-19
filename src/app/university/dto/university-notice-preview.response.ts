import { UniversityNoticePreviewResponseCommand } from '@app/university/command/university-notice-preview-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityNoticePreviewResponse
  implements UniversityNoticePreviewResponseCommand
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

  constructor(data: UniversityNoticePreviewResponseCommand) {
    this.id = data.id;
    this.title = data.title;
    this.wroteAt = data.wroteAt;
  }
}
