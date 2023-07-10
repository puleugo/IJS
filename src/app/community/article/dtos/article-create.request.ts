import { ArticleCreateCommand } from '@app/community/article/commands/article-create.command';

export class ArticleCreateRequest implements Partial<ArticleCreateCommand> {
  title: string;
  content: string;
  images: string[];
}
