import { UniversityCalendarProfileResponse, } from '@app/university/dto/university-calendar-profile.response';
import { ApiProperty, } from '@nestjs/swagger';
import { MonthlyEventsResponse, UniversityCalendarResponseType, } from '@app/university/university.type';

export class UniversityCalendarResponse
implements UniversityCalendarResponseType {
    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Apr: MonthlyEventsResponse['Apr'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Mar: MonthlyEventsResponse['Mar'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly May: MonthlyEventsResponse['May'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Jun: MonthlyEventsResponse['Jun'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Jul: MonthlyEventsResponse['Jul'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Aug: MonthlyEventsResponse['Aug'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Sep: MonthlyEventsResponse['Sep'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Oct: MonthlyEventsResponse['Oct'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Nov: MonthlyEventsResponse['Nov'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Dec: MonthlyEventsResponse['Dec'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Jan: MonthlyEventsResponse['Jan'];

    @ApiProperty({ type: [UniversityCalendarProfileResponse,], })
    readonly Feb: MonthlyEventsResponse['Feb'];

    constructor({
    	Mar,
    	Apr,
    	May,
    	Jun,
    	Jul,
    	Aug,
    	Sep,
    	Oct,
    	Nov,
    	Dec,
    	Jan,
    	Feb,
    }: UniversityCalendarResponseType) {
    	this.Mar = Mar.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Apr = Apr.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.May = May.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Jun = Jun.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Jul = Jul.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Aug = Aug.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Sep = Sep.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Oct = Oct.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Nov = Nov.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Dec = Dec.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Jan = Jan.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    	this.Feb = Feb.map(
    		(event) => {
    			return new UniversityCalendarProfileResponse(event);
    		}
    	);
    }
}
