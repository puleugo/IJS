import { User } from '@domain/user/user.entity';
import { identity } from 'rxjs';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column() 
  orderName: string;

  @Column()
  storeUrl: string;

  @Column()
  orderUrl: string;

  @OneToMany(() => User, (user) => user.delivery)
  users : User[]
  
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}