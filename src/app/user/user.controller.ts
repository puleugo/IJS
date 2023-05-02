import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '@app/user/user.service';
import { UserScheduleSetPreviewResponse } from '@app/user/dto/user-schedule-set-preview.response';
import { UserScheduleSetProfileResponse } from '@app/user/dto/user-schedule-set-profile.response';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  FileFastifyInterceptor,
  memoryStorage,
} from 'fastify-file-interceptor';
import { UserPreviewResponse } from '@app/user/dto/user-preview.response';
import { UserScheduleProfileResponse } from '@app/user/dto/user-schedule-profile.response';

// TODO 구현
@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '모바일 학생증을 발급합니다.' })
  @Get('student-qr')
  async getStudentQRCode(): Promise<string> {
    return await this.userService.getStudentQRCode('20230000');
  }

  @ApiOperation({ summary: '입장해있는 시간표 집합의 목록을 조회합니다.' })
  @Get('schedule-sets')
  async getScheduleSets(): Promise<UserScheduleSetPreviewResponse[]> {
    const scheduleSets = await this.userService.getScheduleSet('userId');
    return scheduleSets.map(
      (scheduleSet) => new UserScheduleSetPreviewResponse(scheduleSet),
    );
  }

  @ApiOperation({ summary: '특정 시간표 집합의 정보를 조회합니다.' })
  @Get('schedule-sets/:scheduleSetId')
  async getScheduleSetInfo(
    @Param('scheduleSetId', ParseUUIDPipe) scheduleSetId: string,
  ): Promise<UserScheduleSetProfileResponse[]> {
    const scheduleSet = await this.userService.getScheduleSetInfo(
      scheduleSetId,
    );
    return scheduleSet.map(
      (schedule) => new UserScheduleSetProfileResponse(schedule),
    );
  }

  @ApiOperation({ summary: '시간표 집합을 생성합니다.' })
  @Post('schedule-sets')
  async openScheduleSet(): Promise<{ scheduleSetId: string; qrUrl: string }> {
    return await this.userService.openScheduleSet('userId');
  }

  @ApiOperation({ summary: '특정 시간표 집합에 입장합니다.' })
  @Post('schedule-sets/:scheduleSetId')
  async joinScheduleSet(
    @Param('scheduleSetId') scheduleSetId: string,
  ): Promise<{ scheduleSetId: string }> {
    const scheduleSet = await this.userService.joinScheduleSet(
      'userId',
      scheduleSetId,
    );
    return { scheduleSetId: scheduleSet.id };
    // QR 스캔
    // 스케쥴 세트에 유저 추가
    // 스케쥴을 연 유저를 자동으로 맞팔로우 처리
  }

  @ApiOperation({ summary: '특정 시간표 집합에서 특정 유저를 강퇴합니다.' })
  @Delete('schedule-sets/:scheduleSetId/kick/:userId')
  async kickUserInScheduleSet(
    @Param('scheduleSetId', ParseUUIDPipe) scheduleSetId: string,
  ): Promise<{ message: string }> {
    await this.userService.kickUserInScheduleSet(
      'ownerId',
      'userId',
      scheduleSetId,
    );
    return {
      message: 'success',
    };
  }

  @ApiOperation({ summary: '특정 시간표 집합에 입장합니다.' })
  @Put('schedules')
  @UseInterceptors(FileFastifyInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  async updateUniversitySchedule(
    @Body() data?: { lectureIds: number[] },
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UserScheduleProfileResponse> {
    const lectures = await this.userService.updateUniversitySchedule(
      'userId',
      data.lectureIds,
      file.buffer,
    );
    return new UserScheduleProfileResponse({ lectures });
    // 수동으로 시간표를 추가한다.
  }

  @ApiOperation({ summary: '특정 유저를 팔로우합니다.' })
  @Post('follow/:userId')
  async followUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ message: string }> {
    await this.userService.followUser(
      '05baec8b-1fed-4255-a008-bf2d6f9d93ff',
      userId,
    );
    return {
      message: 'success',
    };
    // 유저를 팔로우한다.
    // 팔로우한 유저의 시간표를 볼 수 있다.
  }

  @ApiOperation({ summary: '팔로우 중인 유저를 언팔로우합니다.' })
  @Delete('unfollow/:userId')
  async unfollowUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<{ message: string }> {
    await this.userService.unfollowUser(
      '05baec8b-1fed-4255-a008-bf2d6f9d93ff',
      userId,
    );
    return {
      message: 'success',
    };
  }

  @ApiOperation({ summary: '특정 유저를 팔로우하는 유저 목록을 조회합니다.' })
  @Get(':userId/followers')
  async getFollowersByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserPreviewResponse[]> {
    const users = await this.userService.getFollowersByUserId(userId);
    return users.map((user) => new UserPreviewResponse(user));
    // 특정 유저를 팔로우하는 유저 목록을 조회합니다.
  }

  @ApiOperation({ summary: '특정 유저가 팔로우하는 유저 목록을 조회합니다.' })
  @Get(':userId/following')
  async getFollowingByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserPreviewResponse[]> {
    const users = await this.userService.getFollowingByUserId(userId);
    return users.map((user) => new UserPreviewResponse(user));
    // 나를 팔로우한 유저 목록을 조회합니다.
  }
}
