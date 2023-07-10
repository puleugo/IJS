import { IArticle } from '@domain/communities/articles/article.interface';
import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';

export type ArticlePreviewCommand = Pick<
  IArticle,
  | 'id'
  | 'title'
  | 'content'
  | 'images'
  | 'boardId'
  | 'likesCount'
  | 'commentsCount'
  | 'createdAt'
> & {
  author: UserPreviewResponseCommand | null;
  isAnonymous: boolean;
};