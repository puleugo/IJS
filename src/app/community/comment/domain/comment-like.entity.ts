import {
	CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { User, } from '@app/user/domain/user.entity';

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
