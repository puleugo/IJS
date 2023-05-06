import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';

export class UserPreviewResponse implements UserPreviewResponseCommand {
  id: string;

  constructor({ id }: UserPreviewResponseCommand) {
    this.id = id;
  }
}
