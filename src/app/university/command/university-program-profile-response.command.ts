import { IUniversityProgram } from '../../../domain/university/university-program.interface';

export type UniversityProgramProfileResponseCommand = Pick<
  IUniversityProgram,
  'id' | 'title' | 'url' | 'author' | 'endAt'
>;
