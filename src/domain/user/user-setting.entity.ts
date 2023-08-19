import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IUserSetting } from '@domain/user/user-setting.interface';

@Entity('user_settings')
export class UserSetting implements IUserSetting {
  @PrimaryColumn('uuid')
  userId: string;

  @Column('boolean', { default: false })
  isIgnoredCouncilNotification: boolean;

  @Column('boolean', { default: false })
  isIgnoredGeneralNotification: boolean;

  @Column('boolean', { default: false })
  isIgnoredMealNotification: boolean;

  @Column('boolean', { default: false })
  isIgnoredNoticeNotification: boolean;
}
