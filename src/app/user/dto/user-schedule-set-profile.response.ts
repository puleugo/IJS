import { UniversityLectureProfileResponse } from '@app/university/dto/university-lecture-profile.response';
import { UserScheduleRoleEnum } from '@app/user/command/user-schedule-role.enum';
import { UserScheduleSetProfileResponseCommand } from '@app/user/command/user-schedule-set-profile-response.command';
import { IUniversityLecture } from '@domain/university/university-lecture.interface';

export class UserScheduleSetProfileResponse
  implements UserScheduleSetProfileResponseCommand
{
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
    lectures: IUniversityLecture[];
  }) {
    this.userId = userId;
    this.role = role;
    for (const lecture of lectures) {
      const lectureProfile = new UniversityLectureProfileResponse(lecture);
      this.lectures[lecture.weekdayIndex.toString()].push(lectureProfile);
    }
  }
}
