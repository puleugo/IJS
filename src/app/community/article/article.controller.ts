import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '@app/community/article/article.service';
import { ArticlePreviewResponse } from '@app/community/article/dto/article-preview.response';
import { ArticleProfileResponse } from '@app/community/article/dto/article-profile.response';
import { ArticleCreateRequest } from '@app/community/article/dto/article-create.request';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
import { Request } from '@infrastructure/types/request.types';
import { ArticleUpdateRequest } from '@app/community/article/dto/article-update.request';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from '@infrastructure/types/pagination.types';
import { FilesInterceptor } from '@nestjs/platform-express';
import { BoardService } from '@app/community/board/board.service';
import { CouncilArticleCreateRequest } from '@app/community/article/dto/council-article-create.request';
import { BoardNotFoundException } from '@domain/error/board.error';
import {
  ArticleNotFoundException,
  ArticlePermissionDeniedException,
  CanNotLikeOwnArticleException,
} from '@domain/error/article.error';
import { ArticleReportRequest } from '@app/community/article/dto/article-report.request';
import { UserService } from '@app/user/user.service';

@Controller('boards/:boardId/articles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('[커뮤니티] 게시글')
export class ArticleController {
  constructor(
    private readonly boardService: BoardService,
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiOperation({ summary: '게시글 목록 조회' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiOkResponse({
    description: '게시글 목록 조회 성공',
    type: [ArticlePreviewResponse],
  })
  @ApiNotFoundResponse({
    description: '게시판을 찾을 수 없습니다.',
  })
  async getArticles(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<Pagination<ArticlePreviewResponse>> {
    const board = await this.boardService.findById(boardId);
    if (!board) throw new BoardNotFoundException();

    if (board.isCouncil) {
      const articles = await this.articleService.getPaginatedCouncilArticles({
        boardId,
        page,
        limit,
      });

      return {
        items: articles.items.map((article) => {
          return new ArticlePreviewResponse({
            ...article,
            isCouncil: true,
            isAnonymous: board.isAnonymous,
          });
        }),
        meta: articles.meta,
      };
    }

    const articles = await this.articleService.getPaginatedArticles({
      boardId,
      page,
      limit,
    });

    return {
      items: articles.items.map((article) => {
        return new ArticlePreviewResponse({
          ...article,
          isCouncil: false,
          isAnonymous: board.isAnonymous,
        });
      }),
      meta: articles.meta,
    };
  }

  @Get(':articleId')
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiOkResponse({
    description: '게시글 조회 성공',
    type: ArticleProfileResponse,
  })
  @ApiNotFoundResponse({
    description: [
      '게시판을 찾을 수 없습니다.',
      '게시글을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  async getArticle(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Param('articleId', ParseIntPipe)
    articleId: number,
  ): Promise<ArticleProfileResponse> {
    const board = await this.boardService.findById(boardId);
    if (!board) throw new BoardNotFoundException();

    if (board.isCouncil) {
      const article = await this.articleService.getCouncilArticle(articleId);
      return new ArticleProfileResponse({
        ...article,
        isAnonymous: board.isAnonymous,
        isCouncil: board.isCouncil,
      });
    }

    const article = await this.articleService.getArticle(articleId);
    return new ArticleProfileResponse({
      ...article,
      isAnonymous: board.isAnonymous,
      isCouncil: board.isCouncil,
    });
  }

  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiBody({
    description: '게시글 생성 요청',
    type: ArticleCreateRequest,
  })
  @ApiCreatedResponse({
    description: '게시글 생성 성공',
    type: ArticleProfileResponse,
  })
  @ApiNotFoundResponse({
    description: [
      '게시판을 찾을 수 없습니다.',
      '게시글을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  async createArticle(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Body()
    articleCreateRequest: ArticleCreateRequest | CouncilArticleCreateRequest,
    @Req() { user }: Request,
  ): Promise<ArticleProfileResponse> {
    const board = await this.boardService.findById(boardId);
    if (!board) throw new BoardNotFoundException();

    if (board.isCouncil) {
      const article = await this.articleService.createCouncilArticle({
        ...articleCreateRequest,
        boardId,
        authorId: user.id,
      });
      return new ArticleProfileResponse({
        ...article,
        isAnonymous: board.isAnonymous,
        isCouncil: board.isCouncil,
      });
    }

    const article = await this.articleService.createArticle({
      ...articleCreateRequest,
      boardId,
      authorId: user.id,
    });
    return new ArticleProfileResponse({
      ...article,
      isAnonymous: board.isAnonymous,
      isCouncil: board.isCouncil,
    });
  }

  @Post(':articleId/likes')
  @ApiOperation({ summary: '게시글 좋아요' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 좋아요 성공',
  })
  @ApiNotFoundResponse({
    description: '게시글을 찾을 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '자신의 댓글에는 좋아요를 누를 수 없습니다.',
  })
  async likeArticle(
    @Param('articleId', ParseIntPipe)
    id: number,
    @Req()
    { user }: Request,
  ): Promise<void> {
    const article = await this.articleService.findById(id);
    if (!article) throw new ArticleNotFoundException();
    if (article.authorId === user.id) throw new CanNotLikeOwnArticleException();

    const isHitArticle = await this.articleService.hitArticleLike({
      id,
      userId: user.id,
    });
    if (!isHitArticle) throw new InternalServerErrorException();
    return;
  }

  @Post(':articleId/reports')
  @ApiOperation({ summary: '게시글 신고' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiBody({ type: ArticleReportRequest })
  @ApiCreatedResponse({
    description: '게시글 신고 성공',
  })
  async reportArticle(
    @Param('boardId', ParseIntPipe)
    _: number,
    @Param('articleId', ParseIntPipe)
    articleId: number,
    @Req() { user }: Request,
    @Body() articleReportRequest: ArticleReportRequest,
  ): Promise<void> {
    await this.articleService.reportArticle({
      id: articleId,
      userId: user.id,
      reportReason: articleReportRequest.reason,
    });
  }

  @Post(':articleId/images')
  @ApiOperation({ summary: '게시글 이미지 업로드' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 이미지 업로드에 성공하여 이미지 URL을 반환합니다.',
    type: String,
    isArray: true,
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  async uploadArticleImage(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Param('articleId', ParseIntPipe)
    articleId_: number,
    @Req()
    { user }: Request,
    @UploadedFiles()
    files: Express.Multer.File[],
  ): Promise<string[]> {
    return await this.articleService.uploadArticleImage({
      images: files.map((file) => file.buffer),
    });
  }

  @Patch(':articleId')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiBody({
    description: '게시글 수정 요청',
    type: ArticleUpdateRequest,
  })
  @ApiCreatedResponse({
    description: '게시글 수정 성공',
  })
  @ApiNotFoundResponse({
    description: [
      '게시글을 찾을 수 없습니다.',
      '게시판을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  @ApiBadRequestResponse({
    description: '게시글에 대한 권한이 없습니다.',
  })
  async updateArticle(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Param('articleId', ParseIntPipe)
    id: number,
    @Body()
    articleUpdateRequest: ArticleUpdateRequest,
    @Req() { user }: Request,
  ): Promise<void> {
    const board = await this.boardService.findById(boardId);
    if (!board) throw new BoardNotFoundException();

    const article = await this.articleService.findById(id);
    if (!article) throw new ArticleNotFoundException();
    if (article.authorId !== user.id)
      throw new ArticlePermissionDeniedException();

    return await this.articleService.updateArticle(id, articleUpdateRequest);
  }

  @Delete(':articleId')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 삭제 성공',
  })
  @ApiNotFoundResponse({
    description: [
      '게시글을 찾을 수 없습니다.',
      '게시판을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  @ApiBadRequestResponse({
    description: '게시글에 대한 권한이 없습니다.',
  })
  async deleteArticle(
    @Param('boardId', ParseIntPipe)
    boardId: number,
    @Param('articleId', ParseIntPipe)
    id: number,
    @Req()
    { user }: Request,
  ): Promise<void> {
    const board = await this.boardService.findById(boardId, {
      select: { id: true, isAnonymous: true },
    });
    if (!board) throw new BoardNotFoundException();

    const article = await this.articleService.findById(id, {
      where: { boardId: board.id },
    });
    if (!article) throw new ArticleNotFoundException();
    if (article.authorId !== user.id)
      throw new ArticlePermissionDeniedException();

    await this.articleService.deleteArticle({
      id,
      boardId: boardId,
    });
  }
}
