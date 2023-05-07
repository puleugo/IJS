import { UniversityBusProfileCommand } from '@app/university/command/university-bus-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityBusProfileResponse
  implements UniversityBusProfileCommand
{
  @ApiProperty({ example: 1, description: '버스 식별자' })
  id: number;
  @ApiProperty({
    example: '양산(물금)',
    description: '버스 출발지',
  })
  title: string;
  @ApiProperty({
    example: 1150,
    description: '버스 요금',
  })
  price: number;
  @ApiProperty({
    example: '18:10:00',
    description: '버스 출발 시간',
  })
  departedOn: Date;

  constructor({ id, departedOn, price, title }: UniversityBusProfileCommand) {
    this.id = id;
    this.departedOn = departedOn;
    this.price = price;
    this.title = title;
  }
}
