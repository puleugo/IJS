import { IUniversityMajor } from '@domain/university/university-major.interface';

export interface IUniversityDepartment {
  id: number;
  name: string;
  url: string | null;
  majors: IUniversityMajor[];
}
