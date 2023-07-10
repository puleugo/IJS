import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentProfileResponse } from '@app/community/comment/dtos/comment-profile.response';
import { CommentService } from '@app/community/comment/comment.service';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
import { Request } from '@infrastructure/types/request.types';
import { CreateCommentRequest } from '@app/community/comment/dtos/create-comment.request';

@Controller('board/:boardId/article/:articleId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getComments(
    @Param('boardId') boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<CommentProfileResponse[]> {
    return await this.commentService.getComments({ boardId, articleId });
  }

  @Post()
  async createComment(
    @Param('boardId') boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Req() { user }: Request,
    @Body() createCommentRequest: CreateCommentRequest,
  ): Promise<CommentProfileResponse> {
    return await this.commentService.createComment({
      boardId,
      articleId,
      authorId: user.id,
      ...createCommentRequest,
    });
  }

  @Post(':commentId/replies')
  async createReplyComment(
    @Param('boardId') boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) id: number,
    @Req() { user }: Request,
    @Body() createCommentRequest: CreateCommentRequest,
  ): Promise<CommentProfileResponse> {
    return await this.commentService.createComment({
      boardId,
      articleId,
      ...createCommentRequest,
      replyToId: id,
      authorId: user.id,
    });
  }

  @Post('like')
  @UseGuards(JwtAuthGuard)
  async likeComment(
    @Param('boardId') _,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) id: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isLiked = await this.commentService.hitCommentLike({
      articleId,
      id,
      userId: user.id,
    });
    return isLiked ? 'liked' : 'already liked';
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('boardId') boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Param('commentId', ParseIntPipe) id: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isDeleted = await this.commentService.deleteComment({
      id,
      userId: user.id,
    });
    if (!isDeleted)
      throw new InternalServerErrorException('Failed to delete comment');

    return 'deleted';
  }
}
