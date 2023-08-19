import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationUpdateRequest {
  @ApiProperty({
    example: 'android',
    description: '디바이스 타입',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceType?: string;
}
