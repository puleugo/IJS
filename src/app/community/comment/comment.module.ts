import { Module, } from '@nestjs/common';
import { CommentController, } from './comment.controller';
import { CommentService, } from './comment.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { CommentLike, } from '@domain/communities/comments/comment-like.entity';
import { BoardModule, } from '@app/community/board/board.module';
import { ArticleModule, } from '@app/community/article/article.module';
import { Comment, } from '@domain/communities/comments/comment.entity';
import { Article, } from '@domain/communities/articles/article.entity';
import { UserModule, } from '@app/user/user.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Article,
			Comment,
			CommentLike,
		]),
		BoardModule,
		ArticleModule,
		UserModule,
	],
	controllers: [CommentController,],
	providers: [CommentService,],
	exports: [CommentService,],
})
export class CommentModule {

}
