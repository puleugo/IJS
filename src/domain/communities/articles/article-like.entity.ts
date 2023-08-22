import {
	CreateDateColumn, Entity, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Article, } from '@domain/communities/articles/article.entity';
import { User, } from '@domain/user/user.entity';
import { CouncilArticle, } from '@domain/communities/articles/council-article.entity';

@Entity('article_likes')
export class ArticleLike {
    @PrimaryColumn({ type: 'int', })
    articleId: number;

    @ManyToOne(() => Article, ({ likes, }) => likes)
    article: Article;

    @ManyToOne(() => CouncilArticle, ({ likes, }) => likes)
    councilArticle: CouncilArticle;

    @PrimaryColumn({ type: 'uuid', })
    authorId: string;

    @ManyToOne(() => User, ({ articleLikes, }) => articleLikes)
    author: User;

    @CreateDateColumn()
    createdAt: Date;
}
