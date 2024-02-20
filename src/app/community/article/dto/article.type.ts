import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';
import { UserPreviewResponseType, } from '@app/user/dto/user.type';
import { Article, } from '@app/community/article/domain/article.entity';

export type ArticleCreateRequestType = Pick<
    Article,
    'title' | 'content' | 'boardId' | 'authorId'
> &
    Partial<Pick<Article, 'images'>>;

export type CouncilArticleCreateRequestType = Pick<
    Partial<CouncilArticle>,
    'title' | 'content' | 'boardId' | 'majorId' | 'authorId'
> &
    Partial<Pick<CouncilArticle, 'images'>>;

export type ArticleHitLikeRequestType = Pick<Article, 'id'> & { userId: string; };

export type ArticleDeleteRequestType = Pick<Article, 'id' | 'boardId'>;
export type ArticleImageUploadRequestType = { images: Buffer[]; };

export type ArticlePreviewRequestType = Pick<
    Article,
    | 'id' | 'title' | 'content' | 'images' | 'boardId' | 'likesCount' | 'commentsCount' | 'createdAt' | 'authorId'
> & {
    author: UserPreviewResponseType | null;
    isAnonymous: boolean;
    isCouncil: boolean;
    majorId?: number;
};

export type ArticleProfileResponseType = Pick<
    Article,
    | 'id' | 'title' | 'content' | 'images' | 'boardId' | 'likesCount' | 'viewsCount' | 'commentsCount' | 'createdAt' | 'authorId'
> &
    Partial<Pick<Article, 'updatedAt'>> & {
    author: UserPreviewResponseType | null;
    isAnonymous: boolean;
    isCouncil: boolean;
    majorId?: number | null;
};

export type ArticleUpdateRequestType = Partial<
    Pick<Article, 'title' | 'content' | 'images'>
>;
