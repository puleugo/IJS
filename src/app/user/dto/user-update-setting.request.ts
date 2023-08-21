import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserUpdateSettingRequestType } from '@app/user/user.type';

export class UserUpdateSettingRequest implements UserUpdateSettingRequestType {
  @ApiProperty({
    description: '학식 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isIgnoredMealNotification?: boolean;

  @ApiProperty({
    description: '학생회 게시글 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isIgnoredCouncilNotification?: boolean;

  @ApiProperty({
    description: '학부 공지 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  readonly isIgnoredNoticeNotification?: boolean;
}
