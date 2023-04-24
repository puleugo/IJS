import { UniversityMajor } from './university-major.entity';

export interface IUniversityEvent {
  id: number;
  title: string;
  majorId: number | null;
  startAt: Date;
  endAt: Date;
  major: UniversityMajor;
}
