import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadRequest {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', description: '이미지' })
  file!: Buffer;
}
