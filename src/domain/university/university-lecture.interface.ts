import { IUniversitySemester } from '@domain/university/university-semester.interface';

export interface IUniversityLecture {
  id: number;
  title: string;
  weekdayIndex: number;
  classRoom: string;
  semester: IUniversitySemester;

  validate();
}
