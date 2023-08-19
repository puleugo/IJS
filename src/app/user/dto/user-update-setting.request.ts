import { IsBoolean, IsOptional } from 'class-validator';
import { UserUpdateSettingRequestCommand } from '@app/user/command/user-update-setting-request.command';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateSettingRequest
  implements UserUpdateSettingRequestCommand
{
  @ApiProperty({
    description: '학식 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isIgnoredMealNotification?: boolean;

  @ApiProperty({
    description: '학생회 게시글 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isIgnoredCouncilNotification?: boolean;

  @ApiProperty({
    description: '학부 공지 알림을 차단합니다.',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isIgnoredNoticeNotification?: boolean;
}
