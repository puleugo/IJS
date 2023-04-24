import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsUrl } from 'class-validator';
import { IUniversityProgram } from '@domain/university/university-program.interface';

@Entity('university_programs')
export class UniversityProgram implements IUniversityProgram {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  title: string;

  @Column()
  author: string;

  @Column('text')
  @IsUrl()
  url: string;

  @Column()
  endAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @AfterLoad()
  updateToFullUrl() {
    this.url = `https://edu.inje.ac.kr/program/E${this.url}`;
  }
}
