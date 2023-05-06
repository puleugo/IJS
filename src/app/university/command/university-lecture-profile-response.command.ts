import { IUniversityLecture } from '@domain/university/university-lecture.interface';

export type UniversityLectureProfileResponseCommand = Pick<
  IUniversityLecture,
  'id' | 'title' | 'startAt' | 'endAt'
>;
