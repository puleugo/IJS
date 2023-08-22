export interface IUniversityProgram {
    id: number;
    title: string;
    author: string;
    url: string;
    endAt: Date;
    createdAt: Date;
    deletedAt: Date | null;
}
