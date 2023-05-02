import { UniversityLecture } from '@domain/university/university-lecture.entity';

export class UniversityLectureProfileResponse {
  id: number;
  title: string;
  startAt: number;
  endAt: number;

  constructor({ id, title, startAt, endAt }: UniversityLecture) {
    this.id = id;
    this.title = title;
    this.startAt = startAt;
    this.endAt = endAt;
  }
}
