import { IUniversityMajor } from '@domain/university/university-major.interface';

export interface IUniversityMajorNotice {
  id: number;
  title: string;
  url: string;
  author: string;
  wroteAt: Date;
  major: IUniversityMajor;
}
