import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequest {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', description: '이미지' })
  file!: Buffer;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: '이름' })
  name!: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: '학번' })
  studentId!: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'int', description: '학과 ID' })
  majorId!: number;
}
