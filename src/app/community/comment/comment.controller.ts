import {
	Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req, UseGuards,
} from '@nestjs/common';
import { CommentProfileResponse, } from '@app/community/comment/dto/comment-profile.response';
import { CommentService, } from '@app/community/comment/comment.service';
import { JwtAuthGuard, } from '@app/auth/authentication/auth.gaurd';
import { Request, } from '@common/type/request.type';
import { CreateCommentRequest, } from '@app/community/comment/dto/create-comment.request';
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiBody,
	ApiCreatedResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { BoardService, } from '@app/community/board/board.service';
import { ArticleService, } from '@app/community/article/service/article.service';

@Controller('boards/:boardId/articles/:articleId/comments')
@ApiTags('[커뮤니티] 댓글')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentController {
	constructor(
        private readonly boardService: BoardService,
        private readonly articlesService: ArticleService,
        private readonly commentService: CommentService
	) {}

    @Get()
    @ApiOperation({ summary: '댓글 목록 조회', })
    @ApiParam({
    	name: 'boardId',
    	description: '게시판 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'articleId',
    	description: '게시글 아이디',
    	required: true,
    })
    @ApiOkResponse({
    	description: '댓글 목록 조회 성공',
    	type: CommentProfileResponse,
    	isArray: true,
    })

    @ApiNotFoundResponse({
    	description: [
    		'게시글이 존재하지 않습니다', '게시판이 존재하지 않습니다',
    	].join('<br>'),
    })
	async getComments(
        @Param('boardId') boardId: number,
        @Param('articleId', ParseIntPipe) articleId: number
	): Promise<CommentProfileResponse[]> {
		const comments = await this.commentService.getComments({
			boardId,
			articleId,
		});

		return comments.map((comment) => {
			return new CommentProfileResponse(comment);
		});
	}

    @Post(':commentId/likes')
    @ApiOperation({ summary: '댓글 좋아요', })
    @ApiParam({
    	name: 'boardId',
    	description: '게시판 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'articleId',
    	description: '게시글 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'commentId',
    	description: '댓글 아이디',
    	required: true,
    })
    @ApiCreatedResponse({ description: '댓글 좋아요 성공', })
    @ApiNotFoundResponse({ description: ['댓글을 찾을 수 없습니다.',].join('<br>'), })
    @ApiBadRequestResponse({ description: '자신의 댓글에는 좋아요를 누를 수 없습니다.', })
    async likeComment(
        @Param('boardId', ParseIntPipe) _: number,
        @Param('articleId', ParseIntPipe) articleId: number,
        @Param('commentId', ParseIntPipe) id: number,
        @Req() { user, }: Request
    ): Promise<void> {
    	await this.commentService.hitCommentLike({
    		articleId,
    		id,
    		userId: user.id,
    	});
    }

    @Post()
    @ApiOperation({ summary: '댓글 작성', })
    @ApiParam({
    	name: 'boardId',
    	description: '게시판 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'articleId',
    	description: '게시글 아이디',
    	required: true,
    })
    @ApiBody({
    	description: '댓글 생성 요청',
    	type: CreateCommentRequest,
    })
    @ApiCreatedResponse({
    	description: '댓글 작성 성공',
    	type: CommentProfileResponse,
    })
    @ApiNotFoundResponse({
    	description: [
    		'게시글을 찾을 수 없습니다.', '게시판을 찾을 수 없습니다.',
    	].join('<br>'),
    })
    async createComment(
        @Param('boardId') boardId: number,
        @Param('articleId', ParseIntPipe) articleId: number,
        @Req() { user, }: Request,
        @Body() createCommentRequest: CreateCommentRequest
    ): Promise<CommentProfileResponse> {
    	const comment = await this.commentService.createComment({
    		boardId,
    		articleId,
    		authorId: user.id,
    		...createCommentRequest,
    	});

    	return new CommentProfileResponse(comment);
    }

    @Post(':commentId/replies')
    @ApiOperation({ summary: '대댓글 작성', })
    @ApiParam({
    	name: 'boardId',
    	description: '게시판 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'articleId',
    	description: '게시글 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'commentId',
    	description: '댓글 아이디',
    	required: true,
    })
    @ApiBody({
    	description: '대댓글 생성 요청',
    	type: CreateCommentRequest,
    })
    @ApiCreatedResponse({
    	description: '대댓글 작성 성공',
    	type: CommentProfileResponse,
    })
    @ApiNotFoundResponse({
    	description: [
    		'게시글을 찾을 수 없습니다.',
    		'게시판을 찾을 수 없습니다.',
    		'댓글을 찾을 수 없습니다.',
    	].join('<br>'),
    })
    async createReplyComment(
        @Param('boardId') boardId: number,
        @Param('articleId', ParseIntPipe) articleId: number,
        @Param('commentId', ParseIntPipe) id: number,
        @Req() { user, }: Request,
        @Body() createCommentRequest: CreateCommentRequest
    ): Promise<CommentProfileResponse> {
    	const comment = await this.commentService.createComment({
    		boardId,
    		articleId,
    		...createCommentRequest,
    		replyToId: id,
    		authorId: user.id,
    	});

    	return new CommentProfileResponse({ ...comment, });
    }

    @Delete(':commentId')
    @ApiOperation({ summary: '댓글 삭제', })
    @ApiParam({
    	name: 'boardId',
    	description: '게시판 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'articleId',
    	description: '게시글 아이디',
    	required: true,
    })
    @ApiParam({
    	name: 'commentId',
    	description: '댓글 아이디',
    	required: true,
    })
    @ApiCreatedResponse({ description: '댓글 삭제 성공', })
    @ApiNotFoundResponse({
    	description: [
    		'게시글을 찾을 수 없습니다.', '댓글을 찾을 수 없습니다.',
    	].join('<br>'),
    })
    @ApiBadRequestResponse({ description: '댓글에 대한 권한이 없습니다.', })
    async deleteComment(
        @Param('boardId') boardId: number,
        @Param('articleId', ParseIntPipe) articleId: number,
        @Param('commentId', ParseIntPipe) id: number,
        @Req() { user, }: Request
    ): Promise<void> {
    	await this.commentService.deleteComment({
    		id,
    		articleId,
    		userId: user.id,
    	});
    }
}
