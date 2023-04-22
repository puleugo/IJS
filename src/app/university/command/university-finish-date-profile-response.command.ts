import { UniversityFinishDateProfileResponseCommand } from '@app/university/command/university-finished-date-profile-response.command';

export class UniversityFinishDateProfileResponse {
  isFished: boolean;
  comingFinishDate: Date;
  apiCalled: Date;

  constructor({
    isFished,
    comingFinishDate,
    apiCalled,
  }: UniversityFinishDateProfileResponseCommand) {
    this.isFished = isFished;
    this.comingFinishDate = comingFinishDate;
    this.apiCalled = apiCalled;
  }
}
