import { BoardUpdateCommand } from '@app/community/board/commands/board-update.command';

export class BoardUpdateRequest implements Partial<BoardUpdateCommand> {
  readonly name?: string;
  readonly description?: string;
  readonly isAnonymous?: boolean;
}
