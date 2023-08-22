import { ApiProperty, } from '@nestjs/swagger';
import { UniversityProgramProfileResponseType, } from '@app/university/university.type';

export class UniversityProgramProfileResponse
implements UniversityProgramProfileResponseType {
    @ApiProperty({
    	example: 1,
    	description: '비교과 프로그램 식별자',
    })
    readonly id: number;

    @ApiProperty({
    	example: '비교과 프로그램 제목',
    	description: '비교과 프로그램 제목',
    })
    readonly title: string;

    @ApiProperty({
    	example:
          'https://edu.inje.ac.kr/program/EProgE0011S.aspx?yy=2023&smt=1&code=000000028&dept=03455&no=29&mc=0152',
    	description: '비교과 프로그램 신청 링크',
    })
    readonly url: string;

    @ApiProperty({
    	example: '학생복지처',
    	description: '비교과 프로그램 작성자',
    })
    readonly author: string;

    @ApiProperty({
    	example: '2023-05-14T19:00:00.000Z',
    	description: '비교과 프로그램 신청 마감일',
    })
    readonly endAt: Date;

    constructor({
    	id,
    	title,
    	url,
    	author,
    	endAt,
    }: UniversityProgramProfileResponseType) {
    	this.id = id;
    	this.title = title;
    	this.url = url;
    	this.endAt = endAt;
    	this.author = author;
    }
}
