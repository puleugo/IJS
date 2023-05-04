import { UniversityLectureProfileResponseCommand } from '@app/university/command/university-lecture-profile-response.command';

export type UserScheduleProfileResponseCommand = {
  lectures: { [day: string]: UniversityLectureProfileResponseCommand[] };
};
