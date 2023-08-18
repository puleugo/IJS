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
import { IArticle } from '@domain/communities/articles/article.interface';
import { Board } from '@domain/communities/boards/board.entity';
import { User } from '@domain/user/user.entity';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { Comment } from '@domain/communities/comments/comment.entity';

@Entity('articles')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Article implements IArticle {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 4000 })
  content: string;

  @Column({ type: 'varchar', length: 255, array: true, nullable: true })
  images: string[];

  @Column({ type: 'int' })
  boardId: number;

  @ManyToOne(() => Board, ({ articles }) => articles)
  @JoinColumn({ name: 'board_id', referencedColumnName: 'id' })
  board: Board;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, ({ articles }) => articles)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: User;

  @Column({ type: 'int', default: 0 })
  viewsCount: number;

  @Column({ type: 'int', default: 0 })
  commentsCount: number;

  @OneToMany(() => Comment, ({ article }) => article, {
    cascade: true,
  })
  comments: Comment[];

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @OneToMany(() => ArticleLike, ({ article }) => article)
  likes: ArticleLike[];

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  @Index()
  deletedAt: Date | null;
}
