import { UserPreviewResponseType, } from '@app/user/dto/user.type';
import { Comment, } from '@app/community/comment/domain/comment.entity';

type AbsCommentProfileResponseType = Pick<
    Comment,
    'id' | 'content' | 'likesCount' | 'articleId' | 'createdAt'
> &
    Partial<Pick<Comment, 'deletedAt'>> & {
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

export type CommentHitLikeRequestType = Pick<Comment, 'id' | 'articleId'> & {
    userId: string;
};

export type CommentDeleteRequestType = Pick<Comment, 'id' | 'articleId'> & {
    userId: string;
};

export type CommentCreateRequestType = Pick<
    Comment,
    'content' | 'authorId' | 'articleId'
> &
    Partial<Pick<Comment, 'replyToId'>> & {
    boardId: number;
};
