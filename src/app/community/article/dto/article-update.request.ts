import { IsOptional, IsString, } from 'class-validator';
import { ApiProperty, } from '@nestjs/swagger';
import { ArticleUpdateRequestType, } from '@app/community/article/article.type';

export class ArticleUpdateRequest implements Partial<ArticleUpdateRequestType> {
    @IsString()
    @IsOptional()
    @ApiProperty({
    	description: '글 제목',
    	example: '글 제목',
    	nullable: true,
    })
    readonly title?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
    	description: '글 내용',
    	example: '글 내용',
    	nullable: true,
    })
    readonly content: string;

    @IsString({ each: true, })
    @IsOptional()
    @ApiProperty({
    	description: '글 이미지',
    	example: ['http://example.com/1.png', 'http://example.com/2.png',],
    	nullable: true,
    })
    readonly images?: string[];
}
