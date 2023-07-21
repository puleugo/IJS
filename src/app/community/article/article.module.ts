import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleLike } from '@domain/communities/articles/article-like.entity';
import { Article } from '@domain/communities/articles/article.entity';
import { BoardModule } from '@app/community/board/board.module';
import { UserModule } from '@app/user/user.module';
import { ArticlePhotoClient } from '@app/community/article/utils/article-photo.client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleLike]),
    BoardModule,
    UserModule,
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    {
      provide: 'ArticlePhotoClient',
      useClass: ArticlePhotoClient,
    },
  ],
  exports: [ArticleService],
})
export class ArticleModule {}
