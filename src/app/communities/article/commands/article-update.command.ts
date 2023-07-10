import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleUpdateCommand = Pick<
  IArticle,
  'id' | 'title' | 'content' | 'images' | 'boardId'
> & { userId: string };
