import { UserPreviewResponse, } from '@app/user/dto/user-preview.response';
import { ApiProperty, } from '@nestjs/swagger';
import { ArticlePreviewRequestType, } from '@app/community/article/dto/article.type';
import { UserPreviewResponseType, } from '@app/user/dto/user.type';
import { Pagination, } from '@common/utils/pagination.types';

export class ArticlePreviewResponse implements ArticlePreviewRequestType {
    @ApiProperty({
    	description: '글 id',
    	example: 1,
    })
    readonly id: number;

    @ApiProperty({
    	description: '글 제목',
    	example: '글 제목',
    })
    readonly title: string;

    @ApiProperty({
    	description: '글 내용',
    	example: '글 내용',
    })
    readonly content: string;

    @ApiProperty({
    	description: '글 이미지',
    	example: ['http://example.com/1.png', 'http://example.com/2.png',],
    })
    readonly images: string[];

    @ApiProperty({
    	description: '게시판 id',
    	example: 1,
    })
    readonly boardId: number;

    @ApiProperty({
    	description: '좋아요 수',
    	example: 1,
    })
    readonly likesCount: number;

    @ApiProperty({
    	description: '댓글 수',
    	example: 1,
    })
    readonly commentsCount: number;

    @ApiProperty({
    	description: '작성자 정보',
    	type: UserPreviewResponse,
    	nullable: true,
    })
    readonly author: UserPreviewResponseType | null;

    @ApiProperty({
    	description: '작성자 id',
    	example: '37689d40-fda9-44ae-b578-46f012b59135',
    })
    authorId!: string;

    @ApiProperty({
    	description: '익명 여부',
    	example: false,
    })
    readonly isAnonymous: boolean;

    @ApiProperty({
    	description: '작성일',
    	example: '2023-01-01T00:00:00.000Z',
    })
    readonly createdAt: Date;

    @ApiProperty({
    	description: '학생회 게시글 여부',
    	example: false,
    })
    readonly isCouncil: boolean;

    @ApiProperty()
    readonly majorId?: number;

    constructor(data: Partial<ArticlePreviewRequestType>) {
    	this.author = data.isAnonymous ? null : new UserPreviewResponse(data.author);
    	this.authorId = data.isAnonymous ? '' : data.author.id;
    	this.majorId = data.isCouncil ? null : data.majorId;
    	Object.assign(this, data);
    }
}

export class PagedArticlePreviewResponse extends Pagination(ArticlePreviewResponse) {}
