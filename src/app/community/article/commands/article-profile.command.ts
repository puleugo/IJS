import { IArticle } from '@domain/communities/articles/article.interface';
import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';

export type ArticleProfileCommand = Pick<
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
    author: UserPreviewResponseCommand | null;
    isAnonymous: boolean;
    isCouncil: boolean;
    majorId?: number | null;
  };
