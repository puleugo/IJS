import {
	IsNotEmpty, IsOptional, IsString,
} from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';
import { CouncilArticleCreateRequestType, } from '@app/community/article/article.type';

export class CouncilArticleCreateRequest
implements Partial<CouncilArticleCreateRequestType> {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
    	description: '글 제목',
    	default: '글 제목',
    })
    readonly title!: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
    	description: '글 내용',
    	default: '글 내용',
    })
    readonly content: string;

    @IsOptional()
    @IsString({ each: true, })
    @ApiProperty({
    	description: '이미지 url',
    	default: ['https://example.com/1.png',],
    	required: false,
    })
    readonly images?: string[];
}
