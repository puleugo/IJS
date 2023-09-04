import {
	Inject, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { Article, } from '@app/community/article/domain/article.entity';
import { Repository, UpdateResult, } from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { ArticleLike, } from '@app/community/article/domain/article-like.entity';
import { FindOneOptions, } from 'typeorm/find-options/FindOneOptions';
import { BoardService, } from '@app/community/board/board.service';
import { PhotoClient, } from '@common/type/photo.client';
import { getPaginationMeta, IPagination, } from '@common/utils/pagination.types';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';
import {
	ArticleCreateRequestType,
	ArticleDeleteRequestType,
	ArticleHitLikeRequestType,
	ArticleImageUploadRequestType,
	ArticleUpdateRequestType,
	CouncilArticleCreateRequestType,
} from '@app/community/article/dto/article.type';

@Injectable()
export class ArticleService {
	constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
        @InjectRepository(CouncilArticle)
        private readonly councilArticleRepository: Repository<CouncilArticle>,
        @InjectRepository(ArticleLike)
        private readonly articleLikeRepository: Repository<ArticleLike>,
        @Inject('ArticlePhotoClient')
        private readonly articlePhotoClient: PhotoClient,
        private readonly boardService: BoardService
	) {}

	async getPaginatedArticles(params: {
        boardId: number;
        page: number;
        limit: number;
    }): Promise<IPagination<Article>> {
		const articles = await this.articleRepository.find({
			skip: (params.page - 1) * params.limit,
			take: params.limit,
			where: { boardId: params.boardId, },
			relations: {
				author: true,
				board: true,
			},
			order: { createdAt: 'DESC', },
		});

		return {
			items: articles,
			meta: getPaginationMeta(params.page, params.limit, articles.length),
		};
	}

	async getPaginatedCouncilArticles(params: {
    boardId: number;
    page: number;
    limit: number;
  }): Promise<IPagination<CouncilArticle>> {
		const councilArticles = await this.councilArticleRepository.find({
			skip: (params.page - 1) * params.limit,
			take: params.limit,
			where: { boardId: params.boardId, },
			relations: {
				author: true,
				board: true,
			},
			order: { createdAt: 'DESC', },
		});

		return {
			items: councilArticles,
			meta: getPaginationMeta(params.page, params.limit, councilArticles.length),
		};
	}

	async getArticle(id: number): Promise<Article> {
		return await this.articleRepository.findOne({ where: { id, }, });
	}

	async getCouncilArticle(id: number): Promise<CouncilArticle> {
		return await this.councilArticleRepository.findOne({ where: { id, }, });
	}

	async createArticle(
		articleCreateRequest: ArticleCreateRequestType
	): Promise<Article> {
		const { authorId, boardId, ...articleData } = articleCreateRequest;

		const createdArticle = this.articleRepository.create({
			...articleData,
			boardId,
			authorId,
		});

		const [article, incrementResult,] = await Promise.all([
			this.articleRepository.save(createdArticle), this.boardService.incrementArticleCount(boardId),
		]);
		if (incrementResult.affected === 0)
			throw new InternalServerErrorException();

		return article;
	}

	async updateArticle(
		id: number,
		articleUpdateRequest: ArticleUpdateRequestType
	): Promise<void> {
		const updateResult = await this.articleRepository.update(
			{ id, }, { ...articleUpdateRequest, }
		);
		if (!updateResult.affected) throw new InternalServerErrorException();
	}

	async hitArticleLike(params: ArticleHitLikeRequestType): Promise<boolean> {
		const { id, userId, } = params;
		const articleLike = await this.articleLikeRepository.findOne({
			where: {
				articleId: id,
				authorId: userId,
			},
		});

		if (!articleLike) {
			const [updateResult, _,] = await Promise.all([
				this.articleRepository.increment({ id, }, 'likesCount', 1),
				this.articleLikeRepository.save({
					articleId: id,
					authorId: userId,
				}),
			]);

			return updateResult.affected > 0;
		}
		const [updateResult, deleteResult,] = await Promise.all([
			this.articleRepository.decrement({ id, }, 'likesCount', 1),
			this.articleLikeRepository.delete({
				authorId: articleLike.authorId,
				articleId: articleLike.articleId,
			}),
		]);

		return updateResult.affected > 0 && deleteResult.affected > 0;
	}

	async deleteArticle(params: ArticleDeleteRequestType): Promise<boolean> {
		const { id, boardId, } = params;

		const [softDeleteResult, decrementResult,] = await Promise.all([
			this.articleRepository.softDelete({ id, }), this.boardService.decrementArticleCount(boardId),
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
		options?: FindOneOptions<Article>
	): Promise<Article> {
		return await this.articleRepository.findOne({
			...options,
			...{
				where: {
					id,
					...options?.where,
				},
			},
		});
	}

	async uploadArticleImage(
		articleImageUploadRequest: ArticleImageUploadRequestType
	): Promise<string[]> {
		const { images, } = articleImageUploadRequest;
		const resizedImages = await Promise.all(
			images.map((image) => {
				return this.articlePhotoClient.resizePhoto(image);
			})
		);

		return await Promise.all(
			resizedImages.map((image) => {
				return this.articlePhotoClient.uploadPhoto(image);
			})
		);
	}

	async incrementCommentsCount(articleId: number): Promise<UpdateResult> {
		return await this.articleRepository.increment(
			{ id: articleId, }, 'commentsCount', 1
		);
	}

	async decrementCommentsCount(articleId: number): Promise<UpdateResult> {
		return await this.articleRepository.decrement(
			{ id: articleId, }, 'commentsCount', 1
		);
	}

	async createCouncilArticle(
		councilArticleCreateRequestRequest: CouncilArticleCreateRequestType
	): Promise<CouncilArticle> {
		const { authorId, boardId, ...articleContents } =
            councilArticleCreateRequestRequest;

		const createdArticle = this.articleRepository.create({
			...articleContents,
			authorId,
		});
		const [article, incrementResult,] = await Promise.all([
			this.councilArticleRepository.save(createdArticle), this.boardService.incrementArticleCount(boardId),
		]);
		if (incrementResult.affected === 0)
			throw new InternalServerErrorException();

		return article;
	}
}
