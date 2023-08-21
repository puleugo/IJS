import { IComment } from '@domain/communities/comments/comment.interface';
import { UserPreviewResponseType } from '@app/user/user.type';

type AbsCommentProfileResponseType = Pick<
  IComment,
  'id' | 'content' | 'likesCount' | 'articleId' | 'createdAt'
> &
  Partial<Pick<IComment, 'deletedAt'>> & {
    isArticleAuthor: boolean;
    replyToId: number | null;
    authorId: string | null;
    author: UserPreviewResponseType | null;
    isAnonymous: boolean;
  };

export type CommentProfileResponseType = AbsCommentProfileResponseType & {
  replies: ReplyCommentProfileResponseType[];
};

export type ReplyCommentProfileResponseType = AbsCommentProfileResponseType & {
  replies: null;
};
export type CommentListQuery = {
  boardId: number;
  articleId: number;
};

export type CommentHitLikeRequestType = Pick<IComment, 'id' | 'articleId'> & {
  userId: string;
};

export type CommentDeleteRequestType = Pick<IComment, 'id' | 'articleId'> & {
  userId: string;
};

export type CommentCreateRequestType = Pick<
  IComment,
  'content' | 'authorId' | 'articleId'
> &
  Partial<Pick<IComment, 'replyToId'>> & {
    boardId: number;
  };
