import { Injectable, } from '@nestjs/common';
import {
	IsNull, Not, Repository,
} from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { BoardService, } from '@app/community/board/board.service';

import { CommentLike, } from '@app/community/comment/domain/comment-like.entity';
import { ArticleService, } from '@app/community/article/service/article.service';
import { FindOneOptions, } from 'typeorm/find-options/FindOneOptions';
import { BoardNotFoundException, } from '@app/community/board/exception/board.error';
import { ArticleNotFoundException, } from '@app/community/article/exception/article.error';
import {
	AlreadyLikedCommentException,
	CantLikeOwnCommentException,
	CommentNotFoundException,
	CommentPermissionDeniedException,
	FailedToLikeCommentException,
} from '@app/community/comment/exception/comment.error';
import {
	CommentCreateRequestType,
	CommentDeleteRequestType,
	CommentHitLikeRequestType,
	CommentListQuery,
	CommentProfileResponseType,
	ReplyCommentProfileResponseType,
} from '@app/community/comment/dto/comment.type';

@Injectable()
export class CommentService {
	constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,
        @InjectRepository(CommentLike)
        private commentLikeRepository: Repository<CommentLike>,
        private readonly boardService: BoardService,
        private readonly articlesService: ArticleService
	) {}

	async getComments(
		commentListQuery: CommentListQuery
	): Promise<CommentProfileResponseType[]> {
		const board = await this.boardService.findById(
			commentListQuery.boardId, { select: { isAnonymous: true, }, }
		);
		if (!board) {
			throw new BoardNotFoundException();
		}
		const isAnonymous = board.isAnonymous;

		const article = await this.articlesService.findById(
			commentListQuery.articleId, { select: { authorId: true, }, }
		);
		if (!article) throw new ArticleNotFoundException();

		// SELECT *
		// FROM comments c
		// LEFT JOIN comments r ON c.id = r.reply_to_id
		// WHERE r.deleted_at IS NULL AND c.deleted_at IS NULL AND ((c.reply_to_id IS NULL) OR NOT( r.reply_to_id IS NULL))
		// ORDER BY c.created_at, r.created_at;
		return await this.commentRepository
			.find({
				relations: { replies: true, },
				where: [
					{
						replyToId: IsNull(),
						deletedAt: IsNull(),
						replies: { deletedAt: IsNull(), },
					},
					{
						deletedAt: Not(IsNull()),
						replies: {
							replyToId: Not(IsNull()),
							deletedAt: IsNull(),
						},
					},
				],
				order: {
					createdAt: 'ASC',
					replies: { createdAt: 'ASC', },
				},
			})
			.then((comments): CommentProfileResponseType[] => {
				return comments.map((comment): CommentProfileResponseType => {
					const replies = comment.replies.map(
						(reply): ReplyCommentProfileResponseType => {
							return {
								...reply,
								author: { id: reply.authorId, },
								replies: null,
								isArticleAuthor:
                                    reply.authorId === article.authorId,
								isAnonymous,
							};
						}
					);

					return {
						...comment,
						replies,
						author: { id: comment.authorId, },
						isArticleAuthor: comment.authorId === article.authorId,
						isAnonymous,
					};
				});
			});
	}

	async createComment(
		commentCreateRequest: CommentCreateRequestType
	): Promise<CommentProfileResponseType> {
		const { boardId, ...createCommentData } = commentCreateRequest;
		const board = await this.boardService.findById(boardId, { select: { isAnonymous: true, }, });
		if (!board) throw new BoardNotFoundException();

		const article = await this.articlesService.findById(
			commentCreateRequest.articleId, {
				select: {
					id: true,
					authorId: true,
				},
			}
		);
		if (!article) throw new ArticleNotFoundException();

		if (commentCreateRequest.replyToId) {
			commentCreateRequest.replyToId =
                await this.getRootCommentIdByReplyId(
                	commentCreateRequest.replyToId
                );
			if (!commentCreateRequest.replyToId) {
				throw new CommentNotFoundException();
			}
		}

		const createdComment = this.commentRepository.create({ ...createCommentData, });
		const comment = await this.commentRepository.save(createdComment);
		await this.articlesService.incrementCommentsCount(article.id);

		if (comment.replyToId) {
			return {
				...comment,
				replies: null,
				author: { id: comment.authorId, },
				isArticleAuthor: article.authorId === comment.authorId,
				isAnonymous: board.isAnonymous,
			};
		}

		return {
			...comment,
			replies: [],
			author: { id: comment.authorId, },
			isArticleAuthor: article.authorId === comment.authorId,
			isAnonymous: board.isAnonymous,
		};
	}

	async hitCommentLike(params: CommentHitLikeRequestType): Promise<void> {
		const { articleId, id, userId, } = params;

		const comment = await this.commentRepository.findOne({
			where: {
				id,
				articleId,
			},
			relations: { likes: true, },
		});
		if (!comment) throw new CommentNotFoundException();
		if (comment.authorId === userId)
			throw new CantLikeOwnCommentException();

		if (comment.likes.find((like) => {
			return like.authorId === userId;
		}))
			throw new AlreadyLikedCommentException();

		const [commentLike, updateResult,] = await Promise.all([
			this.commentLikeRepository.save({
				commentId: comment.id,
				authorId: userId,
			}),
			this.commentRepository.increment(
				{ id: comment.id, }, 'likesCount', 1
			),
		]);

		if (!(commentLike && updateResult.affected > 0))
			throw new FailedToLikeCommentException();
	}

	async deleteComment(
		commentDeleteRequest: CommentDeleteRequestType
	): Promise<boolean> {
		const article = await this.articlesService.findById(
			commentDeleteRequest.articleId, { select: { id: true, }, }
		);
		if (!article) throw new ArticleNotFoundException();

		const comment = await this.findById(commentDeleteRequest.id, {
			select: {
				id: true,
				authorId: true,
			},
		});
		if (!comment) throw new CommentNotFoundException();
		if (comment.authorId !== commentDeleteRequest.userId)
			throw new CommentPermissionDeniedException();

		const [deletedResult, decrementResult,] = await Promise.all([
			await this.commentRepository.update(
				{ id: comment.id, }, { deletedAt: new Date(), }
			),
			await this.articlesService.decrementCommentsCount(article.id),
		]);

		return deletedResult.affected > 0 && decrementResult.affected > 0;
	}

	async findById(
		id: number,
		options?: FindOneOptions<Comment>
	): Promise<Comment> {
		return await this.commentRepository.findOne({
			...options,
			...{
				where: {
					id,
					...options.where,
				},
			},
		});
	}

	private async getRootCommentIdByReplyId(
		replyToId: number
	): Promise<number> {
		const replyToComment = await this.commentRepository.findOne({
			where: { id: replyToId, },
			select: {
				id: true,
				replyToId: true,
			},
		});
		if (replyToComment.replyToId) {
			return replyToComment.replyToId;
		}

		return replyToId;
	}
}
