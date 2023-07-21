import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleDeleteCommand = Pick<IArticle, 'id' | 'boardId'> & {
  userId: string;
};
