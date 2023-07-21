import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '@domain/user/user.interface';

export type UserVerificationRequestCommand = Pick<
  IUser,
  'name' | 'schoolId' | 'majorId'
>;

export class RegisterRequest implements UserVerificationRequestCommand {
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', description: '이미지' })
  file!: Buffer;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: '이름' })
  name!: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: '학번' })
  schoolId!: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'int', description: '학과 ID' })
  majorId!: number;
}