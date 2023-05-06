import { UniversityMealInfoProfileResponseCommand } from '@app/university/command/university-meal-info-profile-response.command';

export class UniversityMealInfoProfileResponse
  implements UniversityMealInfoProfileResponseCommand
{
  courseA: string[];
  courseB: string[];
  courseC: string[];

  constructor({
    courseA,
    courseB,
    courseC,
  }: UniversityMealInfoProfileResponseCommand) {
    this.courseA = courseA;
    this.courseB = courseB;
    this.courseC = courseC;
  }
}
