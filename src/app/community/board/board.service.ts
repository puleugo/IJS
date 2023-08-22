import { Injectable, } from '@nestjs/common';
import { BoardCreateRequest, } from '@app/community/board/dto/board-create.request';
import { FindOneOptions, } from 'typeorm/find-options/FindOneOptions';
import { Board, } from '@domain/communities/boards/board.entity';
import { Repository, UpdateResult, } from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { BoardNotFoundException, } from '@domain/error/board.error';
import {
	BoardDeleteRequestType,
	BoardProfileResponseType,
	BoardUpdateRequestType,
} from '@app/community/board/board.type';

@Injectable()
export class BoardService {
	constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>
	) {
	}

	async getBoards(): Promise<BoardProfileResponseType[]> {
		return await this.boardRepository.find();
	}

	async createBoard(
		boardCreateRequest: BoardCreateRequest
	): Promise<BoardProfileResponseType> {
		const createdBoard = this.boardRepository.create(boardCreateRequest);

		return await this.boardRepository.save(createdBoard);
	}

	async updateBoard(
		boardUpdateRequest: BoardUpdateRequestType
	): Promise<BoardProfileResponseType> {
		const { id, ...BoardUpdateData } = boardUpdateRequest;
		const board = await this.boardRepository.findOne({ where: { id, }, });
		if (!board) throw new BoardNotFoundException();

		return await this.boardRepository.save({
			...board,
			...BoardUpdateData,
		});
	}

	async deleteBoard(
		deleteRequestType: BoardDeleteRequestType
	): Promise<boolean> {
		const { id, } = deleteRequestType;
		const isBoardExist = await this.boardRepository.exist({ where: { id, }, });
		if (!isBoardExist) throw new BoardNotFoundException();

		const { affected, } = await this.boardRepository.softDelete({ id, });

		return affected > 0;
	}

	async findById(
		id: number,
		options?: FindOneOptions<Board>
	): Promise<Board> {
		return await this.boardRepository.findOne({
			...options,
			...{
				where: {
					id,
					...options?.where,
				},
			},
		});
	}

	async decrementArticleCount(boardId: number): Promise<UpdateResult> {
		return await this.boardRepository.decrement(
			{ id: boardId, }, 'articlesCount', 1
		);
	}

	async incrementArticleCount(boardId: number): Promise<UpdateResult> {
		return await this.boardRepository.increment(
			{ id: boardId, }, 'articlesCount', 1
		);
	}
}
