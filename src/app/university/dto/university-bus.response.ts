import { UniversityBusProfileResponse, } from '@app/university/dto/university-bus-profile.response';
import { ApiProperty, } from '@nestjs/swagger';
import { UniversityBusProfileResponseType, UniversityBusResponseType, } from '@app/university/university.type';

export class UniversityBusResponse implements UniversityBusResponseType {
    @ApiProperty({
    	type: [UniversityBusProfileResponse,],
    	description: '학교에 도착하는 버스',
    })
    readonly toSchool: UniversityBusProfileResponseType[];
    @ApiProperty({
    	type: [UniversityBusProfileResponse,],
    	description: '학교에서 출발하는 버스',
    })
    readonly fromSchool: UniversityBusProfileResponseType[];

    constructor({ toSchool, fromSchool, }: UniversityBusResponseType) {
    	this.toSchool = toSchool.map(
    		(bus) => {
    			return new UniversityBusProfileResponse(bus);
    		}
    	);
    	this.fromSchool = fromSchool.map(
    		(bus) => {
    			return new UniversityBusProfileResponse(bus);
    		}
    	);
    }
}
