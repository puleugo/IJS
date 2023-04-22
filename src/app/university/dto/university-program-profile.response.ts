import { UniversityProgramProfileResponseCommand } from '@app/university/command/university-program-profile-response.command';

export class UniversityProgramProfileResponse
  implements UniversityProgramProfileResponseCommand
{
  id: number;
  title: string;
  contentsUrl: string;
  department: string;
  endDate: Date;
  remainDay: number;
  author: string;
  injeId: string;

  constructor({
    id,
    title,
    contentsUrl,
    department,
    endDate,
    remainDay,
    author,
    injeId,
  }: UniversityProgramProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.contentsUrl = contentsUrl;
    this.department = department;
    this.endDate = endDate;
    this.remainDay = remainDay;
    this.author = author;
    this.injeId = injeId;
  }
}
