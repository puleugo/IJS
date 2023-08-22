import {
	IsBoolean, IsNotEmpty, IsString,
} from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';
import { BoardUpdateRequestType, } from '@app/community/board/board.type';

export class BoardUpdateRequest implements Partial<BoardUpdateRequestType> {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
    	description: '게시판 이름',
    	example: '학생회 게시판',
    })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
    	description: '게시판 설명',
    	example: '학생회 게시판입니다.',
    })
    readonly description: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
    	description: '익명 여부',
    	example: true,
    })
    readonly isAnonymous: boolean;
}
