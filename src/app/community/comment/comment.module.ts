import { Module, } from '@nestjs/common';
import { CommentController, } from './comment.controller';
import { CommentService, } from './comment.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { CommentLike, } from '@app/community/comment/domain/comment-like.entity';
import { BoardModule, } from '@app/community/board/board.module';
import { ArticleModule, } from '@app/community/article/article.module';
import { Comment, } from '@app/community/comment/domain/comment.entity';
import { Article, } from '@app/community/article/domain/article.entity';
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
