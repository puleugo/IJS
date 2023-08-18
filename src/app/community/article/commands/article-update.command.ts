import { IArticle } from '@domain/communities/articles/article.interface';

export type ArticleUpdateCommand = Partial<
  Pick<IArticle, 'title' | 'content' | 'images'>
>;
