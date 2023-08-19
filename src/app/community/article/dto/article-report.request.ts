import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleReportRequest {
  @ApiProperty({
    description: '신고 사유',
    example: '게시글에 욕설이 포함되어있습니다.',
  })
  @IsString()
  @IsNotEmpty()
  readonly reason: string;
}
