import { IArticle } from '@domain/communities/articles/article.interface';
import { CouncilArticle } from '@domain/communities/articles/council-article.entity';
import { UserPreviewResponseType } from '@app/user/user.type';

export type ArticleCreateRequestType = Pick<
  IArticle,
  'title' | 'content' | 'boardId' | 'authorId'
> &
  Partial<Pick<IArticle, 'images'>>;

export type CouncilArticleCreateRequestType = Pick<
  Partial<CouncilArticle>,
  'title' | 'content' | 'boardId' | 'majorId' | 'authorId'
> &
  Partial<Pick<CouncilArticle, 'images'>>;

export type ArticleHitLikeRequestType = Pick<IArticle, 'id'> & {
  userId: string;
};

export type ArticleDeleteRequestType = Pick<IArticle, 'id' | 'boardId'>;
export type ArticleImageUploadRequestType = {
  images: Buffer[];
};

export type ArticlePreviewRequestType = Pick<
  IArticle,
  | 'id'
  | 'title'
  | 'content'
  | 'images'
  | 'boardId'
  | 'likesCount'
  | 'commentsCount'
  | 'createdAt'
  | 'authorId'
> & {
  author: UserPreviewResponseType | null;
  isAnonymous: boolean;
  isCouncil: boolean;
  majorId?: number;
};

export type ArticleProfileResponseType = Pick<
  IArticle,
  | 'id'
  | 'title'
  | 'content'
  | 'images'
  | 'boardId'
  | 'likesCount'
  | 'viewsCount'
  | 'commentsCount'
  | 'createdAt'
  | 'authorId'
> &
  Partial<Pick<IArticle, 'updatedAt'>> & {
    author: UserPreviewResponseType | null;
    isAnonymous: boolean;
    isCouncil: boolean;
    majorId?: number | null;
  };

export type ArticleUpdateRequestType = Partial<
  Pick<IArticle, 'title' | 'content' | 'images'>
>;
