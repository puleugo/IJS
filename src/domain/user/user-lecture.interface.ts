import { User, } from '@domain/user/user.entity';
import { UniversityLecture, } from '@domain/university/university-lecture.entity';

export interface IUserLecture {
  id: number;
  userId: string;
  lectureId: number;
  user: User;
  lecture: UniversityLecture;
}
