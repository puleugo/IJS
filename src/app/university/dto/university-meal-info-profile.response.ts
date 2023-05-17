import {
  UniversityMealInfo,
  UniversityMealInfoProfileResponseCommand,
} from '@app/university/command/university-meal-info-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';
import { IUniversityMealInfo } from '@domain/university/university-meal.interface';

export class UniversityMealInfoProfileResponse
  implements UniversityMealInfoProfileResponseCommand
{
  @ApiProperty({
    example: [
      {
        courseA: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
        courseB: [
          '고구마치즈돈까스',
          '직접구운크로와상+딸기잼',
          '양배추샐러드+드레싱',
          '옥수수스프',
        ],
        courseC: ['닭다리칼국수+겨자부추장'],
      },
    ],
    description: '월요일 식단 정보, 혹은 오늘의 식단 정보',
  })
  '0': UniversityMealInfo;
  @ApiProperty({
    example: [
      {
        courseA: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
        courseB: [
          '고구마치즈돈까스',
          '직접구운크로와상+딸기잼',
          '양배추샐러드+드레싱',
          '옥수수스프',
        ],
        courseC: ['닭다리칼국수+겨자부추장'],
      },
    ],
    description: '화요일 식단 정보',
  })
  '1'?: UniversityMealInfo;
  @ApiProperty({
    example: [
      {
        courseA: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
        courseB: [
          '고구마치즈돈까스',
          '직접구운크로와상+딸기잼',
          '양배추샐러드+드레싱',
          '옥수수스프',
        ],
        courseC: ['닭다리칼국수+겨자부추장'],
      },
    ],
    description: '수요일 식단 정보',
  })
  '2'?: UniversityMealInfo;
  @ApiProperty({
    example: [
      {
        courseA: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
        courseB: [
          '고구마치즈돈까스',
          '직접구운크로와상+딸기잼',
          '양배추샐러드+드레싱',
          '옥수수스프',
        ],
        courseC: ['닭다리칼국수+겨자부추장'],
      },
    ],
    description: '목요일 식단 정보',
  })
  '3'?: UniversityMealInfo;
  @ApiProperty({
    example: [
      {
        courseA: ['참치야채비빔밥', '뚝배기미니우동', '해쉬포테이토+케찹'],
        courseB: [
          '고구마치즈돈까스',
          '직접구운크로와상+딸기잼',
          '양배추샐러드+드레싱',
          '옥수수스프',
        ],
        courseC: ['닭다리칼국수+겨자부추장'],
      },
    ],
    description: '금요일 식단 정보',
  })
  '4'?: UniversityMealInfo;

  @ApiProperty({
    example: 'weekly',
    description: '시간 범위',
  })
  time_range: 'weekly' | 'today';

  constructor(meals: IUniversityMealInfo[]) {
    for (let i = 0; i < meals.length; i++) {
      this[i] = {
        courseA: meals[i].courseA.menu,
        courseB: meals[i].courseB.menu,
        courseC: meals[i].courseC.menu,
      };
    }
    if (meals.length === 1) this.time_range = 'today';
    else this.time_range = 'weekly';
  }
}
