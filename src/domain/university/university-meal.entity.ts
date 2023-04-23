import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

enum MealTimeEnum {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
}

enum MealCourseEnum {
  A = 'A',
  B = 'B',
  C = 'C',
}

@Entity('university_meals')
export class UniversityMeal {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { array: true, default: '{}' })
  menu: string[];

  @Column('enum', { enum: MealCourseEnum, nullable: true })
  course: MealCourseEnum | null;

  @Column('date')
  publishedAt: Date;

  @Column('enum', { enum: MealTimeEnum })
  mealTime: MealTimeEnum;
}
