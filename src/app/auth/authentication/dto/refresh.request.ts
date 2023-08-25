import { ApiProperty, } from '@nestjs/swagger';

export class RefreshRequest {
    @ApiProperty({ description: 'refresh token', })
    refreshToken: string;
}
