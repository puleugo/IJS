import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';

export class UniversityFinishDateProfileResponse
  implements UniversityFinishDateProfileResponseCommand
{
  isFinished: boolean;
  comingFinishDate: Date;
  apiCalled: Date;
  semester: number;

  constructor({
    isFinished,
    comingFinishDate,
    apiCalled,
    semester,
  }: UniversityFinishDateProfileResponseCommand) {
    this.isFinished = isFinished;
    this.comingFinishDate = comingFinishDate;
    this.apiCalled = apiCalled;
    this.semester = semester;
  }
}
