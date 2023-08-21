import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationUpdateRequestType } from '@app/notification/notification.type';

export class NotificationUpdateRequest
  implements NotificationUpdateRequestType
{
  @ApiProperty({
    example: 'android',
    description: '디바이스 타입',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly deviceType?: string;
}
