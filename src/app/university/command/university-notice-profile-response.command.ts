import { IUniversityMajorNotice } from '../../../domain/university/university-major-notice.interface';

export type UniversityNoticeProfileResponseCommand = Pick<
  IUniversityMajorNotice,
  'id' | 'title' | 'url' | 'author' | 'wroteAt'
>;
