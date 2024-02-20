import {
	Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';

@Entity({ name: 'university_departments', })
@Unique(['name', 'url',])
export class UniversityDepartment {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true, })
    name: string;

    @Column({ nullable: true, })
    url: string | null;

    @OneToMany(() => UniversityMajor, ({ department, }) => department)
    majors: UniversityMajor[];
}
