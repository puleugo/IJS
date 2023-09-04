import { User, } from '@app/user/domain/user.entity';
import { Article, } from '@app/community/article/domain/article.entity';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { UniversityNotice, } from '@app/university/domain/university-notice.entity';
import { UniversityMeal, } from '@app/university/domain/university-meal.entity';
import { CustomDecorator, SetMetadata, } from '@nestjs/common';
import { Board, } from '@app/community/board/domain/board.entity';

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
export const ExistRole = (...roles: RoleEnum[]): CustomDecorator => {
	return SetMetadata(ROLES_KEY, roles);
};
