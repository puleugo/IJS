import { CommentCreateCommand } from '@app/community/comment/commands/comment-create.command';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentRequest implements Partial<CommentCreateCommand> {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '댓글 내용',
    description: '댓글 내용',
  })
  content: string;
}
