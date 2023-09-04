import { IUserSetting, } from '@app/user/domain/user-setting.interface';
import { ApiProperty, } from '@nestjs/swagger';
import { UserProfileResponseType, } from '@app/user/dto/user.type';

export class UserProfileResponse implements UserProfileResponseType {
	@ApiProperty({
		description: '유저 아이디',
		example: '4dfa1fcc-25c7-478a-ab72-36c9fa145890',
	})
	readonly id: string;

	@ApiProperty({
		description: '학생 인증 여부',
		example: true,
	})
	readonly isVerified: boolean;

	@ApiProperty({
		description: '학과 아이디',
		example: 1,
	})
	readonly majorId: number | null;

	@ApiProperty({
		description: '학번',
		example: '20220000',
	})
	readonly schoolId: string | null;

	@ApiProperty({
		description: '학교 이메일',
		example: 'example@oasis.inje.ac.kr',
	})
	readonly schoolEmail: string | null;

	@ApiProperty({
		description: '학생 본명',
		example: '백인제',
		nullable: true,
	})
	readonly name: string | null;

	@ApiProperty({
		description: '학과 이름',
		example: '컴퓨터공학과',
		nullable: true,
	})
	readonly majorName: string | null;

	@ApiProperty({
		description: '유저 설정 정보',
		example: {
			isIgnoredMealNotification: false,
			isIgnoredCouncilNotification: false,
			isIgnoredNoticeNotification: false,
		},
	})
	settings: Pick<
		IUserSetting,
		| 'isIgnoredMealNotification'
		| 'isIgnoredCouncilNotification'
		| 'isIgnoredNoticeNotification'
	>;

	constructor(type: UserProfileResponseType) {
		this.id = type.id;
		this.name = type.name;
		this.majorName = type.majorName;
		this.isVerified = type.isVerified;
		this.majorId = type.majorId;
		this.schoolId = type.schoolId;
		this.schoolEmail = type.schoolEmail;
		this.settings = type.settings;
	}
}
