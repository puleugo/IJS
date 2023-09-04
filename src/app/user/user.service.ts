import {
	BadRequestException, Inject, Injectable, NotFoundException,
} from '@nestjs/common';
import { OauthLoginProviderEnum, } from '@app/auth/authentication/oauth-login-provider.enum';
import { Repository, } from 'typeorm';
import { User, } from '@app/user/domain/user.entity';
import { InjectRepository, } from '@nestjs/typeorm';
import { UserAuth, } from '@app/user/domain/user-auth.entity';
import { UserAuthProvider, } from '@app/user/domain/user-auth-provider.entity';
import { ScheduleSet, } from '@app/user/domain/schedule-set.entity';
import { UserScheduleSet, } from '@app/user/domain/user-schedule-set.entity';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';
import { UserLecture, } from '@app/user/domain/user-lecture.entity';
import * as QRCode from 'qrcode';
import { UserScheduleRoleEnum, } from '@app/user/domain/user-schedule-role.enum';
import { UserFollow, } from '@app/user/domain/user-follow.entity';
import { UserOcrClient, } from '@app/user/utils/user-ocr.client';
import { FindOneOptions, } from 'typeorm/find-options/FindOneOptions';
import { PhotoClient, } from '@common/type/photo.client';
import { JwtService, } from '@nestjs/jwt';
import { USER_QR_CODE_EXPIRE, } from '@common/type/contants';
import { UserSetting, } from '@app/user/domain/user-setting.entity';
import { UserNotFoundException, } from '@app/user/exception/user.error';
import { ScheduleSetProfileResponseType, UserUpdateSettingRequestType, } from '@app/user/dto/user.type';

