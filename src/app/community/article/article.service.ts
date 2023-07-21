import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ArticlePreviewResponse } from '@app/community/article/dtos/article-preview.response';
import { Article } from '@domain/communities/articles/article.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleProfileCommand } from '@app/community/article/commands/article-profile.command';
import { ArticleCreateCommand } from '@app/community/article/commands/article-create.command';
import { ArticleUpdateCommand } from '@app/community/article/commands/article-update.command';
import { UserService } from '@app/user/user.service';
import { ArticleLikeCommand } from '@app/community/article/commands/article-like.command';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { ArticleDeleteCommand } from '@app/community/article/commands/article-delete.command';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { BoardService } from '@app/community/board/board.service';
import { ArticleImageUploadCommand } from '@app/community/article/commands/article-image-upload.command';
import { PhotoClient } from '@infrastructure/utils/photo.client';
import { BoardNotFoundException } from '@domain/error/board.error';
import {
  ArticleNotFoundException,
  ArticlePermissionDeniedException,
  CanNotLikeOwnArticleException,
} from '@domain/error/article.error';
import { Pagination } from '@infrastructure/types/pagination.types';
import { paginate } from 'nestjs-typeorm-paginate';

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
    page: number;
    limit: number;
  }): Promise<Pagination<ArticlePreviewResponse>> {
    const board = await this.boardService.findById(params.boardId, {
      select: { isAnonymous: true },
    });
    if (!board) throw new BoardNotFoundException();

    const { items, meta } = await paginate(
      this.articleRepository,
      {
        page: params.page,
        limit: params.limit,
      },
      {
        where: { boardId: board.id },
        relations: {
          author: true,
          board: true,
        },
        order: { createdAt: 'DESC' },
      },
    );
    return {
      items: items.map(
        (article) =>
          new ArticlePreviewResponse({
            ...article,
            isAnonymous: board.isAnonymous,
          }),
      ),
      meta,
    };
  }

  async getArticle(params: {
    boardId: number;
    articleId: number;
  }): Promise<ArticleProfileCommand> {
    const { articleId, boardId } = params;
    const board = await this.boardService.findById(boardId, {
      select: { isAnonymous: true },
    });
    if (!board) throw new BoardNotFoundException();

    const article = await this.findById(articleId);
    if (!article) throw new ArticleNotFoundException();
    await this.articleRepository.increment({ id: articleId }, 'viewsCount', 1);

    return {
      ...article,
      isAnonymous: board.isAnonymous,
      author: { id: article.authorId },
    };
  }

  async createArticle(
    articleCreateCommand: ArticleCreateCommand,
  ): Promise<ArticleProfileCommand> {
    const { authorId, boardId } = articleCreateCommand;
    const board = await this.boardService.findById(boardId, {
      select: {
        isAnonymous: true,
      },
    });
    if (!board) throw new BoardNotFoundException();

    const createdArticle = await this.articleRepository.create({
      ...articleCreateCommand,
      authorId,
    });
    const [article, incrementResult] = await Promise.all([
      this.articleRepository.save(createdArticle),
      this.boardService.incrementArticleCount(boardId),
    ]);
    if (incrementResult.affected === 0)
      throw new InternalServerErrorException();

    return {
      ...article,
      isAnonymous: board.isAnonymous,
      author: { id: authorId },
    };
  }

  async updateArticle(
    articleUpdateCommand: ArticleUpdateCommand,
  ): Promise<ArticleProfileCommand> {
    const { id, userId, boardId, ...articleData } = articleUpdateCommand;
    const board = await this.boardService.findById(boardId, {
      select: { isAnonymous: true },
    });
    if (!board) throw new BoardNotFoundException();

    const article = await this.findById(id);
    if (!article) throw new ArticleNotFoundException();
    if (article.authorId !== userId)
      throw new ArticlePermissionDeniedException();

    const updateResult = await this.articleRepository.update(
      { id: article.id },
      {
        ...article,
        ...articleData,
        updatedAt: new Date(),
      },
    );
    if (!updateResult.affected) throw new InternalServerErrorException();

    return {
      ...article,
      ...articleData,
      isAnonymous: board.isAnonymous,
    };
  }

  async hitArticleLike(params: ArticleLikeCommand): Promise<boolean> {
    const { id, userId } = params;

    const article = await this.findById(id);
    if (!article) throw new ArticleNotFoundException();

    if (article.authorId === userId) throw new CanNotLikeOwnArticleException();

    const articleLike = await this.articleLikeRepository.findOne({
      where: { articleId: id, authorId: userId },
    });

    if (!articleLike) {
      const [updateResult, _] = await Promise.all([
        this.articleRepository.increment({ id }, 'likesCount', 1),
        this.articleLikeRepository.save({
          articleId: article.id,
          authorId: userId,
        }),
      ]);

      return updateResult.affected > 0;
    }
    const [updateResult, deleteResult] = await Promise.all([
      this.articleRepository.decrement({ id }, 'likesCount', 1),
      this.articleLikeRepository.delete({
        authorId: articleLike.authorId,
        articleId: articleLike.articleId,
      }),
    ]);

    return !(updateResult.affected > 0 && deleteResult.affected > 0);
  }

  async deleteArticle(params: ArticleDeleteCommand): Promise<boolean> {
    const { id, userId, boardId } = params;
    const board = await this.boardService.findById(boardId, {
      select: { id: true, isAnonymous: true },
    });
    if (!board) throw new BoardNotFoundException();

    const article = await this.findById(id, { where: { boardId: board.id } });
    if (!article) throw new ArticleNotFoundException();
    if (article.authorId !== userId)
      throw new ArticlePermissionDeniedException();

    const [softDeleteResult, decrementResult] = await Promise.all([
      this.articleRepository.softDelete({ id }),
      this.boardService.decrementArticleCount(board.id),
    ]);

    return softDeleteResult.affected > 0 && decrementResult.affected > 0;
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
    return await this.articleRepository.findOne({
      ...options,
      ...{ where: { id, ...options?.where } },
    });
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

  async incrementCommentsCount(articleId: number): Promise<UpdateResult> {
    return await this.articleRepository.increment(
      { id: articleId },
      'commentsCount',
      1,
    );
  }

  async decrementCommentsCount(articleId: number): Promise<UpdateResult> {
    return await this.articleRepository.decrement(
      { id: articleId },
      'commentsCount',
      1,
    );
  }
}
