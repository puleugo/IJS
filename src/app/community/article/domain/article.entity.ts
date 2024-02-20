import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	TableInheritance,
	UpdateDateColumn,
} from 'typeorm';
import { User, } from '@app/user/domain/user.entity';
import { ArticleLike, } from '@app/community/article/domain/article-like.entity';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { Board, } from '@app/community/board/domain/board.entity';

@Entity('articles')
@TableInheritance({
	column: {
		type: 'varchar',
		name: 'type',
	},
})
export class Article {
    @PrimaryGeneratedColumn('increment', { type: 'int', })
    id: number;

    @Column({
    	type: 'varchar',
    	length: 255,
    })
    title: string;

    @Column({
    	type: 'varchar',
    	length: 4000,
    })
    content: string;

    @Column({
    	type: 'varchar',
    	length: 255,
    	array: true,
    	nullable: true,
    })
    images: string[];

    @Column({ type: 'int', })
    boardId: number;

    @ManyToOne(() => Board, ({ articles, }) => articles)
    @JoinColumn({
    	name: 'board_id',
    	referencedColumnName: 'id',
    })
    board: Board;

    @Column({ type: 'uuid', })
    authorId: string;

    @ManyToOne(() => User, ({ articles, }) => articles)
    @JoinColumn({
    	name: 'author_id',
    	referencedColumnName: 'id',
    })
    author: User;

    @Column({
    	type: 'int',
    	default: 0,
    })
    viewsCount: number;

    @Column({
    	type: 'int',
    	default: 0,
    })
    commentsCount: number;

    @OneToMany(() => Comment, ({ article, }) => article, { cascade: true, })
    comments: Comment[];

    @Column({
    	type: 'int',
    	default: 0,
    })
    likesCount: number;

    @OneToMany(() => ArticleLike, ({ article, }) => article)
    likes: ArticleLike[];

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, })
    @Index()
    deletedAt: Date | null;
}
