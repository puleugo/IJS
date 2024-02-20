import { ApiProperty, } from '@nestjs/swagger';
import { IsNotEmpty, IsString, } from 'class-validator';

export class RefreshRequest {
    @ApiProperty({
    	description: 'refresh token',
    	required: true,
    })
    @IsString()
    @IsNotEmpty()
    refreshToken!: string;
}
