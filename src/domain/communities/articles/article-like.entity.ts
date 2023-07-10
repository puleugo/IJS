import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Article } from '@domain/communities/articles/article.entity';
import { User } from '@domain/user/user.entity';

@Entity('article_likes')
export class ArticleLike {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  articleId: number;

  @ManyToOne(() => Article, ({ likes }) => likes)
  article: Article;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, ({ articleLikes }) => articleLikes)
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
