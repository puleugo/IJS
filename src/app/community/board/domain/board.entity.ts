import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Article, } from '@app/community/article/domain/article.entity';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';

@Entity('boards')
export class Board {
    @PrimaryGeneratedColumn('increment', { type: 'smallint', })
    id: number;

    @Column({
    	type: 'varchar',
    	length: 255,
    })
    name: string;

    @Column({
    	type: 'varchar',
    	length: 255,
    })
    description: string;

    @Column({
    	type: 'int',
    	default: 0,
    })
    articlesCount: number;

    @Column({
    	type: 'boolean',
    	default: false,
    })
    isAnonymous: boolean;

    @Column({
    	type: 'boolean',
    	default: false,
    })
    isCouncil: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, })
    @Index()
    deletedAt: Date | null;

    @OneToMany(() => Article, ({ board, }) => board, { cascade: true, })
    articles: Article[];

    @OneToMany(() => CouncilArticle, ({ board, }) => board, { cascade: true, })
    councilArticles: CouncilArticle[];
}
