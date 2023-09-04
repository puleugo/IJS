import { Board, } from '@app/community/board/domain/board.entity';

export type BoardCreateRequestType = Pick<
    Board,
    'name' | 'description' | 'isAnonymous'
>;

export type BoardDeleteRequestType = Pick<Board, 'id'>;

export type BoardProfileResponseType = Pick<
    Board,
    'id' | 'name' | 'description' | 'articlesCount' | 'isAnonymous'
>;

export type BoardUpdateRequestType = Pick<
    Board,
    'id' | 'name' | 'description' | 'isAnonymous'
>;
