import { ChildEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Article } from '@domain/communities/articles/article.entity';
import { UniversityMajor } from '@domain/university/university-major.entity';

@Entity('council_articles')
@ChildEntity()
export class CouncilArticle extends Article {
  @Column()
  majorId: number;

  @ManyToOne(() => UniversityMajor, ({ councilArticle }) => councilArticle)
  @JoinColumn({ name: 'major_id', referencedColumnName: 'id' })
  major: UniversityMajor;
}
