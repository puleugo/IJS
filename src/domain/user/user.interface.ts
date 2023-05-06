import { UserAuth } from './user-auth.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';
import { UniversityMajor } from '@domain/university/university-major.entity';

export interface IUser {
  id: string;
  majorId: number | null;
  major: UniversityMajor;
  schoolId: string | null;
  schoolEmail: string | null;
  auth: UserAuth[];
  userScheduleSets: UserScheduleSet[];
  createdScheduleSets: ScheduleSet[];
  lectures: UserLecture[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
