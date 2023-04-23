import { MealTimeEnum } from '../../../domain/university/university-meal.entity';

export type UniversityMealInfoProfileResponseCommand = {
  courseA: string[];
  courseB: string[];
  courseC: string[];
  mealTime: MealTimeEnum;
};
