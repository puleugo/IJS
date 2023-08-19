import { UserPreviewResponseCommand } from '@app/user/command/user-preview-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UserPreviewResponse implements UserPreviewResponseCommand {
  @ApiProperty({
    description: '사용자 ID',
    example: '41c7ffb8-399c-440f-925d-1869ee77d3c0',
  })
  readonly id: string;

  constructor({ id }: UserPreviewResponseCommand) {
    this.id = id;
  }
}
