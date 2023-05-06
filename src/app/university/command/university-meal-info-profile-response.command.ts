import { MealTimeEnum } from '@domain/university/university-meal.interface';

export type UniversityMealInfoProfileResponseCommand = {
  courseA: string[];
  courseB: string[];
  courseC: string[];
  mealTime: MealTimeEnum;
};
