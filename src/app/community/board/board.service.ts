import { Injectable } from '@nestjs/common';
import { BoardCreateRequest } from '@app/community/board/dto/board-create.request';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
import { Board } from '@domain/communities/boards/board.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardProfileCommand } from '@app/community/board/commands/board-profile.command';
import { BoardUpdateCommand } from '@app/community/board/commands/board-update.command';
import { BoardDeleteCommand } from '@app/community/board/commands/board-delete.command';
import { BoardNotFoundException } from '@domain/error/board.error';

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
    if (!board) throw new BoardNotFoundException();
    const updatedBoard = await this.boardRepository.save({
      ...board,
      ...BoardUpdateData,
    });
    return updatedBoard;
  }

  async deleteBoard(boardDeleteCommand: BoardDeleteCommand): Promise<boolean> {
    const { id } = boardDeleteCommand;
    const isBoardExist = await this.boardRepository.exist({ where: { id } });
    if (!isBoardExist) throw new BoardNotFoundException();

    const { affected } = await this.boardRepository.softDelete({ id });
    return affected > 0;
  }

  async findById(id: number, options?: FindOneOptions<Board>): Promise<Board> {
    return await this.boardRepository.findOne({
      ...options,
      ...{ where: { id, ...options?.where } },
    });
  }

  async decrementArticleCount(boardId: number): Promise<UpdateResult> {
    return await this.boardRepository.decrement(
      { id: boardId },
      'articlesCount',
      1,
    );
  }

  async incrementArticleCount(boardId: number): Promise<UpdateResult> {
    return await this.boardRepository.increment(
      { id: boardId },
      'articlesCount',
      1,
    );
  }
}
