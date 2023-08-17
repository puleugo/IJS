import { IUniversityNotice } from '@domain/university/university-major-notice.interface';

export type UniversityNoticeSlugArrayResponseCommand = Pick<
  IUniversityNotice,
  'id' | 'slug'
>;
