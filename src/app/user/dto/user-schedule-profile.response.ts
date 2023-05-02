import { UniversityLectureProfileResponse } from '@app/university/dto/university-lecture-profile.response';
import { UniversityLecture } from '@domain/university/university-lecture.entity';

export class UserScheduleProfileResponse {
  lectures: { [day: string]: UniversityLectureProfileResponse[] } = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
  };

  constructor({ lectures }: { lectures: UniversityLecture[] }) {
    for (const lecture of lectures) {
      const lectureProfile = new UniversityLectureProfileResponse(lecture);
      this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    }
  }
}
