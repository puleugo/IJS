import { BoardCreateCommand } from '@app/communities/board/commands/board-create.command';

export class BoardCreateRequest implements BoardCreateCommand {
  readonly name: string;
  readonly description: string;
  readonly isAnonymous: boolean;
}
