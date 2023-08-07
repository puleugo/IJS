import { User } from '@domain/user/user.entity';
import { Board } from '@domain/communities/boards/board.entity';
import { Article } from '@domain/communities/articles/article.entity';
import { Comment } from '@domain/communities/comments/comment.entity';
import { UniversityNotice } from '@domain/university/university-notice.entity';
import { UniversityMeal } from '@domain/university/university-meal.entity';
import { SetMetadata } from '@nestjs/common';

export enum RoleEnum {
  USER = 'user',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

const domains = [
  User,
  Board,
  Article,
  Comment,
  UniversityNotice,
  UniversityMeal,
] as const;

export const ROLES_KEY = 'roles';

// 존재해야하는 RoleEnum List 입니다.
export const ExistRole = (...roles: RoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
