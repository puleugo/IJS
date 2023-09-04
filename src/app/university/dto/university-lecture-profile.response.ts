import { ApiProperty, } from '@nestjs/swagger';
import { UniversityLectureProfileResponseType, } from '@app/university/dto/university.type';

export class UniversityLectureProfileResponse
implements UniversityLectureProfileResponseType {
    @ApiProperty({
    	example: 1,
    	description: '강의 식별자',
    })
    readonly id: number;

    @ApiProperty({
    	example: 'C++프로그래밍',
    	description: '강의명',
    })
    readonly title: string;

    @ApiProperty({
    	example: 4,
    	description: '강의 시작 교시',
    	minimum: 0,
    	maximum: 9,
    })
    readonly startAt: number;

    @ApiProperty({
    	example: 9,
    	description: '강의 종료 교시',
    	minimum: 0,
    	maximum: 9,
    })
    readonly endAt: number;

    constructor({
    	id,
    	title,
    	startAt,
    	endAt,
    }: UniversityLectureProfileResponseType) {
    	this.id = id;
    	this.title = title;
    	this.startAt = startAt;
    	this.endAt = endAt;
    }
}
