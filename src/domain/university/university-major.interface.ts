import { IUniversityMajorNotice } from '@domain/university/university-major-notice.interface';
import { IUniversityEvent } from '@domain/university/university-event.interface';

export interface IUniversityMajor {
  id: number;
  name: string;
  slug: string;
  noticeUrl: string;
  notices: IUniversityMajorNotice[];
  events: IUniversityEvent[];
}
