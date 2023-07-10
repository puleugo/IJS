import { IArticle } from '@domain/communities/articles/article.interface';
import { UserProfileResponseCommand } from '@app/user/command/user-profile-response.command';

export type ArticleProfileCommand = Pick<
  IArticle,
  | 'id'
  | 'title'
  | 'content'
  | 'images'
  | 'boardId'
  | 'likesCount'
  | 'commentsCount'
  | 'createdAt'
> &
  Partial<Pick<IArticle, 'updatedAt'>> & {
    author: UserProfileResponseCommand;
    isAnonymous: boolean;
  };
