import { ArticlePreviewCommand } from '@app/communities/article/commands/article-preview.command';
import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';
import { UserPreviewResponse } from '@app/user/dto/user-preview.response';

export class ArticlePreviewResponse implements ArticlePreviewCommand {
  id: number;
  title: string;
  content: string;
  images: string[];
  boardId: number;
  likesCount: number;
  commentsCount: number;
  author: UserPreviewResponseCommand | null;
  createdAt: Date;
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
    isAnonymous,
  }: ArticlePreviewCommand) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.images = images;
    this.boardId = boardId;
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.author = new UserPreviewResponse(author);
    this.createdAt = createdAt;
    this.isAnonymous = isAnonymous;
  }
}
