import { Module } from '@nestjs/common';
import { UtilService } from '@infrastructure/utils/util.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UtilService, ConfigService],
  exports: [UtilService],
})
export class UtilModule {}
