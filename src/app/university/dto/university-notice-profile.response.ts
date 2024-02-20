import { ApiProperty, } from '@nestjs/swagger';
import { UniversityNoticeProfileResponseType, } from '@app/university/dto/university.type';

export class UniversityNoticeProfileResponse
implements UniversityNoticeProfileResponseType {
    @ApiProperty({
    	description: '공지 게시글 ID',
    	example: 1,
    })
    readonly id: number;

    @ApiProperty({
    	description: '공지 게시글 제목',
    	example: '2023년도 학사 일정',
    })
    readonly title: string;

    @ApiProperty({
    	description: '공지 게시글 내용',
    	example: '2023년도 학사 일정입니다.',
    })
    readonly content: string;

    @ApiProperty({
    	description: '공지 게시글 URL',
    	example: 'https://www.kw.ac.kr/ko/life/notice.jsp?BoardMode=view&DUID=',
    })
    readonly url: string;

    @ApiProperty({
    	description: '공지 게시글 작성자',
    	example: '김대표',
    })
    readonly files: string[];

    @ApiProperty({
    	description: '공지 게시글 조회수',
    	example: 100,
    })
    readonly viewsCount: number;

    @ApiProperty({
    	description: '공지 게시글 작성 일',
    	example: 1,
    })
    readonly majorId: number;

    @ApiProperty({
    	description: '학과명',
    	example: '컴퓨터공학과',
    })
    readonly majorName: string;

    @ApiProperty({
    	description: '공지 작성 일',
    	example: new Date(),
    })
    readonly wroteAt: Date;

    constructor(data: UniversityNoticeProfileResponseType) {
    	this.id = data.id;
    	this.title = data.title;
    	this.content = data.content;
    	this.majorId = data.majorId;
    	this.majorName = data.majorName;
    	this.url = data.url;
    	this.files = data.files;
    	this.viewsCount = data.viewsCount;
    	this.wroteAt = data.wroteAt;
    }
}
