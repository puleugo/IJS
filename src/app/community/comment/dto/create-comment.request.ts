import { ApiProperty, } from '@nestjs/swagger';
import { IsNotEmpty, IsString, } from 'class-validator';
import { CommentCreateRequestType, } from '@app/community/comment/comment.type';

export class CreateCommentRequest implements Partial<CommentCreateRequestType> {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
    	example: '댓글 내용',
    	description: '댓글 내용',
    })
    content: string;
}
