import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '@app/community/article/article.service';
import { ArticlePreviewResponse } from '@app/community/article/dtos/article-preview.response';
import { ArticleProfileResponse } from '@app/community/article/dtos/article-profile.response';
import { ArticleCreateRequest } from '@app/community/article/dtos/article-create.request';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
import { Request } from '@infrastructure/types/request.types';
import { ArticleUpdateRequest } from '@app/community/article/dtos/article-update.request';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFastifyInterceptor,
  memoryStorage,
} from 'fastify-file-interceptor';

@Controller('boards/:boardId/articles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('[커뮤니티] 게시글')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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
  ): Promise<ArticlePreviewResponse[]> {
    const articles = await this.articleService.getArticles({ boardId });
    return articles.map((article) => new ArticlePreviewResponse(article));
  }

  @Get(':articleId')
  @ApiOperation({ summary: '게시글 상세 조회' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiOkResponse({ description: '게시글 조회 성공' })
  @ApiNotFoundResponse({
    description: [
      '게시판을 찾을 수 없습니다.',
      '게시글을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  async getArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
  ): Promise<ArticleProfileResponse> {
    const article = await this.articleService.getArticle({
      articleId,
      boardId,
    });
    return new ArticleProfileResponse(article);
  }

  @Post()
  @ApiOperation({ summary: '게시글 생성' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiCreatedResponse({ description: '게시글 생성 성공' })
  @ApiNotFoundResponse({
    description: [
      '게시판을 찾을 수 없습니다.',
      '게시글을 찾을 수 없습니다.',
    ].join('<br>'),
  })
  async createArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() articleCreateRequest: ArticleCreateRequest,
    @Req() { user }: Request,
  ): Promise<ArticleProfileResponse> {
    const article = await this.articleService.createArticle({
      ...articleCreateRequest,
      boardId,
      authorId: user.id,
    });
    return new ArticleProfileResponse(article);
  }

  @Post(':articleId/likes')
  @ApiOperation({ summary: '게시글 좋아요' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 좋아요 성공',
    type: String,
  })
  @ApiNotFoundResponse({
    description: '게시글을 찾을 수 없습니다.',
  })
  @ApiBadRequestResponse({
    description: '자신의 댓글에는 좋아요를 누를 수 없습니다.',
  })
  async likeArticle(
    @Param('boardId', ParseIntPipe) _,
    @Param('articleId', ParseIntPipe) id: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isHitArticle = await this.articleService.hitArticleLike({
      id,
      userId: user.id,
    });
    return isHitArticle ? 'hit' : 'unhit';
  }

  @Post(':articleId/reports')
  @ApiOperation({ summary: '게시글 신고' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 신고 성공',
    type: String,
  })
  async reportArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Req() { user }: Request,
    @Body() { reportReason }: { reportReason: string },
  ): Promise<string> {
    const isReported = await this.articleService.reportArticle({
      id: articleId,
      userId: user.id,
      reportReason,
    });
    return isReported ? 'reported' : 'not reported';
  }

  @Post(':articleId/images')
  @ApiOperation({ summary: '게시글 이미지 업로드' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 이미지 업로드 성공',
    type: String,
    isArray: true,
  })
  @UseInterceptors(FileFastifyInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  async uploadArticleImage(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Req() { user }: Request,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    const imageUrls = await this.articleService.uploadArticleImage({
      userId: user.id,
      images: files.map((file) => file.buffer),
    });
    return imageUrls;
  }

  @Put(':articleId')
  @ApiOperation({ summary: '게시글 수정' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 수정 성공',
    type: ArticleProfileResponse,
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
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) id: number,
    @Body() articleUpdateRequest: ArticleUpdateRequest,
    @Req() { user }: Request,
  ): Promise<ArticleProfileResponse> {
    const article = await this.articleService.updateArticle({
      ...articleUpdateRequest,
      id,
      userId: user.id,
      boardId,
    });
    return new ArticleProfileResponse(article);
  }

  @Delete(':articleId')
  @ApiOperation({ summary: '게시글 삭제' })
  @ApiParam({ name: 'boardId', description: '게시판 아이디', required: true })
  @ApiParam({ name: 'articleId', description: '게시글 아이디', required: true })
  @ApiCreatedResponse({
    description: '게시글 삭제 성공',
    type: String,
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
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) id: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isDeleted = await this.articleService.deleteArticle({
      id,
      userId: user.id,
      boardId: boardId,
    });
    return isDeleted ? 'deleted' : 'not deleted';
  }
}
