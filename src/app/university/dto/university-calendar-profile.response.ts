import { UniversityCalendarProfileResponseCommand } from '@app/university/command/university-calendar-profile-response.command';

export class UniversityCalendarProfileResponse
  implements UniversityCalendarProfileResponseCommand
{
  id: number;
  title: string;
  startAt: Date;
  endAt: Date;

  constructor({
    id,
    title,
    startAt,
    endAt,
  }: UniversityCalendarProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
