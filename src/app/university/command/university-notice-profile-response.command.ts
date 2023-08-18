import { IUniversityNotice } from '@domain/university/university-major-notice.interface';

export type UniversityNoticeProfileResponseCommand = Pick<
  IUniversityNotice,
  | 'id'
  | 'title'
  | 'content'
  | 'url'
  | 'files'
  | 'viewsCount'
  | 'wroteAt'
  | 'majorId'
> & { majorName: string };
