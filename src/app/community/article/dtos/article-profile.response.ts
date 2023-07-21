import { ArticleProfileCommand } from '@app/community/article/commands/article-profile.command';
import { ApiProperty } from '@nestjs/swagger';
import { UserPreviewResponse } from '@app/user/dto/user-preview.response';

export class ArticleProfileResponse implements ArticleProfileCommand {
  @ApiProperty({ description: '글 id', example: 1 })
  readonly id: number;
  @ApiProperty({ description: '글 제목', example: '글 제목' })
  readonly title: string;
  @ApiProperty({ description: '글 내용', example: '글 내용' })
  readonly content: string;
  @ApiProperty({
    description: '글 이미지',
    example: ['http://example.com/1.png', 'http://example.com/2.png'],
  })
  readonly images: string[];
  @ApiProperty({ description: '게시판 id', example: 1 })
  readonly boardId: number;
  @ApiProperty({ description: '좋아요 수', example: 1 })
  readonly likesCount: number;
  @ApiProperty({ description: '조회수', example: 1 })
  readonly viewsCount: number;
  @ApiProperty({ description: '댓글 수', example: 1 })
  readonly commentsCount: number;
  @ApiProperty({
    description: '작성자 정보',
    type: UserPreviewResponse,
    example: UserPreviewResponse,
    nullable: true,
  })
  readonly author: UserPreviewResponse | null;
  @ApiProperty({ description: '작성일', example: '2023-01-01T00:00:00.000Z' })
  readonly createdAt: Date;
  @ApiProperty({ description: '수정여부', example: false })
  readonly isUpdated: boolean;
  @ApiProperty({ description: '익명 여부', example: false })
  readonly isAnonymous: boolean;
  @ApiProperty({
    description: '작성자 id',
    example: '37689d40-fda9-44ae-b578-46f012b59135',
  })
  authorId: string;

  constructor(article: ArticleProfileCommand) {
    this.id = article.id;
    this.title = article.title;
    this.content = article.content;
    this.images = article.images;
    this.boardId = article.boardId;
    this.likesCount = article.likesCount;
    this.viewsCount = article.viewsCount;
    this.commentsCount = article.commentsCount;
    this.isAnonymous = article.isAnonymous;
    this.author = article.isAnonymous
      ? null
      : new UserPreviewResponse(article.author);
    this.authorId = article.isAnonymous ? '' : article.author.id;
    this.createdAt = article.createdAt;
    this.isUpdated = article.createdAt < article.updatedAt;
  }
}
