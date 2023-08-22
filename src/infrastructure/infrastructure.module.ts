import { Module, } from '@nestjs/common';
import { AdminModule, } from '@infrastructure/admin/admin.module';
import { UtilModule, } from '@infrastructure/utils/util.module';

@Module({ imports: [AdminModule, UtilModule,], })
export class InfrastructureModule {
}
