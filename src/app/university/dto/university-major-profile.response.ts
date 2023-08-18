import { UniversityMajorProfileResponseCommand } from '@app/university/command/university-major-profile-response.command';
import { ApiProperty } from '@nestjs/swagger';

export class UniversityMajorProfileResponse
  implements UniversityMajorProfileResponseCommand
{
  @ApiProperty({
    example: 1,
    description: '학과 식별자',
  })
  id: number;

  @ApiProperty({
    example: '컴퓨터공학과',
    description: '학과명',
  })
  name: string;

  constructor({ id, name }: UniversityMajorProfileResponseCommand) {
    this.id = id;
    this.name = name;
  }
}
