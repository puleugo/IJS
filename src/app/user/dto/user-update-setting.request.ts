import { IsBoolean, IsOptional } from 'class-validator';
import { UserUpdateSettingRequestCommand } from '@app/user/command/user-update-setting-request.command';

export class UserUpdateSettingRequest
  implements UserUpdateSettingRequestCommand
{
  @IsOptional()
  @IsBoolean()
  isIgnoredGeneralNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  isIgnoredMealNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  isIgnoredCouncilNotification?: boolean;

  @IsOptional()
  @IsBoolean()
  isIgnoredNoticeNotification?: boolean;
}
