import { UniversityNoticeSlugArrayResponseCommand } from '@app/university/command/university-notice-slug-array-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityNoticeSlugArrayResponse
  implements UniversityNoticeSlugArrayResponseCommand
{
  @ApiProperty({ description: '공지 게시판 ID', example: 1 })
  id: number;
  @ApiProperty({ description: '게시판 slug', example: 'free' })
  slug: string;

  constructor(data: UniversityNoticeSlugArrayResponseCommand) {
    this.id = data.id;
    this.slug = data.slug;
  }
}
