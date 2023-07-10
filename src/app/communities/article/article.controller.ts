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
} from '@nestjs/common';
import { ArticleService } from '@app/communities/article/article.service';
import { ArticlePreviewResponse } from '@app/communities/article/dtos/article-preview.response';
import { ArticleProfileResponse } from '@app/communities/article/dtos/article-profile.response';
import { ArticleCreateRequest } from '@app/communities/article/dtos/article-create.request';
import { JwtAuthGuard } from '@app/auth/authentication/auth.gaurd';
import { Request } from '@infrastructure/types/request.types';
import { ArticleUpdateRequest } from '@app/communities/article/dtos/article-update.request';

@Controller('board/:boardId/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async getArticles(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<ArticlePreviewResponse[]> {
    const articles = await this.articleService.getArticles({ boardId });
    return articles.map(
      (article) => new ArticlePreviewResponse({ ...article }),
    );
  }

  @Get(':articleId')
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async likeArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isHitArticle = await this.articleService.hitArticleLike({
      id: articleId,
      userId: user.id,
      boardId,
    });
    return isHitArticle ? 'hit' : 'unhit';
  }

  @Post(':articleId/reports')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async updateArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Body() articleUpdateRequest: ArticleUpdateRequest,
    @Req() { user }: Request,
  ): Promise<ArticleProfileResponse> {
    const article = await this.articleService.updateArticle({
      ...articleUpdateRequest,
      id: articleId,
      userId: user.id,
      boardId,
    });
    return new ArticleProfileResponse(article);
  }

  @Delete(':articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('articleId', ParseIntPipe) articleId: number,
    @Req() { user }: Request,
  ): Promise<string> {
    const isDeleted = await this.articleService.deleteArticle({
      id: articleId,
      userId: user.id,
    });
    return isDeleted ? 'deleted' : 'not deleted';
  }
}
