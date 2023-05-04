import { User } from '@domain/user/user.entity';
import { UserProfileResponseCommand } from '@app/user/command/user-profile-response.command';

export class UserProfileResponse implements UserProfileResponseCommand {
  id: string;
  majorId: number | null;
  schoolId: string | null;
  schoolEmail: string | null;

  constructor({
    id,
    majorId,
    schoolId,
    schoolEmail,
  }: UserProfileResponseCommand) {
    this.id = id;
    this.majorId = majorId;
    this.schoolId = schoolId;
    this.schoolEmail = schoolEmail;
  }
}
