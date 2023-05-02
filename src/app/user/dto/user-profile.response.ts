import { User } from '@domain/user/user.entity';

export class UserProfileResponse {
  id: string;
  majorId: number | null;
  schoolId: string | null;
  schoolEmail: string | null;

  constructor({ id, majorId, schoolId, schoolEmail }: User) {
    this.id = id;
    this.majorId = majorId;
    this.schoolId = schoolId;
    this.schoolEmail = schoolEmail;
  }
}
