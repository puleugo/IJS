import {
	Column, Entity, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { MealCourseEnum, } from '@app/crawler/domain/meal-course.enum';

@Entity('university_meals')
@Unique(['course', 'publishedAt',])
export class UniversityMeal {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('text', {
    	array: true,
    	default: '{}',
    })
    menu: string[];

    @Column('enum', {
    	enum: MealCourseEnum,
    	nullable: true,
    })
    course: MealCourseEnum | null;

    @Column('date')
    publishedAt: Date;
}
