import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';

@Module({
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
