import { Module } from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserController } from '@app/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@domain/user/user.entity';
import { UserAuth } from '@domain/user/user-auth.entity';
import { UserAuthProvider } from '@domain/user/user-auth-vendor.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UniversityLecture } from '@domain/university/university-lecture.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';
import { UserFollow } from '@domain/user/user-follow.entity';
import { UserPhotoClient } from '@app/user/utils/user-photo.client';
import { UserOcrClient } from '@app/user/utils/user-ocr.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserAuth,
      UserAuthProvider,
      UserLecture,
      UserFollow,
      ScheduleSet,
      UserScheduleSet,
      UniversityLecture,
    ]),
  ],
  providers: [UserService, UserPhotoClient, UserOcrClient],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
