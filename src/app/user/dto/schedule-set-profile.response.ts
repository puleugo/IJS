import { ApiProperty, } from '@nestjs/swagger';
import { ScheduleSetProfileResponseType, } from '@app/user/dto/user.type';

export class ScheduleSetProfileResponse
implements ScheduleSetProfileResponseType {
    @ApiProperty({
    	description: '시간표 집합의 ID를 가져옵니다.',
    	example: '1234',
    })
    readonly scheduleSetId: string;

    @ApiProperty({
    	description: '시간표 집합의 QR 코드를 가져옵니다.',
    	example: 'https://example.com/qr/1234',
    })
    readonly qrUrl: string;

    constructor({ scheduleSetId, qrUrl, }: ScheduleSetProfileResponseType) {
    	this.scheduleSetId = scheduleSetId;
    	this.qrUrl = qrUrl;
    }
}
