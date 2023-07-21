import { UserProfileResponseCommand } from '@app/user/command/user-profile-response.command';

export class UserProfileResponse implements UserProfileResponseCommand {
  id: string;
  isVerified: boolean;
  majorId: number | null;
  schoolId: string | null;
  schoolEmail: string | null;

  constructor({
    id,
    isVerified,
    majorId,
    schoolId,
    schoolEmail,
  }: UserProfileResponseCommand) {
    this.id = id;
    this.isVerified = isVerified;
    this.majorId = majorId;
    this.schoolId = schoolId;
    this.schoolEmail = schoolEmail;
  }
}
