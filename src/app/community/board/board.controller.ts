import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { BoardProfileResponse } from '@app/community/board/dtos/board-profile.response';
import { BoardService } from '@app/community/board/board.service';
import { BoardUpdateRequest } from '@app/community/board/dtos/board-update.request';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardCreateRequest } from '@app/community/board/dtos/board-create.request';
import { Request } from '@infrastructure/types/request.types';

@Controller('boards')
@ApiTags('[커뮤니티] 게시판')
export class BoardController {
  constructor(private readonly boardsService: BoardService) {}

  @Get()
  @ApiOperation({ summary: '게시판 목록 조회' })
  @ApiResponse({ status: 200, description: '성공', type: BoardProfileResponse })
  async getBoards(): Promise<BoardProfileResponse[]> {
    const boards = await this.boardsService.getBoards();
    return boards.map((board) => new BoardProfileResponse(board));
  }

  @Post()
  @ApiOperation({ summary: '게시판 생성' })
  @ApiBody({ type: BoardCreateRequest })
  @ApiResponse({ status: 200, description: '성공', type: BoardProfileResponse })
  async createBoard(
    @Body() boardCreateRequest: BoardCreateRequest,
  ): Promise<BoardProfileResponse> {
    const board = await this.boardsService.createBoard(boardCreateRequest);
    return new BoardProfileResponse(board);
  }

  @Put(':boardId')
  @ApiOperation({ summary: '게시판 수정' })
  @ApiBody({ type: BoardUpdateRequest })
  @ApiResponse({ status: 200, description: '성공', type: BoardProfileResponse })
  async updateBoard(
    @Param('boardId', ParseIntPipe) id: number,
    @Body() boardUpdateRequest: BoardUpdateRequest,
  ): Promise<BoardProfileResponse> {
    const board = await this.boardsService.updateBoard({
      id,
      ...boardUpdateRequest,
    });
    return new BoardProfileResponse(board);
  }

  @Delete(':boardId')
  @ApiOperation({ summary: '게시판 삭제' })
  @ApiResponse({ status: 200, description: '성공', type: String })
  async deleteBoard(
    @Param('boardId', ParseIntPipe) id: number,
    @Req() { user }: Request,
  ): Promise<string> {
    await this.boardsService.deleteBoard({ id });
    return 'success';
  }
}
