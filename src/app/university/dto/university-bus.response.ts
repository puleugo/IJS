import {
  UniversityBusProfileCommand,
  UniversityBusResponseCommand,
} from '@app/university/command/university-bus-response.command';
import { UniversityBusProfileResponse } from '@app/university/dto/university-bus-profile.response';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityBusResponse implements UniversityBusResponseCommand {
  @ApiProperty({
    type: [UniversityBusProfileResponse],
    description: '학교에 도착하는 버스',
  })
  toSchool: UniversityBusProfileCommand[];
  @ApiProperty({
    type: [UniversityBusProfileResponse],
    description: '학교에서 출발하는 버스',
  })
  fromSchool: UniversityBusProfileCommand[];

  constructor({ toSchool, fromSchool }: UniversityBusResponseCommand) {
    this.toSchool = toSchool.map(
      (bus) => new UniversityBusProfileResponse(bus),
    );
    this.fromSchool = fromSchool.map(
      (bus) => new UniversityBusProfileResponse(bus),
    );
  }
}
