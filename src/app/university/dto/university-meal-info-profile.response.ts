import { UniversityMealInfoProfileResponseCommand } from '@app/university/command/university-meal-info-profile-response.command';
import { MealTimeEnum } from '@domain/university/university-meal.interface';

export class UniversityMealInfoProfileResponse
  implements UniversityMealInfoProfileResponseCommand
{
  courseA: string[];
  courseB: string[];
  courseC: string[];
  mealTime: MealTimeEnum;

  constructor({
    courseA,
    courseB,
    courseC,
    mealTime,
  }: UniversityMealInfoProfileResponseCommand) {
    this.courseA = courseA;
    this.courseB = courseB;
    this.courseC = courseC;
    this.mealTime = mealTime;
  }
}
