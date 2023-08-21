import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardCreateRequestType = Pick<
  IBoard,
  'name' | 'description' | 'isAnonymous'
>;

export type BoardDeleteRequestType = Pick<IBoard, 'id'>;

export type BoardProfileResponseType = Pick<
  IBoard,
  'id' | 'name' | 'description' | 'articlesCount' | 'isAnonymous'
>;

export type BoardUpdateRequestType = Pick<
  IBoard,
  'id' | 'name' | 'description' | 'isAnonymous'
>;
