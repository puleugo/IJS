import { IComment } from '@domain/communities/comments/comment.interface';

export type CommentDeleteCommand = Pick<IComment, 'id'> & {
  userId: string;
};
