import { Controller, Ip, Post } from '@nestjs/common';

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
