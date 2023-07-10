import { Module } from '@nestjs/common';
import { BoardModule } from '@app/community/board/board.module';
import { ArticleModule } from '@app/community/article/article.module';
import { CommentModule } from '@app/community/comment/comment.module';

@Module({
  imports: [BoardModule, ArticleModule, CommentModule],
})
export class CommunityModule {}
