import { IBoard } from '@domain/communities/boards/board.interface';

export type BoardUpdateCommand = Partial<
  Pick<IBoard, 'name' | 'description' | 'isAnonymous'>
> &
  Pick<IBoard, 'id'>;
