import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationUpdateRequest {
  @IsNotEmpty()
  @IsString()
  deviceType: string;
}
