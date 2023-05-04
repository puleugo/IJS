import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserScheduleSet } from '@domain/user/user-schedule-set.entity';
import { User } from '@domain/user/user.entity';

export interface IScheduleSet {
  id: string;
  ownerId: string;
  owner: User;
  users: UserScheduleSet[];
  createdAt: Date;
}
