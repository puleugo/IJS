import { CouncilArticle } from '@domain/communities/articles/council-article.entity';

export type ArticleCreateRequestCommand = Pick<
  Partial<CouncilArticle>,
  'title' | 'content' | 'boardId' | 'majorId' | 'authorId'
> &
  Partial<Pick<CouncilArticle, 'images'>>;
