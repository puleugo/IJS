import { UniversityMajorNotice } from './university-major-notice.entity';
import { UniversityEvent } from './university-event.entity';

export interface IUniversityMajor {
  id: number;
  name: string;
  slug: string;
  noticeUrl: string;
  notices: UniversityMajorNotice[];
  events: UniversityEvent[];
}
