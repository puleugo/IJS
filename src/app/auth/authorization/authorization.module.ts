import { Module, } from '@nestjs/common';
import { RolesGuard, } from '@app/auth/authorization/roles.guard';

@Module({
	providers: [RolesGuard,],
	exports: [RolesGuard,],
})
export class AuthorizationModule {
}
