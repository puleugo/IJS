import { ScheduleSetProfileResponseCommand } from '@app/user/command/schedule-set-profile-response.command';

export class ScheduleSetProfileResponse
  implements ScheduleSetProfileResponseCommand
{
  scheduleSetId: string;
  qrUrl: string;

  constructor({ scheduleSetId, qrUrl }: ScheduleSetProfileResponseCommand) {
    this.scheduleSetId = scheduleSetId;
    this.qrUrl = qrUrl;
  }
}
