import {
	Column, Entity, PrimaryColumn,
} from 'typeorm';

@Entity('user_settings')
export class UserSetting {
  @PrimaryColumn('uuid')
  userId: string;

  @Column('boolean', { default: false, })
  isIgnoredCouncilNotification: boolean;

  @Column('boolean', { default: false, })
  isIgnoredMealNotification: boolean;

  @Column('boolean', { default: false, })
  isIgnoredNoticeNotification: boolean;
}
