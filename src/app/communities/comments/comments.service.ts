import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '@domain/communities/comments/comment.entity';
import { CommentListQuery } from '@app/communities/comments/commands/comment-list-query';
import { BoardService } from '@app/communities/board/board.service';

import { CommentCreateCommand } from '@app/communities/comments/commands/comment-create.command';
import { CommentResponseCommand } from '@app/communities/comments/commands/comment-response.command';
import { CommentLikeCommand } from '@app/communities/comments/commands/comment-like.command';
import { CommentLike } from '@domain/communities/comments/comment-like.entity';
import { ArticleService } from '@app/communities/article/article.service';
import { CommentDeleteCommand } from '@app/communities/comments/commands/comment-delete.command';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
    private boardService: BoardService,
    private articlesService: ArticleService,
  ) {}

  async getComments(commentListQuery: CommentListQuery) {
    const board = await this.boardService.findById(commentListQuery.boardId, {
      select: ['isAnonymous'],
    });
    const comments = await this.commentRepository.find({
      where: { articleId: commentListQuery.articleId },
      order: { createdAt: 'DESC' },
    });

    return comments.map((comment) => {
      return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        isAnonymous: board.isAnonymous,
      };
    });
  }

  async createComment(
    createCommentCommand: CommentCreateCommand,
  ): Promise<CommentResponseCommand> {
    const { boardId, ...createCommentData } = createCommentCommand;
    const board = await this.boardService.findById(boardId, {
      select: ['isAnonymous'],
    });
    if (!board) throw new NotFoundException('Board not found');

    const article = await this.articlesService.findById(
      createCommentCommand.articleId,
      {
        select: ['authorId'],
      },
    );
    if (!article) throw new NotFoundException('Article not found');

    const createdComment = this.commentRepository.create(createCommentData);
    const comment = await this.commentRepository.save(createdComment);

    return {
      ...comment,
      isArticleAuthor: article.authorId === comment.authorId,
      isAnonymous: board.isAnonymous,
    };
  }

  async hitCommentLike(params: CommentLikeCommand): Promise<boolean> {
    const { articleId, id, userId } = params;
    const comment = await this.commentRepository.findOne({
      where: { id, articleId },
      relations: {
        likes: true,
      },
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId === userId)
      throw new BadRequestException('You cannot like your own comment');

    if (comment.likes.find((like) => like.authorId === userId)) {
      return false;
    }

    const [commentLike, updateResult] = await Promise.all([
      this.commentLikeRepository.save({
        commentId: comment.id,
        authorId: userId,
      }),
      this.commentRepository.increment({ id: comment.id }, 'likesCount', 1),
    ]);

    return commentLike && updateResult.affected > 0;
  }

  async deleteComment(
    commentDeleteCommand: CommentDeleteCommand,
  ): Promise<boolean> {
    const comment = await this.findById(commentDeleteCommand.id, {
      select: {
        id: true,
        authorId: true,
      },
    });
    if (comment.authorId !== commentDeleteCommand.userId)
      throw new BadRequestException('You cannot delete other user comment');

    const { affected } = await this.commentRepository.update(comment.id, {
      deletedAt: new Date(),
    });
    return affected > 0;
  }

  async findById(
    id: number,
    options?: FindOneOptions<Comment>,
  ): Promise<Comment> {
    return await this.commentRepository.findOne({ where: { id }, ...options });
  }
}
