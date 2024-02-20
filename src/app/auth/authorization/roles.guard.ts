import {
	CanActivate, ExecutionContext, ForbiddenException, Injectable,
} from '@nestjs/common';
import { Reflector, } from '@nestjs/core';
import { RoleEnum, ROLES_KEY, } from '@app/auth/authorization/type';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
			ROLES_KEY, [context.getHandler(), context.getClass(),]
		);
		if (!requiredRoles) {
			return true;
		}
		const { user, } = context.switchToHttp().getRequest();

		if (!user) {
			throw new ForbiddenException('유저 정보가 존재하지 않습니다.');
		}

		return requiredRoles.some((role) => {
			return user.roles?.includes(role);
		});
	}
}
