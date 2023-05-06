import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '@domain/user/user.entity';
import { ScheduleSet } from '@domain/user/schedule-set.entity';

export interface IUserScheduleSet {
  id: number;
  userId: string;
  scheduleSetId: string;
  user: User;
  scheduleSet: ScheduleSet;
  createdAt: Date;
}
