import { ApiProperty } from '@nestjs/swagger';
import { BoardProfileResponseType } from '@app/community/board/board.type';

export class BoardProfileResponse implements BoardProfileResponseType {
  @ApiProperty({
    description: '게시판 ID',
    example: 1,
  })
  readonly id: number;
  @ApiProperty({
    description: '게시판 이름',
    example: '학생회 게시판',
  })
  readonly name: string;
  @ApiProperty({
    description: '게시판 설명',
    example: '학생회 게시판입니다.',
  })
  readonly description: string;
  @ApiProperty({
    description: '게시글 수',
    example: 10,
  })
  readonly articlesCount: number;
  @ApiProperty({
    description: '익명 여부',
    example: false,
  })
  readonly isAnonymous: boolean;

  constructor(board: any) {
    this.id = board.id;
    this.name = board.name;
    this.description = board.description;
    this.articlesCount = board.articlesCount;
    this.isAnonymous = board.isAnonymous;
  }
}
