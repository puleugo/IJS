import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IUniversityMeal,
  MealCourseEnum,
} from '@domain/university/university-meal.interface';

@Entity('university_meals')
export class UniversityMeal implements IUniversityMeal {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { array: true, default: '{}' })
  menu: string[];

  @Column('enum', { enum: MealCourseEnum, nullable: true })
  course: MealCourseEnum | null;

  @Column('date')
  publishedAt: Date;
}
