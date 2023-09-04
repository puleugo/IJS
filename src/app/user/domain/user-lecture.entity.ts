import { User, } from '@app/user/domain/user.entity';
import { UniversityLecture, } from '@app/university/domain/university-lecture.entity';
import {
	Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique,
} from 'typeorm';

@Entity('user_lectures')
@Unique(['userId', 'lectureId',])
export class UserLecture {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('uuid')
    userId: string;

    @Column('int')
    lectureId: number;

    @ManyToOne(() => User, ({ lectures, }) => lectures)
    @JoinColumn({
    	name: 'user_id',
    	referencedColumnName: 'id',
    })
    user: User;

    @ManyToOne(() => UniversityLecture, ({ users, }) => users)
    @JoinColumn({
    	name: 'lecture_id',
    	referencedColumnName: 'id',
    })
    lecture: UniversityLecture;
}
