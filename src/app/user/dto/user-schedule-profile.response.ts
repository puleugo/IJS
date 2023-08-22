import { UniversityLectureProfileResponse, } from '@app/university/dto/university-lecture-profile.response';
import { IUniversityLecture, } from '@domain/university/university-lecture.interface';
import { UserScheduleProfileResponseType, } from '../user.type';

export class UserScheduleProfileResponse
implements UserScheduleProfileResponseType {
    readonly lectures: { [day: string]: UniversityLectureProfileResponse[] } = {
    	0: [],
    	1: [],
    	2: [],
    	3: [],
    	4: [],
    };

    constructor(lectures: IUniversityLecture[]) {
    	for (const lecture of lectures) {
    		const lectureProfile = new UniversityLectureProfileResponse(
    			lecture
    		);
    		this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    	}
    }
}
