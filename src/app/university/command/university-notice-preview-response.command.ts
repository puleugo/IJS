import { IUniversityNotice } from '@domain/university/university-major-notice.interface';

export type UniversityNoticePreviewResponseCommand = Pick<
  IUniversityNotice,
  'id' | 'title' | 'viewsCount' | 'wroteAt' | 'author'
>;
