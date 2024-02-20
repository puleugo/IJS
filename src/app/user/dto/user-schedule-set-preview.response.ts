import { ApiProperty, } from '@nestjs/swagger';
import { UserScheduleSetPreviewResponseType, } from '@app/user/dto/user.type';
import { UserScheduleSet, } from '@app/user/domain/user-schedule-set.entity';

export class UserScheduleSetPreviewResponse
implements UserScheduleSetPreviewResponseType {
    @ApiProperty({
    	description: '시간표 집합의 ID를 가져옵니다.',
    	example: '1234',
    })
    readonly id: string;

    @ApiProperty({
    	description: '시간표 집합의 사용자 수를 가져옵니다.',
    	example: 1,
    })
    readonly userCount: number;

    @ApiProperty({
    	description: '시간표 집합의 생성 시각을 가져옵니다.',
    	example: '2021-01-01T00:00:00.000Z',
    })
    readonly createdAt: Date;

    constructor({ scheduleSet, }: UserScheduleSet) {
    	this.id = scheduleSet.id;
    	this.userCount = scheduleSet.users.length;
    	this.createdAt = scheduleSet.createdAt;
    }
}
