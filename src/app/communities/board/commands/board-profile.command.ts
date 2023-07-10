import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardProfileCommand = Pick<
  IBoard,
  'id' | 'name' | 'description' | 'articlesCount' | 'isAnonymous'
>;
