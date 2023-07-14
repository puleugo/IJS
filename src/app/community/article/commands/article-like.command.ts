import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleLikeCommand = Pick<IArticle, 'id'> & {
  userId: string;
};
