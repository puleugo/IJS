import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentLike } from '@domain/communities/comments/comment-like.entity';
import { BoardModule } from '@app/communities/board/board.module';
import { ArticleModule } from '@app/communities/article/article.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, CommentLike]),
    BoardModule,
    ArticleModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
