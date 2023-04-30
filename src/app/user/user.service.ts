import { Injectable, NotFoundException } from '@nestjs/common';
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
    @InjectRepository(ScheduleSet)
    private readonly scheduleSetRepository: Repository<ScheduleSet>,
    @InjectRepository(UserScheduleSet)
    private readonly userScheduleSetRepository: Repository<UserScheduleSet>,
    @InjectRepository(UniversityLecture)
    private readonly universityLectureRepository: Repository<UniversityLecture>,
    private readonly dataSource: DataSource,
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
}
