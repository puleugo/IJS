import { UniversityMajor } from './university-major.entity';

export interface IUniversityMajorNotice {
  id: number;
  title: string;
  url: string;
  author: string;
  wroteAt: Date;
  major: UniversityMajor;
}
