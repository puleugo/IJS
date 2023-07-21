import { IUser } from '@domain/user/user.interface';
import { IArticle } from '@domain/communities/articles/article.interface';
import { CommentLike } from '@domain/communities/comments/comment-like.entity';

export interface IComment {
  id: number;
  content: string;
  authorId: string;
  author: IUser;
  articleId: number;
  article: IArticle;
  likesCount: number;
  likes: CommentLike[];
  replyToId: number | null;
  replyTo: IComment | null;
  replies: IComment[];
  createdAt: Date;
  deletedAt: Date | null;
}
