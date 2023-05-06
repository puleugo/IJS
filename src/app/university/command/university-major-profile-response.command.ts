import { IUniversityMajor } from '@domain/university/university-major.interface';

export type UniversityMajorProfileResponseCommand = Pick<
  IUniversityMajor,
  'id' | 'name' | 'slug'
>;
