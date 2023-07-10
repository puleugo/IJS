import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardDeleteCommand = Pick<IBoard, 'id'>;
