import { User } from '@domain/user/user.entity';

export class UserPreviewResponse {
  id: string;

  constructor({ id }: Partial<User>) {
    this.id = id;
  }
}
