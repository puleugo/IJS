import { IArticle, } from '@domain/communities/articles/article.interface';

export interface IBoard {
    id: number;
    name: string;
    description: string;
    articlesCount: number;
    isAnonymous: boolean;
    articles: IArticle[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
