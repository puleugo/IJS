import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleCreateCommand = Pick<
  IArticle,
  'title' | 'content' | 'boardId' | 'authorId'
> &
  Partial<Pick<IArticle, 'images'>>;
