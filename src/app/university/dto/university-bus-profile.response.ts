import { ApiProperty } from '@nestjs/swagger';
import { UniversityBusProfileResponseType } from '@app/university/university.type';

export class UniversityBusProfileResponse
  implements UniversityBusProfileResponseType
{
  @ApiProperty({ example: 1, description: '버스 식별자' })
  readonly id: number;

  @ApiProperty({
    example: '양산(물금)',
    description: '버스 출발지',
  })
  readonly title: string;

  @ApiProperty({
    example: 1150,
    description: '버스 요금',
  })
  readonly price: number;

  @ApiProperty({
    example: '18:10:00',
    description: '버스 출발 시간',
  })
  readonly departedOn: Date;

  constructor({
    id,
    departedOn,
    price,
    title,
  }: UniversityBusProfileResponseType) {
    this.id = id;
    this.departedOn = departedOn;
    this.price = price;
    this.title = title;
  }
}
