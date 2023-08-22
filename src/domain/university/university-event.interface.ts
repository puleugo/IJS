import { UniversityMajor, } from '@domain/university/university-major.entity';

export interface IUniversityEvent {
    id: number;
    title: string;
    majorId: number | null;
    startAt: Date;
    endAt: Date;
    major: UniversityMajor;
}
