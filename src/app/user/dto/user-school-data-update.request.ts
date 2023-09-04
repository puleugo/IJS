import { UserSchoolDataUpdateRequestType, } from '@app/user/dto/user.type';
import { ApiProperty, } from '@nestjs/swagger';
import {
	IsEmail, IsOptional, IsString,
} from 'class-validator';

export class UserSchoolDataUpdateRequest implements UserSchoolDataUpdateRequestType {
    @ApiProperty({
    	description: '이름',
    	example: '홍길동',
    	required: false,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
    	description: '학번',
    	example: '202012345',
    	required: false,
    })
    @IsString()
    @IsOptional()
    schoolId?: string;

    @ApiProperty({
    	description: '학교 이메일',
    	example: 'example@oasis.inje.ac.kr',
    	required: false,
    })
    @IsEmail()
    @IsOptional()
    schoolEmail?: string;
}