@Injectable()
export class UserService {
	constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserSetting)
        private readonly userSettingRepository: Repository<UserSetting>,
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
        @Inject('UserPhotoClient')
        private readonly userPhotoClient: PhotoClient,
        private readonly userOcrClient: UserOcrClient,
        private readonly jwtService: JwtService,
	) {}

	async joinUserByOauth(data: {
        vendorUserId: string;
        providerType: OauthLoginProviderEnum;
    }): Promise<User> {
		const userAuthProvider = await this.userAuthProviderRepository.findOne({ where: { name: data.providerType, }, });
		if (!userAuthProvider)
			throw new NotFoundException('존재하지 않는 OAUTH 로그인 방식입니다.');

		const user = await this.userRepository.save({});
		const [userAuth, userSetting,]= await Promise.all([
			this.userAuthRepository.save({
				provider: userAuthProvider,
				providerId: userAuthProvider.id,
				username: data.vendorUserId,
				user: user,
				userId: user.id,
			}),
			this.userSettingRepository.save({ userId: user.id, }),
		]);
		await this.userRepository.update({ id: user.id, }, { settings: userSetting, });

		return user;
	}

	async findUserByOauthId(
		code: string,
		provider: OauthLoginProviderEnum,
	): Promise<User> {
		const authProvider = await this.userAuthProviderRepository.findOne({ where: { name: provider.toString(), }, });
		if (!authProvider) throw new NotFoundException('authProvider not found');

		const userAuth = await this.userAuthRepository.findOne({
			where: {
				username: code,
				provider: { id: authProvider.id, },
			},
			relations: { user: true, },
		});

		return userAuth ? userAuth.user : null;
	}

	async openScheduleSet(
		userId: string
	): Promise<ScheduleSetProfileResponseType> {
		const owner = await this.findById(userId);
		const userScheduleSet = new UserScheduleSet();
		userScheduleSet.user = owner;
		userScheduleSet.scheduleSet = new ScheduleSet();
		userScheduleSet.scheduleSet.owner = owner;

		const scheduleSet = await this.userScheduleSetRepository.save(
			userScheduleSet
		);
		const qrUrl = await this.generateQrCodeByScheduleSetId(
			scheduleSet.scheduleSetId
		);

		return {
			scheduleSetId: scheduleSet.scheduleSetId,
			qrUrl,
		};
	}

	async joinScheduleSet(
		userId: string,
		scheduleSetId: string
	): Promise<ScheduleSet> {
		const user = await this.findById(userId);
		const scheduleSet = await this.findScheduleSetById(scheduleSetId);
		await this.userScheduleSetRepository.save({
			user,
			scheduleSet,
		});

		await Promise.all([
			this.followUser(user.id, scheduleSet.owner.id), this.followUser(scheduleSet.owner.id, user.id),
		]);

		return scheduleSet;
	}

	// TODO: 팔로우 기능 구현
	async followUser(myId: string, userId: string): Promise<void> {
		const user = await this.findById(myId);
		if (!user) throw new NotFoundException('user not found');

		const toFollowUser = await this.findById(userId);
		if (!toFollowUser) throw new NotFoundException('user not found');

		await this.userFollowRepository.save({
			userId: user.id,
			toFollowId: toFollowUser.id,
		});
	}

	async findById(id: string, options?: FindOneOptions<User>): Promise<User> {
		return await this.userRepository.findOne({
			where: { id, },
			...options,
		});
	}

	async findScheduleSetById(id: string): Promise<ScheduleSet> {
		return await this.scheduleSetRepository.findOne({ where: { id, }, });
	}

	async getScheduleSet(userId: string): Promise<UserScheduleSet[]> {
		return await this.userScheduleSetRepository.find({ where: { user: { id: userId, }, }, });
	}

	async kickUserInScheduleSet(
		ownerId: string,
		userId: string,
		scheduleSetId: string
	): Promise<void> {
		const scheduleSet = await this.userScheduleSetRepository.find({
			where: {
				scheduleSetId: scheduleSetId,
				scheduleSet: { owner: { id: ownerId, }, },
			},
		});
		if (!scheduleSet) throw new NotFoundException('scheduleSet not found');

		if (
			scheduleSet.filter((user) => {
				return user.user.id === userId;
			}).length === 0
		)
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
			where: { scheduleSetId: id, },
			relations: {
				user: { lectures: { lecture: true, }, },
				scheduleSet: { owner: true, },
			},
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
        		lectures: scheduleSet.user.lectures.map((lecture) => {
        			return lecture.lecture;
        		}),
        	};
        });

		return scheduleSet.sort((a, b) => {
			if (a.role < b.role) return -1;
			if (a.role > b.role) return 1;

			return 0;
		});
	}

	async updateUniversitySchedule(
		id: string,
		lectureIds?: number[],
		photo?: Buffer
	): Promise<UniversityLecture[]> {
		if (!lectureIds && !photo) throw new BadRequestException();
		const user = await this.userRepository.findOne({
			where: { id, },
			relations: { lectures: { lecture: true, }, },
		});

		if (photo) return await this.updateUniversityScheduleByPhoto(user.id, photo);
		else if (lectureIds) return await this.updateUniversityScheduleByLectureIds(user.id, lectureIds);
	}

	async updateUserSettingsById(
		userId: string,
		data: UserUpdateSettingRequestType
	): Promise<void> {
		const { affected, } = await this.userSettingRepository.update(
			{ userId, }, { ...data, }
		);
		if (affected <= 0) throw new UserNotFoundException();

		return;
	}

	async updateUserById(id: string, data: Partial<User>): Promise<void> {
		const { affected, } = await this.userRepository.update({ id, }, data);
		if (affected <= 0) throw new UserNotFoundException();

		return;
	}

	async getFollowersByUserId(myId: string): Promise<User[]> {
		const follows = await this.userFollowRepository.find({
			where: { toFollowId: myId, },
			relations: { toFollow: true, },
		});

		return follows.map((follow) => {
			return follow.toFollow;
		});
	}

	async getFollowingByUserId(myId: string): Promise<User[]> {
		const follows = await this.userFollowRepository.find({
			where: { userId: myId, },
			relations: { user: true, },
		});

		return follows.map(({ user, }) => user);
	}

	async getStudentQRCode(
		studentId: string,
		nativeOption?: boolean
	): Promise<string> {
		if (nativeOption) return this.generateNativeQRCode(studentId);

		return QRCode.toDataURL(`AA${studentId}`);
	}

	async unfollowUser(myId: string, userId: string): Promise<void> {
		await this.userFollowRepository.delete({
			userId: myId,
			toFollowId: userId,
		});
	}

	async verifyUser(
		userId: string,
		params: { studentId: string; majorId: number }
	): Promise<boolean> {
		const { affected, } = await this.userRepository.update(
			{ id: userId, }, {
				schoolId: params.studentId,
				majorId: params.majorId,
				isVerified: true,
			}
		);

		return affected > 0;
	}

	private async generateNativeQRCode(studentId: string): Promise<string> {
		const token = await this.jwtService.signAsync(
			{ studentId, }, { expiresIn: USER_QR_CODE_EXPIRE, }
		);

		return QRCode.toDataURL(token);
	}

	private async generateQrCodeByScheduleSetId(setId: string): Promise<string> {
		return QRCode.toDataURL(setId);
	}

	// TODO: OCR 기능 구현
	private async updateUniversityScheduleByPhoto(userId: string, photo: Buffer): Promise<UniversityLecture[]> {
		const resizedPhoto = await this.userPhotoClient.resizePhoto(photo);
		const ocrLectures = await this.userOcrClient.getScheduleFromPhoto(resizedPhoto);

		return [];
	}

	private async updateUniversityScheduleByLectureIds(
		userId: string,
		lectureIds: number[]
	): Promise<UniversityLecture[]> {
		await this.userLectureRepository.delete({ userId, });
		lectureIds.map(async (lectureId) => {
			return await this.userLectureRepository.save({
				userId,
				lectureId,
			});
		});
		const lectures = await this.userLectureRepository.find({ where: { userId, }, });

		return lectures.map((lecture) => {
			return lecture.lecture;
		});
	}
}
