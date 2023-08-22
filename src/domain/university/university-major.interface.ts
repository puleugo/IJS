import { IUniversityNotice, } from '@domain/university/university-major-notice.interface';
import { IUniversityEvent, } from '@domain/university/university-event.interface';
import { IUniversityDepartment, } from '@domain/university/university-department.interface';

export interface IUniversityMajor {
    id: number;
    name: string;
    noticeUrl: string;
    departmentId: number;
    notices: IUniversityNotice[];
    department: IUniversityDepartment;
    events: IUniversityEvent[];
}
