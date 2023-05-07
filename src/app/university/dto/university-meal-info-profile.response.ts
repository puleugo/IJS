import { UniversityMealInfoProfileResponseCommand } from '@app/university/command/university-meal-info-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityMealInfoProfileResponse
  implements UniversityMealInfoProfileResponseCommand
{
  @ApiProperty({
    example: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
    description: 'A코스 식단',
  })
  courseA: string[];
  @ApiProperty({
    example: [
      '고구마치즈돈까스',
      '직접구운크로와상+딸기잼',
      '양배추샐러드+드레싱',
      '옥수수스프',
    ],
    description: 'B코스 식단',
  })
  courseB: string[];
  @ApiProperty({
    example: ['닭다리칼국수+겨자부추장'],
    description: 'C코스 식단',
  })
  courseC: string[];

  constructor({
    courseA,
    courseB,
    courseC,
  }: UniversityMealInfoProfileResponseCommand) {
    this.courseA = courseA;
    this.courseB = courseB;
    this.courseC = courseC;
  }
}
