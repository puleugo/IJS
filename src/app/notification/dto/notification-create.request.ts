import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationCreateRequest {
  @IsNotEmpty()
  @IsString()
  notificationToken: string;

  @IsNotEmpty()
  @IsString()
  deviceType: string;
}
