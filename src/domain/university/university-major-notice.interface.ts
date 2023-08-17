import { IUniversityMajor } from '@domain/university/university-major.interface';

export interface IUniversityNotice {
  id: number;
  title: string;
  content: string;
  url: string;
  author: string;
  slug: string;
  files: string[];
  viewsCount: number;
  wroteAt: Date;
  majorId: number | null;
  major: IUniversityMajor;
}
