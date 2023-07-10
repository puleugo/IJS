import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ArticlePreviewResponse } from '@app/communities/article/dtos/article-preview.response';
import { Article } from '@domain/communities/articles/article.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleProfileCommand } from '@app/communities/article/commands/article-profile.command';
import { ArticleCreateCommand } from '@app/communities/article/commands/article-create.command';
import { ArticleUpdateCommand } from '@app/communities/article/commands/article-update.command';
import { UserService } from '@app/user/user.service';
import { ArticleLikeCommand } from '@app/communities/article/commands/article-like.command';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { ArticleDeleteCommand } from '@app/communities/article/commands/article-delete.command';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { BoardService } from '@app/communities/board/board.service';
import { ArticleImageUploadCommand } from '@app/communities/article/commands/article-image-upload.command';
import { PhotoClient } from '@infrastructure/utils/photo.client';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(ArticleLike)
    private readonly articleLikeRepository: Repository<ArticleLike>,
    @Inject('ArticlePhotoClient')
    private readonly articlePhotoClient: PhotoClient,
    private readonly boardService: BoardService,
    private readonly userService: UserService,
  ) {}

  async getArticles(params: {
    boardId: number;
  }): Promise<ArticlePreviewResponse[]> {
    const { boardId } = params;
    const articles = await this.articleRepository.find({
      where: { boardId },
      relations: {
        author: true,
        board: true,
      },
      order: { createdAt: 'DESC' },
    });
    return articles.map(
      (article) =>
        new ArticlePreviewResponse({
          ...article,
          isAnonymous: article.board.isAnonymous,
        }),
    );
  }

  async getArticle(params: {
    boardId: number;
    articleId: number;
  }): Promise<ArticleProfileCommand> {
    const { articleId } = params;

    const article = await this.findById(articleId, {
      relations: {
        board: true,
      },
    });
    if (!article) throw new NotFoundException('Article not found');
    await this.articleRepository.increment({ id: articleId }, 'viewsCount', 1);

    return { ...article, isAnonymous: article.board.isAnonymous };
  }

  async createArticle(
    articleCreateCommand: ArticleCreateCommand,
  ): Promise<ArticleProfileCommand> {
    const board = await this.boardService.findById(
      articleCreateCommand.boardId,
      {
        select: {
          isAnonymous: true,
        },
      },
    );

    const createdArticle = await this.articleRepository.create(
      articleCreateCommand,
    );
    const article = await this.articleRepository.save(createdArticle);

    return { ...article, isAnonymous: board.isAnonymous };
  }

  async updateArticle(
    articleUpdateCommand: ArticleUpdateCommand,
  ): Promise<ArticleProfileCommand> {
    const { id, userId, ...articleData } = articleUpdateCommand;
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const article = await this.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    const isUserHasArticlePermission = await this.userHasArticlePermission(
      user.id,
      article,
    );
    if (!isUserHasArticlePermission)
      throw new UnauthorizedException(
        'User has no permission to update this article',
      );

    const updateResult = await this.articleRepository.update(
      { id: article.id },
      {
        ...article,
        ...articleData,
      },
    );
    if (!updateResult.affected) throw new InternalServerErrorException();

    return {
      ...article,
      ...articleData,
      isAnonymous: article.board.isAnonymous,
    };
  }

  async hitArticleLike(params: ArticleLikeCommand): Promise<boolean> {
    const { id, userId } = params;
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const article = await this.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    const isUserHasArticlePermission = await this.userHasArticlePermission(
      user.id,
      article,
    );
    if (isUserHasArticlePermission)
      throw new BadRequestException('User cannot like own article');

    const articleLike = await this.articleLikeRepository.findOne({
      where: { articleId: id, authorId: userId },
    });

    if (!articleLike) {
      const [updateResult, _] = await Promise.all([
        this.articleRepository.increment({ id }, 'likeCount', 1),
        this.articleLikeRepository.save({
          articleId: article.id,
          authorId: user.id,
        }),
      ]);

      return updateResult.affected > 1;
    }

    const [updateResult, deleteResult] = await Promise.all([
      this.articleRepository.decrement({ id }, 'likeCount', 1),
      this.articleLikeRepository.delete({ id: articleLike.id }),
    ]);

    return updateResult.affected > 0 && deleteResult.affected > 0;
  }

  async deleteArticle(params: ArticleDeleteCommand): Promise<boolean> {
    const { id, userId } = params;
    const user = await this.userService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const article = await this.findById(id, {
      where: { board: true },
    });
    if (!article) throw new NotFoundException('Article not found');
    const isUserHasArticlePermission = await this.userHasArticlePermission(
      user.id,
      article,
    );
    if (!isUserHasArticlePermission)
      throw new UnauthorizedException(
        'User has no permission to delete this article',
      );

    const { affected } = await this.articleRepository.softDelete({ id });
    return affected > 0;
  }

  async reportArticle(params: {
    id: number;
    userId: string;
    reportReason: string;
  }): Promise<boolean> {
    return true;
  }

  async findById(
    id: number,
    options?: FindOneOptions<Article>,
  ): Promise<Article> {
    return await this.articleRepository.findOne({ where: { id }, ...options });
  }

  async userHasArticlePermission(
    userId: string,
    article: Article,
  ): Promise<boolean> {
    return article.authorId !== userId;
  }

  async uploadArticleImage(
    articleImageUploadCommand: ArticleImageUploadCommand,
  ): Promise<string[]> {
    const { images, userId } = articleImageUploadCommand;
    const resizedImages = await Promise.all(
      images.map((image) => this.articlePhotoClient.resizePhoto(image)),
    );
    const uploadedImages = await Promise.all(
      resizedImages.map((image) => this.articlePhotoClient.uploadPhoto(image)),
    );
    return uploadedImages;
  }
}
