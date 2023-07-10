import { ArticleProfileCommand } from '@app/community/article/commands/article-profile.command';
import { UserProfileResponseCommand } from '@app/user/command/user-profile-response.command';
import { UserProfileResponse } from '@app/user/dto/user-profile.response';

export class ArticleProfileResponse implements ArticleProfileCommand {
  id: number;
  title: string;
  content: string;
  images: string[];
  boardId: number;
  likesCount: number;
  commentsCount: number;
  author: UserProfileResponseCommand;
  createdAt: Date;
  isUpdated: boolean;
  isAnonymous: boolean;

  constructor({
    id,
    title,
    content,
    images,
    boardId,
    likesCount,
    commentsCount,
    author,
    createdAt,
    updatedAt,
    isAnonymous,
  }: ArticleProfileCommand) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.images = images;
    this.boardId = boardId;
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.author = new UserProfileResponse(author);
    this.createdAt = createdAt;
    this.isUpdated = createdAt !== updatedAt;
    this.isAnonymous = isAnonymous;
  }
}
