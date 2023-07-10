import { IComment } from '@domain/communities/comments/comment.interface';

export type CommentResponseCommand = Pick<
  IComment,
  'id' | 'content' | 'likesCount' | 'replyToId' | 'replies' | 'createdAt'
> & { isArticleAuthor: boolean; isAnonymous: boolean };
