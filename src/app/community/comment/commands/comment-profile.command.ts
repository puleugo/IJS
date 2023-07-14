import { IComment } from '@domain/communities/comments/comment.interface';
import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';

type AbsCommentProfileResponse = Pick<
  IComment,
  'id' | 'content' | 'likesCount' | 'articleId' | 'createdAt'
> &
  Partial<Pick<IComment, 'deletedAt'>> & {
    isArticleAuthor: boolean;
    replyToId: number | null;
    authorId: string | null;
    author: UserPreviewResponseCommand | null;
    isAnonymous: boolean;
  };

export type CommentProfileCommand = AbsCommentProfileResponse & {
  replies: ReplyCommentProfileCommand[];
};

export type ReplyCommentProfileCommand = AbsCommentProfileResponse & {
  replies: null;
};
