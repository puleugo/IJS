import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleUpdateCommand = Pick<IArticle, 'id' | 'boardId'> &
  Partial<Pick<IArticle, 'title' | 'content' | 'images'>> & { userId: string };
