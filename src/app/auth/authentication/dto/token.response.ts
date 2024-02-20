import { ApiProperty, } from '@nestjs/swagger';

export class TokenResponse {
    @ApiProperty({
    	example: 'aaaa.bbbb.cccc',
    	description: 'JWT 엑세스 토큰',
    })
    readonly accessToken: string;

    @ApiProperty({
    	example: 'aaaa.bbbb.cccc',
    	description: 'JWT 리프레시 토큰',
    })
    readonly refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
    	this.accessToken = accessToken;
    	this.refreshToken = refreshToken;
    }
}
