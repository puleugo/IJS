import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OauthLoginProviderEnum } from '@app/auth/authentication/command/oauth-login-provider.enum';
import { DataSource, Repository } from 'typeorm';
import { User } from '@domain/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAuth } from '@domain/user/user-auth.entity';
import { UserAuthProvider } from '@domain/user/user-auth-vendor.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { UniversityLecture } from '@domain/university/university-lecture.entity';
import { UserLecture } from '@domain/user/user-lecture.entity';
import * as QRCode from 'qrcode';
import { UserScheduleRoleEnum } from '@app/user/command/user-schedule-role.enum';
import { UserFollow } from '@domain/user/user-follow.entity';
import { UserPhotoClient } from '@app/user/utils/user-photo.client';
import { UserOcrClient } from '@app/user/utils/user-ocr.client';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { UserUnauthenticated } from '@domain/error/user.error';
import { ScheduleSetProfileResponse } from '@app/user/dto/schedule-set-profile.response';
import { ScheduleSetProfileResponseCommand } from '@app/user/command/schedule-set-profile-response.command';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserAuth)
    private readonly userAuthRepository: Repository<UserAuth>,
    @InjectRepository(UserLecture)
    private readonly userLectureRepository: Repository<UserLecture>,
    @InjectRepository(UserAuthProvider)
    private readonly userAuthProviderRepository: Repository<UserAuthProvider>,
    @InjectRepository(UserFollow)
    private readonly userFollowRepository: Repository<UserFollow>,
    @InjectRepository(ScheduleSet)
    private readonly scheduleSetRepository: Repository<ScheduleSet>,
    @InjectRepository(UserScheduleSet)
    private readonly userScheduleSetRepository: Repository<UserScheduleSet>,
    @InjectRepository(UniversityLecture)
    private readonly universityLectureRepository: Repository<UniversityLecture>,
    private readonly dataSource: DataSource,
    private readonly photoClient: UserPhotoClient,
    private readonly ocrClient: UserOcrClient,
  ) {}

  async joinUserByOauth(data: {
    providerUsername: string;
    providerName: OauthLoginProviderEnum;
  }): Promise<User> {
    const userAuthProvider = await this.userAuthProviderRepository.findOne({
      where: {
        name: data.providerName,
      },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.save({});

      const userAuth = new UserAuth();
      userAuth.provider = userAuthProvider;
      userAuth.providerId = userAuthProvider.id;
      userAuth.username = data.providerUsername;
      userAuth.user = user;
      userAuth.userId = user.id;

      await this.userAuthRepository.save(userAuth);
      await queryRunner.commitTransaction();
      return user;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException('회원가입 실패');
    }
  }

  async findUserByOauthId(data: {
    code: string;
    provider: OauthLoginProviderEnum;
  }): Promise<User> {
    const authProvider = await this.userAuthProviderRepository.findOne({
      where: {
        name: data.provider,
      },
    });
    if (!authProvider) throw new NotFoundException('authProvider not found');

    const userAuth = await this.userAuthRepository.findOne({
      where: {
        username: data.code,
        providerId: authProvider.id,
      },
    });
    return userAuth ? userAuth.user : null;
  }

  async openScheduleSet(
    userId: string,
  ): Promise<ScheduleSetProfileResponseCommand> {
    const owner = await this.findUserById(userId);
    const userScheduleSet = new UserScheduleSet();
    userScheduleSet.user = owner;
    userScheduleSet.scheduleSet = new ScheduleSet();
    userScheduleSet.scheduleSet.owner = owner;

    const scheduleSet = await this.userScheduleSetRepository.save(
      userScheduleSet,
    );
    const qrUrl = await this.generateQrCodeByScheduleSetId(
      scheduleSet.scheduleSetId,
    );
    return { scheduleSetId: scheduleSet.scheduleSetId, qrUrl };
  }

  async joinScheduleSet(
    userId: string,
    scheduleSetId: string,
  ): Promise<ScheduleSet> {
    const user = await this.findUserById(userId);
    const scheduleSet = await this.findScheduleSetById(scheduleSetId);
    await this.userScheduleSetRepository.save({
      user,
      scheduleSet,
    });

    await Promise.all([
      this.followUser(user.id, scheduleSet.owner.id),
      this.followUser(scheduleSet.owner.id, user.id),
    ]);

    return scheduleSet;
  }

  // TODO: 팔로우 기능 구현
  async followUser(myId: string, userId: string): Promise<void> {
    const user = await this.findUserById(myId);
    if (!user) throw new NotFoundException('user not found');

    const toFollowUser = await this.findUserById(userId);
    if (!toFollowUser) throw new NotFoundException('user not found');

    await this.userFollowRepository.save({
      userId: user.id,
      toFollowId: toFollowUser.id,
    });
  }

  async findUserById(
    id: string,
    options?: FindOneOptions<User>,
  ): Promise<User> {
    console.log(id, typeof id, options, typeof options.relations);
    const user = await this.userRepository.findOne({
      where: { id },
      ...options,
    });
    console.log(user);
    return user;
  }

  async findScheduleSetById(id: string): Promise<ScheduleSet> {
    return await this.scheduleSetRepository.findOne({ where: { id } });
  }

  async getScheduleSet(userId: string): Promise<UserScheduleSet[]> {
    return await this.userScheduleSetRepository.find({
      where: { user: { id: userId } },
    });
  }

  async kickUserInScheduleSet(
    ownerId: string,
    userId: string,
    scheduleSetId: string,
  ): Promise<void> {
    const scheduleSet = await this.userScheduleSetRepository.find({
      where: {
        scheduleSetId: scheduleSetId,
        scheduleSet: { owner: { id: ownerId } },
      },
    });
    if (!scheduleSet) throw new NotFoundException('scheduleSet not found');

    if (scheduleSet.filter((user) => user.user.id === userId).length === 0)
      throw new NotFoundException('user not found');

    await this.userScheduleSetRepository.delete({
      userId,
      scheduleSetId,
    });
  }

  async getScheduleSetInfo(id: string): Promise<
    {
      userId: string;
      role: UserScheduleRoleEnum;
      lectures: UniversityLecture[];
    }[]
  > {
    const userScheduleSets = await this.userScheduleSetRepository.find({
      where: { scheduleSetId: id },
      relations: [
        'user',
        'user.lectures',
        'user.lectures.lecture',
        'scheduleSet',
        'scheduleSet.owner',
      ],
    });
    const scheduleSet: {
      userId: string;
      role: UserScheduleRoleEnum;
      lectures: UniversityLecture[];
    }[] = userScheduleSets.map((scheduleSet) => {
      const role =
        scheduleSet.user.id === scheduleSet.scheduleSet.owner.id
          ? UserScheduleRoleEnum.ADMIN
          : UserScheduleRoleEnum.USER;
      return {
        userId: scheduleSet.userId,
        role,
        lectures: scheduleSet.user.lectures.map((lecture) => lecture.lecture),
      };
    });

    return scheduleSet.sort((a, b) => {
      if (a.role < b.role) return -1;
      if (a.role > b.role) return 1;
      return 0;
    });
  }

  async updateUniversitySchedule(
    userId: string,
    lectureIds?: number[],
    photo?: Buffer,
  ): Promise<UniversityLecture[]> {
    if (!lectureIds && !photo) throw new BadRequestException();
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['lectures', 'lectures.lecture'],
    });

    if (photo)
      return await this.updateUniversityScheduleByPhoto(user.id, photo);
    else if (lectureIds)
      return await this.updateUniversityScheduleByLectureIds(
        user.id,
        lectureIds,
      );
  }

  async getFollowersByUserId(myId: string): Promise<User[]> {
    const follows = await this.userFollowRepository.find({
      where: { toFollowId: myId },
      relations: ['toFollow'],
    });
    return follows.map((follow) => follow.toFollow);
  }

  async getFollowingByUserId(myId: string): Promise<User[]> {
    const follows = await this.userFollowRepository.find({
      where: { userId: myId },
      relations: ['user'],
    });
    return follows.map((follow) => follow.user);
  }

  async getStudentQRCode(studentId: string): Promise<string> {
    if (!studentId) throw new UserUnauthenticated();
    return QRCode.toDataURL(`AA${studentId}`);
  }

  async unfollowUser(myId: string, userId: string): Promise<void> {
    await this.userFollowRepository.delete({
      userId: myId,
      toFollowId: userId,
    });
  }

  private async generateQrCodeByScheduleSetId(setId: string): Promise<string> {
    return QRCode.toDataURL(setId);
  }

  // TODO: OCR 기능 구현
  private async updateUniversityScheduleByPhoto(
    userId: string,
    photo: Buffer,
  ): Promise<UniversityLecture[]> {
    const resizedPhoto = await this.photoClient.resizePhoto(photo);
    const ocrLectures = await this.ocrClient.getScheduleFromPhoto(resizedPhoto);

    return [];
  }

  private async updateUniversityScheduleByLectureIds(
    userId: string,
    lectureIds: number[],
  ): Promise<UniversityLecture[]> {
    await this.userLectureRepository.delete({ userId });
    lectureIds.map(
      async (lectureId) =>
        await this.userLectureRepository.save({ userId, lectureId }),
    );
    const lectures = await this.userLectureRepository.find({
      where: { userId },
    });
    return lectures.map((lecture) => lecture.lecture);
  }
}
