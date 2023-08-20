import { UserProfileResponseCommand } from '@app/user/command/user-profile-response.command';
import { IUserSetting } from '@domain/user/user-setting.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponse implements UserProfileResponseCommand {
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
    description: '학교 아이디',
    example: '20220000',
  })
  readonly schoolId: string | null;

  @ApiProperty({
    description: '학교 이메일',
    example: 'example@oasis.inje.ac.kr',
  })
  readonly schoolEmail: string | null;

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

  constructor({
    id,
    isVerified,
    majorId,
    schoolId,
    schoolEmail,
    settings,
  }: UserProfileResponseCommand) {
    this.id = id;
    this.isVerified = isVerified;
    this.majorId = majorId;
    this.schoolId = schoolId;
    this.schoolEmail = schoolEmail;
    this.settings = settings;
  }
}
