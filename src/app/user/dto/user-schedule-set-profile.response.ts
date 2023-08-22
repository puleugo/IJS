import { UniversityLectureProfileResponse, } from '@app/university/dto/university-lecture-profile.response';
import { UserScheduleRoleEnum, } from '@app/user/user-schedule-role.enum';
import { IUniversityLecture, } from '@domain/university/university-lecture.interface';
import { ApiProperty, } from '@nestjs/swagger';
import { UserScheduleSetProfileResponseType, } from '../user.type';

export class UserScheduleSetProfileResponse
implements UserScheduleSetProfileResponseType {
    @ApiProperty({
    	description: '사용자 ID',
    	example: '41c7ffb8-399c-440f-925d-1869ee77d3c0',
    })
    readonly userId: string;

    @ApiProperty({
    	description: '사용자 역할',
    	example: UserScheduleRoleEnum.USER,
    })
    readonly role: UserScheduleRoleEnum;

    @ApiProperty({
    	description: '시간표 집합의 ID를 가져옵니다.',
    	example: '1234',
    })
    readonly lectures: { [day: string]: UniversityLectureProfileResponse[] } = {
    	0: [],
    	1: [],
    	2: [],
    	3: [],
    	4: [],
    };

    constructor({
    	userId,
    	role,
    	lectures,
    }: {
        userId: string;
        role: UserScheduleRoleEnum;
        lectures: IUniversityLecture[];
    }) {
    	this.userId = userId;
    	this.role = role;
    	for (const lecture of lectures) {
    		const lectureProfile = new UniversityLectureProfileResponse(
    			lecture
    		);
    		this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    	}
    }
}
