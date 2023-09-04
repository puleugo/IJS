import {
	Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req,
} from '@nestjs/common';
import { BoardProfileResponse, } from '@app/community/board/dto/board-profile.response';
import { BoardService, } from '@app/community/board/board.service';
import { BoardUpdateRequest, } from '@app/community/board/dto/board-update.request';
import {
	ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags,
} from '@nestjs/swagger';
import { BoardCreateRequest, } from '@app/community/board/dto/board-create.request';
import { Request, } from '@common/type/request.type';

@Controller('boards')
@ApiTags('[커뮤니티] 게시판')
export class BoardController {
	constructor(private readonly boardsService: BoardService) {}

    @Get()
    @ApiOperation({ summary: '게시판 목록 조회', })
    @ApiOkResponse({
    	description: '성공',
    	type: BoardProfileResponse,
    	isArray: true,
    })
	async getBoards(): Promise<BoardProfileResponse[]> {
		const boards = await this.boardsService.getBoards();

		return boards.map((board) => {
			return new BoardProfileResponse(board);
		});
	}

    @Post()
    @ApiOperation({ summary: '게시판 생성', })
    @ApiBody({ type: BoardCreateRequest, })
    @ApiCreatedResponse({
    	description: '성공',
    	type: BoardProfileResponse,
    })
    async createBoard(
        @Body() boardCreateRequest: BoardCreateRequest
    ): Promise<BoardProfileResponse> {
    	const board = await this.boardsService.createBoard(boardCreateRequest);

    	return new BoardProfileResponse(board);
    }

    @Put(':boardId')
    @ApiOperation({ summary: '게시판 수정', })
    @ApiBody({ type: BoardUpdateRequest, })
    @ApiCreatedResponse({
    	description: '성공',
    	type: BoardProfileResponse,
    })
    async updateBoard(
        @Param('boardId', ParseIntPipe) id: number,
        @Body() boardUpdateRequest: BoardUpdateRequest
    ): Promise<BoardProfileResponse> {
    	const board = await this.boardsService.updateBoard({
    		id,
    		...boardUpdateRequest,
    	});

    	return new BoardProfileResponse(board);
    }

    @Delete(':boardId')
    @ApiOperation({ summary: '게시판 삭제', })
    @ApiCreatedResponse({ description: '성공', })
    async deleteBoard(
        @Param('boardId', ParseIntPipe) id: number,
        @Req() { user, }: Request
    ): Promise<void> {
    	await this.boardsService.deleteBoard({ id, });
    }
}
