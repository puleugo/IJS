import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardUpdateCommand = Pick<
  IBoard,
  'id' | 'name' | 'description' | 'isAnonymous'
>;
