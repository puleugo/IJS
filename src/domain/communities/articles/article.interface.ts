import { IBoard } from '@domain/communities/boards/board.interface';
import { IUser } from '@domain/user/user.interface';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { IComment } from '@domain/communities/comments/comment.interface';

export interface IArticle {
  id: number;
  title: string;
  content: string;
  images: string[];
  boardId: number;
  board: IBoard;
  authorId: string;
  author: IUser;
  viewsCount: number;
  likesCount: number;
  likes: ArticleLike[];
  commentsCount: number;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
