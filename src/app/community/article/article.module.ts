import { Module, } from '@nestjs/common';
import { ArticleController, } from './article.controller';
import { ArticleService, } from './service/article.service';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { ArticleLike, } from '@app/community/article/domain/article-like.entity';
import { Article, } from '@app/community/article/domain/article.entity';
import { BoardModule, } from '@app/community/board/board.module';
import { UserModule, } from '@app/user/user.module';
import { ArticlePhotoClient, } from '@app/community/article/service/article-photo.client';
import { CouncilArticle, } from '@app/community/article/domain/council-article.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([Article,
			CouncilArticle,
			ArticleLike,]),
		BoardModule,
		UserModule,
	],
	controllers: [ArticleController,],
	providers: [
		ArticleService,
		{
			provide: 'ArticlePhotoClient',
			useClass: ArticlePhotoClient,
		},
	],
	exports: [ArticleService,],
})
export class ArticleModule {
}
