import {
	Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique,
} from 'typeorm';
import { UniversityNotice, } from './university-notice.entity';
import { UniversityEvent, } from './university-event.entity';
import { UniversityDepartment, } from '@app/university/domain/university-department.entity';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';

@Entity('university_majors')
@Unique(['name', 'departmentId',])
export class UniversityMajor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 50, })
    name: string;

    @Column('int')
    departmentId: number;

    @Column('text', {
    	unique: true,
    	nullable: true,
    })
    noticeUrl: string;

    @ManyToOne(() => UniversityDepartment, (department) => department.majors)
    @JoinColumn({
    	name: 'department_id',
    	referencedColumnName: 'id',
    })
    department: UniversityDepartment;

    @OneToMany(() => UniversityNotice, (notice) => notice.major)
    notices: UniversityNotice[];

    @OneToMany(() => CouncilArticle, ({ major, }) => major)
    councilArticle: CouncilArticle[];

    @OneToMany(() => UniversityEvent, (event) => event.major)
    events: UniversityEvent[];
}
