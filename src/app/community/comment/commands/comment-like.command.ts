import { IComment } from '@domain/communities/comments/comment.interface';

export type CommentLikeCommand = Pick<IComment, 'id' | 'articleId'> & {
  userId: string;
};
