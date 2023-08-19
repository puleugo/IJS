import { UserAuth } from './user-auth.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';
import { UniversityMajor } from '@domain/university/university-major.entity';
import { IArticle } from '@domain/communities/articles/article.interface';
import { CommentLike } from '@domain/communities/comments/comment-like.entity';
import { IComment } from '@domain/communities/comments/comment.interface';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { RoleEnum } from '@app/auth/authorization/types';
import { IUserSetting } from '@domain/user/user-setting.interface';

export interface IUser {
  id: string;
  isVerified: boolean;
  name: string | null;
  majorId: number | null;
  major: UniversityMajor;
  schoolId: string | null;
  schoolEmail: string | null;
  role: RoleEnum[];
  auth: UserAuth[];
  userScheduleSets: UserScheduleSet[];
  createdScheduleSets: ScheduleSet[];
  lectures: UserLecture[];
  articles: IArticle[];
  articleLikes: ArticleLike[];
  comments: IComment[];
  settings: IUserSetting;
  commentLikes: CommentLike[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
