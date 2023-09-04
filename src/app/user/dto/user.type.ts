import { IUserSetting, } from '@app/user/domain/user-setting.interface';
import { UniversityLectureProfileResponseType, } from '@app/university/dto/university.type';
import { UserScheduleRoleEnum, } from '@app/user/domain/user-schedule-role.enum';
import { User, } from '@app/user/domain/user.entity';
import { ScheduleSet, } from '@app/user/domain/schedule-set.entity';

export type ScheduleSetProfileResponseType = {
    scheduleSetId: string;
    qrUrl: string;
};

export type UserPreviewResponseType = Pick<User, 'id'>;

export type UserProfileResponseType = Pick<
    User,
    'id' | 'name' | 'isVerified' | 'majorId' | 'schoolId' | 'schoolEmail'
> & {
    majorName: string;
    settings: Pick<
        IUserSetting,
        | 'isIgnoredMealNotification'
        | 'isIgnoredCouncilNotification'
        | 'isIgnoredNoticeNotification'
    >;
};

export type UserScheduleProfileResponseType = {
    lectures: { [day: string]: UniversityLectureProfileResponseType[] };
};

type userCountInfo = { userCount: number };

export type UserScheduleSetPreviewResponseType = Pick<
    ScheduleSet,
    'id' | 'createdAt'
> &
    userCountInfo;

export type UserScheduleSetProfileResponseType = {
    userId: string;
    role: UserScheduleRoleEnum;
} & UserScheduleProfileResponseType;

export type UserUpdateSettingRequestType = Partial<
    Pick<
        IUserSetting,
        | 'isIgnoredCouncilNotification'
        | 'isIgnoredMealNotification'
        | 'isIgnoredNoticeNotification'
    >
>;

export type UserVerificationRequestType = Pick<
    User,
    'name' | 'schoolId' | 'majorId'
>;

export type UserSchoolDataUpdateRequestType = Partial<Pick<User, 'name' | 'schoolId' | 'schoolEmail'>>
