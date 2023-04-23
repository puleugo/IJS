import { UniversityProgramProfileResponseCommand } from '@app/university/command/university-program-profile-response.command';

export class UniversityProgramProfileResponse
  implements UniversityProgramProfileResponseCommand
{
  id: number;
  title: string;
  url: string;
  author: string;
  endAt: Date;

  constructor({
    id,
    title,
    url,
    author,
    endAt,
  }: UniversityProgramProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.endAt = endAt;
    this.author = author;
  }
}
