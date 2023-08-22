import { IUniversityLecture, } from '@domain/university/university-lecture.interface';

export interface IUniversitySemester {
    id: number;
    name: string;
    year: number;
    semesterNumber: number;
    startedAt: Date;
    endedAt: Date;
    middleExamAt: Date;
    finalExamAt: Date;
    lectures: IUniversityLecture[];
}
