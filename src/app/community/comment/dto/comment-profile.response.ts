import { UserPreviewResponse, } from '@app/user/dto/user-preview.response';
import { ApiProperty, } from '@nestjs/swagger';
import { ReplyCommentProfileResponse, } from '@app/community/comment/dto/reply-comment-profile.response';
import { CommentProfileResponseType, } from '@app/community/comment/dto/comment.type';

export class CommentProfileResponse implements CommentProfileResponseType {
	@ApiProperty({
		example: 1,
		description: '댓글 아이디',
	})
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
		example: [ReplyCommentProfileResponse,],
		description: '자식 댓글 목록',
		nullable: true,
	})
	readonly replies: ReplyCommentProfileResponse[];

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

	constructor(comment: CommentProfileResponseType) {
		this.id = comment.id;
		this.author = comment.isAnonymous
			? null
			: new UserPreviewResponse(comment.author);
		this.isDeleted = !!comment.deletedAt;
		this.content = this.isDeleted ? '삭제된 댓글입니다.' : comment.content;
		this.authorId = comment.isAnonymous ? null : comment.authorId;
		this.createdAt = comment.createdAt;
		this.likesCount = comment.likesCount;
		this.isAnonymous = comment.isAnonymous;
		this.isArticleAuthor = comment.isArticleAuthor;
		this.replyToId = comment.replyToId;
		this.replies =
			comment.replies.length > 0
				? comment.replies.map(
					(reply) => {
						return new ReplyCommentProfileResponse(reply);
					}
				)
				: null;
	}
}
