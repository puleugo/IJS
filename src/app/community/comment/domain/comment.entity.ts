import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { User, } from '@app/user/domain/user.entity';
import { CommentLike, } from '@app/community/comment/domain/comment-like.entity';
import { Article, } from '@app/community/article/domain/article.entity';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('increment', { type: 'bigint', })
    id: number;

    @Column({
    	type: 'varchar',
    	length: 200,
    })
    content: string;

    @Column({ type: 'int', })
    articleId: number;

    @ManyToOne(() => Article, ({ comments, }) => comments)
    article: Article;

    @ManyToOne(() => CouncilArticle, ({ comments, }) => comments)
    councilArticle: CouncilArticle;

    @Column({ type: 'uuid', })
    authorId: string;

    @ManyToOne(() => User, ({ comments, }) => comments)
    author: User;

    @Column({
    	type: 'int',
    	default: 0,
    })
    likesCount: number;

    @OneToMany(() => CommentLike, ({ comment, }) => comment)
    likes: CommentLike[];

    @Column({
    	type: 'bigint',
    	nullable: true,
    })
    replyToId: number | null;

    @ManyToOne(() => Comment, ({ replies, }) => replies, { onDelete: 'CASCADE', })
    @JoinColumn({
    	name: 'reply_to_id',
    	referencedColumnName: 'id',
    })
    replyTo: Comment | null;

    @OneToMany(() => Comment, ({ replyTo, }) => replyTo)
    replies: Comment[];

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @Column({
    	type: 'timestamp',
    	nullable: true,
    })
    @Index()
    deletedAt: Date | null;
}
