import { UniversityNoticeProfileResponseCommand } from '@app/university/command/university-notice-profile-response.command';

export class UniversityNoticeProfileResponse
  implements UniversityNoticeProfileResponseCommand
{
  id: number;
  title: string;
  url: string;
  author: string;
  wroteAt: Date;
  major: string;

  constructor({
    id,
    title,
    url,
    author,
    wroteAt,
  }: UniversityNoticeProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.author = author;
    this.wroteAt = wroteAt;
  }
}
