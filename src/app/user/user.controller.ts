import { Controller, Get, Post } from '@nestjs/common';

// TODO 구현
@Controller('users')
export class UserController {
  @Post()
  async openScheduleSet() {
    // QR 반환
    // 스케쥴에 유저가 들어온다면 자동으로 맞팔로우 처리
  }

  @Post()
  async joinScheduleSet() {
    // QR 스캔
    // 스케쥴 세트에 유저 추가
    // 스케쥴을 연 유저를 자동으로 맞팔로우 처리
  }

  @Post()
  async closeScheduleSet() {
    // schedule set을 종료하고, QR을 더이상 사용할 수 없게 한다.
    // schedule set에 등록된 모든 유저에게 시간표 집합 정보를 보낸다.
  }

  @Post()
  async addUniversitySchedule() {
    // 수동으로 시간표를 추가한다.
  }

  @Post()
  async addUniversityScheduleByImage() {
    // 이미지로 시간표를 추가한다.
  }

  @Post()
  async verifySchoolEmail() {
    // 학교 이메일을 인증한다.
  }

  @Post()
  async verifyMajor() {
    // 학과를 인증한다.
  }

  @Post()
  async followUser() {
    // 유저를 팔로우한다.
    // 팔로우한 유저의 시간표를 볼 수 있다.
  }

  @Get()
  async getUserFollowingMe() {
    // 유저를 팔로우한다.
    // 팔로우한 유저의 시간표를 볼 수 있다.
  }

  @Get()
  async getUsersIFollowing() {
    // 유저를 팔로우한다.
    // 팔로우한 유저의 시간표를 볼 수 있다.
  }
}
