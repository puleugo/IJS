import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '@domain/communities/comments/comment.entity';
import { User } from '@domain/user/user.entity';

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'int' })
  commentId: number;

  @ManyToOne(() => Comment, ({ likes }) => likes)
  @JoinColumn({ name: 'comment_id', referencedColumnName: 'id' })
  comment: Comment;

  @Column({ type: 'uuid' })
  authorId: string;

  @ManyToOne(() => User, ({ commentLikes }) => commentLikes)
  author: User;

  @CreateDateColumn()
  createdAt: Date;
}
