import { BoardProfileCommand } from '@app/community/board/commands/board-profile.command';

export class BoardProfileResponse implements BoardProfileCommand {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly articlesCount: number;
  readonly isAnonymous: boolean;

  constructor(board: any) {
    this.id = board.id;
    this.name = board.name;
    this.description = board.description;
    this.articlesCount = board.articlesCount;
    this.isAnonymous = board.isAnonymous;
  }
}
