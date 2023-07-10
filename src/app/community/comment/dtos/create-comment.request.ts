import { CommentCreateCommand } from '@app/community/comment/commands/comment-create.command';

export class CreateCommentRequest implements Partial<CommentCreateCommand> {
  content: string;
}
