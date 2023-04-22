import { UniversityBusResponseCommand } from '@app/university/command/university-bus-response.command';

export class UniversityBusResponse implements UniversityBusResponseCommand {
  toSchool: Date[];
  fromSchool: Date[];

  constructor({ toSchool, fromSchool }: UniversityBusResponseCommand) {
    this.toSchool = toSchool;
    this.fromSchool = fromSchool;
  }
}
