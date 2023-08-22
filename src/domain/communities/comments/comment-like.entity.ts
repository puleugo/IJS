import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
} from 'typeorm';
import { Comment, } from '@domain/communities/comments/comment.entity';
import { User, } from '@domain/user/user.entity';

@Entity('comment_likes')
export class CommentLike {
    @PrimaryColumn({ type: 'int', })
    commentId: number;

    @ManyToOne(() => {
    	return Comment;
    }, ({ likes, }) => {
    	return likes;
    })
    @JoinColumn({
    	name: 'comment_id',
    	referencedColumnName: 'id',
    })
    comment: Comment;

    @PrimaryColumn({ type: 'uuid', })
    authorId: string;

    @ManyToOne(() => {
    	return User;
    }, ({ commentLikes, }) => {
    	return commentLikes;
    })
    author: User;

    @CreateDateColumn()
    createdAt: Date;
}
