import { UniversityLectureProfileResponse, } from '@app/university/dto/university-lecture-profile.response';
import { UserScheduleProfileResponseType, } from './user.type';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';

export class UserScheduleProfileResponse
implements UserScheduleProfileResponseType {
    readonly lectures: { [day: string]: UniversityLectureProfileResponse[] } = {
    	0: [],
    	1: [],
    	2: [],
    	3: [],
    	4: [],
    };

    constructor(lectures: UniversityLecture[]) {
    	for (const lecture of lectures) {
    		const lectureProfile = new UniversityLectureProfileResponse(
    			lecture
    		);
    		this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    	}
    }
}
