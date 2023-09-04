import { Module, } from '@nestjs/common';
import { AdminModule, } from '@common/admin/admin.module';
import { UtilModule, } from '@common/utils/util.module';

@Module({ imports: [AdminModule, UtilModule,], })
export class CommonModule {
}
