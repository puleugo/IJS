import { ReplyCommentProfileCommand } from '@app/community/comment/commands/comment-profile.command';
import { UserPreviewResponse } from '@app/user/dto/user-preview.response';
import { ApiProperty } from '@nestjs/swagger';

export class ReplyCommentProfileResponse implements ReplyCommentProfileCommand {
  @ApiProperty({ example: 1, description: '댓글 아이디' })
  readonly id: number;
  @ApiProperty({
    example: 'acc954b7-4081-4beb-ab0c-19325004a4fd',
    description: '댓글 작성자 아이디',
    nullable: true,
  })
  readonly authorId: string | null;

  @ApiProperty({
    example: UserPreviewResponse,
    description: '댓글 작성자 정보',
    nullable: true,
  })
  readonly author: UserPreviewResponse | null;

  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용',
  })
  readonly content: string;

  @ApiProperty({
    example: new Date(),
    description: '댓글 작성일',
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: 1,
    description: '댓글 좋아요 수',
  })
  readonly likesCount: number;

  @ApiProperty({
    example: true,
    description: '익명 댓글 여부',
  })
  readonly isAnonymous: boolean;

  @ApiProperty({
    example: true,
    description: '게시글 작성자 여부',
  })
  readonly isArticleAuthor: boolean;

  @ApiProperty({
    example: 1,
    description: '부모 댓글 아이디',
    nullable: true,
  })
  readonly replyToId: number | null;

  @ApiProperty({
    example: null,
    description: '대댓글은 자식 댓글이 존재하지 않음',
    nullable: true,
  })
  readonly replies: null;

  @ApiProperty({
    example: 1,
    description: '게시글 아이디',
  })
  readonly articleId: number;

  @ApiProperty({
    example: false,
    description: '댓글 삭제 여부',
  })
  readonly isDeleted: boolean;

  constructor(comment: ReplyCommentProfileCommand) {
    this.id = comment.id;
    this.author = comment.isAnonymous
      ? null
      : new UserPreviewResponse(comment.author);
    this.authorId = comment.isAnonymous ? null : comment.authorId;
    this.isDeleted = !!comment.deletedAt;
    this.content = this.isDeleted ? '삭제된 댓글입니다.' : comment.content;
    this.createdAt = comment.createdAt;
    this.likesCount = comment.likesCount;
    this.isAnonymous = comment.isAnonymous;
    this.isArticleAuthor = comment.isArticleAuthor;
    this.replyToId = comment.replyToId;
  }
}
