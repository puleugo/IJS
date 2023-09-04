import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserAuth, } from './user-auth.entity';
import { ScheduleSet, } from '@app/user/domain/schedule-set.entity';
import { UserScheduleSet, } from '@app/user/domain/user-schedule-set.entity';
import { UserLecture, } from '@app/user/domain/user-lecture.entity';
import { UniversityMajor, } from '@app/university/domain/university-major.entity';
import { IsEmail, } from 'class-validator';
import { Article, } from '@app/community/article/domain/article.entity';
import { ArticleLike, } from '@app/community/article/domain/article-like.entity';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { CommentLike, } from '@app/community/comment/domain/comment-like.entity';
import { RoleEnum, } from '@app/auth/authorization/type';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';
import { UserSetting, } from '@app/user/domain/user-setting.entity';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
    	type: 'boolean',
    	default: false,
    })
    isVerified: boolean;

    @Column('int', { nullable: true, })
    majorId: number | null;

    @Column('varchar', {
    	nullable: true,
    	length: 20,
    })
    name: string | null;

    @Column('varchar', {
    	unique: true,
    	nullable: true,
    	length: 20,
    })
    schoolId: string | null;

    @Column('varchar', {
    	array: true,
    	length: 20,
    	default: [RoleEnum.USER,],
    })
    role: RoleEnum[];

    @ManyToOne(() => UniversityMajor, ({ notices, }) => notices)
    major: UniversityMajor;

    @Column('varchar', {
    	unique: true,
    	nullable: true,
    	length: 255,
    })
    @IsEmail()
    schoolEmail: string | null;

    @OneToMany(() => UserAuth, ({ user, }) => user)
    auth: UserAuth[];

    @OneToMany(() => UserScheduleSet, ({ user, }) => user)
    userScheduleSets: UserScheduleSet[];

    @OneToMany(() => ScheduleSet, ({ owner, }) => owner)
    createdScheduleSets: ScheduleSet[];

    @OneToMany(() => UserLecture, ({ user, }) => user)
    lectures: UserLecture[];

    @OneToMany(() => CouncilArticle, ({ author, }) => author)
    councilArticles: CouncilArticle[];

    @OneToMany(() => Article, ({ author, }) => author)
    articles: Article[];

    @OneToMany(() => ArticleLike, ({ author, }) => author)
    articleLikes: ArticleLike[];

    @OneToMany(() => Comment, ({ author, }) => author)
    comments: Comment[];

    @OneToMany(() => CommentLike, ({ author, }) => author)
    commentLikes: CommentLike[];

    @OneToOne(() => UserSetting, { cascade: true, })
    @JoinColumn()
    settings: UserSetting;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, })
    deletedAt: Date | null;
}
