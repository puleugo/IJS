import { UniversityMealInfoProfileResponseCommand } from '@app/university/command/university-meal-info-profile-response.command';

export class UniversityMealInfoProfileResponse {
  id: number;
  date: Date;
  courseA: string[];
  courseB: string[];
  courseC: string[];

  constructor({
    id,
    date,
    courseA,
    courseB,
    courseC,
  }: UniversityMealInfoProfileResponseCommand) {
    this.id = id;
    this.date = date;
    this.courseA = courseA;
    this.courseB = courseB;
    this.courseC = courseC;
  }
}
