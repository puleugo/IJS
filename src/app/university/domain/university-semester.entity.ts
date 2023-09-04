import {
	Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';

@Entity('university_semesters')
@Unique(['year', 'semesterNumber',])
export class UniversitySemester {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', {
    	length: 50,
    	unique: true,
    })
    name: string;

    @Column('smallint')
    year: number;

    @Column('date')
    startedAt: Date;

    @Column('date')
    endedAt: Date;

    @Column('smallint')
    semesterNumber: number;

    @Column('date')
    middleExamAt: Date;

    @Column('date')
    finalExamAt: Date;

    @OneToMany(() => UniversityLecture, ({ semester, }) => semester)
    lectures: UniversityLecture[];
}
