import {
  UniversityBusProfileCommand,
  UniversityBusResponseCommand,
} from '@app/university/command/university-bus-response.command';
import { UniversityBusProfileResponse } from '@app/university/dto/university-bus-profile.response';

export class UniversityBusResponse implements UniversityBusResponseCommand {
  toSchool: UniversityBusProfileCommand[];
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
