import { UniversityLectureProfileResponse } from '@app/university/dto/university-lecture-profile.response';
import { UserScheduleRoleEnum } from '@app/user/command/user-schedule-role.enum';
import { UniversityLecture } from '@domain/university/university-lecture.entity';

export class UserScheduleSetProfileResponse {
  userId: string;
  role: UserScheduleRoleEnum;
  lectures: { [day: string]: UniversityLectureProfileResponse[] } = {
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
    lectures: UniversityLecture[];
  }) {
    this.userId = userId;
    this.role = role;
    for (const lecture of lectures) {
      const lectureProfile = new UniversityLectureProfileResponse(lecture);
      this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    }
  }
}
