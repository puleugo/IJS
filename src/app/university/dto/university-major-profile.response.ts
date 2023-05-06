import { UniversityMajorProfileResponseCommand } from '@app/university/command/university-major-profile-response.command';

export class UniversityMajorProfileResponse
  implements UniversityMajorProfileResponseCommand
{
  id: number;
  name: string;
  slug: string;

  constructor({ id, name, slug }: UniversityMajorProfileResponseCommand) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }
}
