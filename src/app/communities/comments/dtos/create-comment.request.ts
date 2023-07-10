import { CommentCreateCommand } from '@app/communities/comments/commands/comment-create.command';

export class CreateCommentRequest implements Partial<CommentCreateCommand> {
  content: string;
}
