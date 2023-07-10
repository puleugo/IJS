import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BoardProfileResponse } from '@app/community/board/dtos/board-profile.response';
import { BoardCreateCommand } from '@app/community/board/commands/board-create.command';
import { BoardService } from '@app/community/board/board.service';
import { BoardUpdateRequest } from '@app/community/board/dtos/board-update.request';

@Controller('board')
export class BoardController {
  constructor(private readonly boardsService: BoardService) {}

  @Get()
  async getBoards(): Promise<BoardProfileResponse[]> {
    const boards = await this.boardsService.getBoards();
    return boards.map((board) => new BoardProfileResponse(board));
  }

  @Post()
  async createBoard(
    @Body() boardCreateRequest: BoardCreateCommand,
  ): Promise<BoardProfileResponse> {
    const board = await this.boardsService.createBoard(boardCreateRequest);
    return new BoardProfileResponse(board);
  }

  @Put(':boardId')
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
  async deleteBoard(
    @Param('boardId', ParseIntPipe) id: number,
  ): Promise<string> {
    await this.boardsService.deleteBoard({ id });
    return 'success';
  }
}
