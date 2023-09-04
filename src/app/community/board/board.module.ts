import { Module, } from '@nestjs/common';
import { BoardController, } from './board.controller';
import { BoardService, } from './board.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { Board, } from '@app/community/board/domain/board.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Board,]),],
	controllers: [BoardController,],
	providers: [BoardService,],
	exports: [BoardService,],
})
export class BoardModule {
}
