import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';

export class UniversityFinishDateProfileResponse
  implements UniversityFinishDateProfileResponseCommand
{
  isFinished: boolean;
  comingFinishDate: Date;
  apiCalled: Date;

  constructor({
    isFinished,
    comingFinishDate,
    apiCalled,
  }: UniversityFinishDateProfileResponseCommand) {
    this.isFinished = isFinished;
    this.comingFinishDate = comingFinishDate;
    this.apiCalled = apiCalled;
  }
}
