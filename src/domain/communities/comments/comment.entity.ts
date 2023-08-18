import { IComment } from '@domain/communities/comments/comment.interface';
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
import { User } from '@domain/user/user.entity';
import { CommentLike } from '@domain/communities/comments/comment-like.entity';
import { Article } from '@domain/communities/articles/article.entity';
import { CouncilArticle } from '@domain/communities/articles/council-article.entity';

@Entity('comments')
export class Comment implements IComment {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  content: string;

  @Column({ type: 'int' })
  articleId: number;

  @ManyToOne(() => Article, ({ comments }) => comments)
  article: Article;

  @ManyToOne(() => CouncilArticle, ({ comments }) => comments)
  councilArticle: CouncilArticle;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, ({ comments }) => comments)
  author: User;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @OneToMany(() => CommentLike, ({ comment }) => comment)
  likes: CommentLike[];

  @Column({ type: 'bigint', nullable: true })
  replyToId: number | null;

  @ManyToOne(() => Comment, ({ replies }) => replies, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reply_to_id', referencedColumnName: 'id' })
  replyTo: Comment | null;

  @OneToMany(() => Comment, ({ replyTo }) => replyTo)
  replies: Comment[];

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;
}
