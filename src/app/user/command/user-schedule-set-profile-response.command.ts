import { UniversityLectureProfileResponse } from '@app/university/dto/university-lecture-profile.response';
import { UserScheduleRoleEnum } from '@app/user/command/user-schedule-role.enum';
import { UniversityLecture } from '@domain/university/university-lecture.entity';
import { UserScheduleProfileResponseCommand } from '@app/user/command/user-schedule-profile-response.command';

export type UserScheduleSetProfileResponseCommand = {
  userId: string;
  role: UserScheduleRoleEnum;
} & UserScheduleProfileResponseCommand;
