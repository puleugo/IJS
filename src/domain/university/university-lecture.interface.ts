import { IUniversitySemester } from '@domain/university/university-semester.interface';

export interface IUniversityLecture {
  id: number;
  title: string;
  startAt: number;
  endAt: number;
  weekdayIndex: number;
  classRoom: string;
  semester: IUniversitySemester;

  validate();
}
