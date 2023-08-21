import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationCreateRequestType } from '@app/notification/notification.type';

export class NotificationCreateRequest
  implements NotificationCreateRequestType
{
  @ApiProperty({
    example: 'fcmToken',
    description: '푸시 알림을 위한 토큰',
  })
  @IsNotEmpty()
  @IsString()
  readonly notificationToken!: string;

  @ApiProperty({
    example: 'android',
    description: '디바이스 타입',
  })
  @IsNotEmpty()
  @IsString()
  readonly deviceType!: string;
}
