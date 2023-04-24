import { UniversitySemester } from './university-semester.entity';

export interface IUniversityLecture {
  id: number;
  title: string;
  weekdayIndex: number;
  classRoom: string;
  semester: UniversitySemester;

  validate();
}
