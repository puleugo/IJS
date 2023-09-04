import { UniversityMajor, } from './university-major.entity';
import {
	Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { IsUrl, } from 'class-validator';

@Entity('university_notices')
@Index(['title', 'majorId',])
export class UniversityNotice {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column({
    	type: 'char',
    	length: 4000,
    })
    content: string;

    @Column()
    @IsUrl()
    url: string;

    @Column()
    author: string;

    @Column({ type: 'simple-array', })
    files: string[];

    @Column({ default: 0, })
    viewsCount: number;

    @Column({
    	type: 'smallint',
    	nullable: true,
    })
    majorId: number | null;

    @ManyToOne(() => UniversityMajor, ({ notices, }) => notices, { nullable: true, })
    @JoinColumn({ name: 'major_id', })
    major: UniversityMajor;

    @Column('timestamp')
    wroteAt: Date;
}
