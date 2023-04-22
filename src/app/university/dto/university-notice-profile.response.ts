import { UniversityNoticeProfileResponseCommand } from '@app/university/command/university-notice-profile-response.command';

export class UniversityNoticeProfileResponse
  implements UniversityNoticeProfileResponseCommand
{
  id: string;
  title: string;
  contentsUrl: string;
  author: string;
  writeDate: Date;
  major: string;

  constructor({
    id,
    title,
    contentsUrl,
    author,
    writeDate,
    major,
  }: UniversityNoticeProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.contentsUrl = contentsUrl;
    this.author = author;
    this.writeDate = writeDate;
    this.major = major;
  }
}
