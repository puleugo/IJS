import { ApiProperty } from '@nestjs/swagger';

export class TokenResponse {
  @ApiProperty({ example: 'aaaa.bbbb.cccc', description: 'JWT 엑세스 토큰' })
  accessToken: string;

  @ApiProperty({ example: 'aaaa.bbbb.cccc', description: 'JWT 리프레시 토큰' })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

// export class GoogleTokenResponse{
//   @ApiProperty
// }
// 여기를 손봐야함, 토큰을 받아오는 형태를 집어 넣어야함
