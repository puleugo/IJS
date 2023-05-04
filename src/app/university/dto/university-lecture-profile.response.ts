import { UniversityLectureProfileResponseCommand } from '@app/university/command/university-lecture-profile-response.command';

export class UniversityLectureProfileResponse
  implements UniversityLectureProfileResponseCommand
{
  id: number;
  title: string;
  startAt: number;
  endAt: number;

  constructor({
    id,
    title,
    startAt,
    endAt,
  }: UniversityLectureProfileResponseCommand) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
