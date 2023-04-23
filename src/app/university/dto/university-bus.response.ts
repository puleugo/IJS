import {
  UniversityBusProfileCommand,
  UniversityBusResponseCommand,
} from '@app/university/command/university-bus-response.command';

export class UniversityBusResponse implements UniversityBusResponseCommand {
  toSchool: UniversityBusProfileCommand[];
  fromSchool: UniversityBusProfileCommand[];

  constructor({ toSchool, fromSchool }: UniversityBusResponseCommand) {
    this.toSchool = toSchool;
    this.fromSchool = fromSchool;
  }
}
