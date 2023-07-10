import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardCreateRequest } from '@app/communities/board/dtos/board-create.request';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { Board } from '@domain/communities/boards/board.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardProfileCommand } from '@app/communities/board/commands/board-profile.command';
import { BoardUpdateCommand } from '@app/communities/board/commands/board-update.command';
import { BoardDeleteCommand } from '@app/communities/board/commands/board-delete.command';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async getBoards(): Promise<BoardProfileCommand[]> {
    const boards = await this.boardRepository.find();
    return boards;
  }

  async createBoard(
    boardCreateRequest: BoardCreateRequest,
  ): Promise<BoardProfileCommand> {
    const createdBoard = this.boardRepository.create(boardCreateRequest);

    const board = await this.boardRepository.save(createdBoard);
    return board;
  }

  async updateBoard(
    boardUpdateRequest: BoardUpdateCommand,
  ): Promise<BoardProfileCommand> {
    const { id, ...BoardUpdateData } = boardUpdateRequest;
    const board = await this.boardRepository.findOne({
      where: { id },
    });
    if (!board) throw new NotFoundException('Board not found');
    const updatedBoard = await this.boardRepository.save(board);
    return updatedBoard;
  }

  async deleteBoard(boardDeleteCommand: BoardDeleteCommand): Promise<boolean> {
    const { id } = boardDeleteCommand;
    const isBoardExist = await this.boardRepository.exist({
      where: { id },
    });
    if (!isBoardExist) throw new NotFoundException('Board not found');

    const { affected } = await this.boardRepository.softDelete({ id });
    return affected > 0;
  }

  async findById(id: number, options?: FindOneOptions<Board>): Promise<Board> {
    return await this.boardRepository.findOne({ where: { id }, ...options });
  }
}
