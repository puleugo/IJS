import { ApiProperty, } from '@nestjs/swagger';
import { UniversityMajorProfileResponseType, } from '@app/university/dto/university.type';

export class UniversityMajorProfileResponse
implements UniversityMajorProfileResponseType {
    @ApiProperty({
    	example: 1,
    	description: '학과 식별자',
    })
    readonly id: number;

    @ApiProperty({
    	example: '컴퓨터공학과',
    	description: '학과명',
    })
    readonly name: string;

    constructor({ id, name, }: UniversityMajorProfileResponseType) {
    	this.id = id;
    	this.name = name;
    }
}
