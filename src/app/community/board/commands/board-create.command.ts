import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardCreateCommand = Pick<
  IBoard,
  'name' | 'description' | 'isAnonymous'
>;
