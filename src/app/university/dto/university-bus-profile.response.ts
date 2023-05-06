import { UniversityBusProfileCommand } from '@app/university/command/university-bus-response.command';

export class UniversityBusProfileResponse
  implements UniversityBusProfileCommand
{
  id: number;
  title: string;
  price: number;
  departedOn: Date;

  constructor({ id, departedOn, price, title }: UniversityBusProfileCommand) {
    this.id = id;
    this.departedOn = departedOn;
    this.price = price;
    this.title = title;
  }
}
