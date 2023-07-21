import { IComment } from '@domain/communities/comments/comment.interface';

export type CommentCreateCommand = Pick<
  IComment,
  'content' | 'authorId' | 'articleId'
> &
  Partial<Pick<IComment, 'replyToId'>> & {
    boardId: number;
  };
