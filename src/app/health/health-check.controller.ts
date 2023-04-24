import { Controller, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  @Post()
  healthCheck(@Ip() ip: string) {
    return {
      message: 'OK',
      ip: ip,
      date: new Date(),
    };
  }
}
