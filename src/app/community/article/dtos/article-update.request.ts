import { ArticleUpdateCommand } from '@app/community/article/commands/article-update.command';

export class ArticleUpdateRequest implements Partial<ArticleUpdateCommand> {
  title: string;
  content: string;
  images: string[];
}
