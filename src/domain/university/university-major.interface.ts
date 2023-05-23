import { IUniversityMajorNotice } from '@domain/university/university-major-notice.interface';
import { IUniversityEvent } from '@domain/university/university-event.interface';
import { IUniversityDepartment } from '@domain/university/university-department.interface';

export interface IUniversityMajor {
  id: number;
  name: string;
  slug: string;
  noticeUrl: string;
  departmentId: number;
  notices: IUniversityMajorNotice[];
  department: IUniversityDepartment;
  events: IUniversityEvent[];
}
