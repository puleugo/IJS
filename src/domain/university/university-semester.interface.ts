import { UniversityLecture } from './university-lecture.entity';

export interface IUniversitySemester {
  id: number;
  name: string;
  year: number;
  startedAt: Date;
  endedAt: Date;
  lectures: UniversityLecture[];
}
