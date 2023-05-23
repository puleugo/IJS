export enum MealCourseEnum {
  A = 'A',
  B = 'B',
  C = 'C',
}

export interface IUniversityMeal {
  id: number;
  menu: string[];
  course: MealCourseEnum | null;
  publishedAt: Date;
}

export interface IUniversityMealInfo {
  courseA: IUniversityMeal;
  courseB: IUniversityMeal;
  courseC: IUniversityMeal;
}
