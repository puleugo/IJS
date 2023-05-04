import { Controller, Ip, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogResponseTypes } from '@infrastructure/types/log-respone.types';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  @Post()
  healthCheck(@Ip() ip: string): LogResponseTypes {
    return {
      status: 'success',
      message: '확인되었습니다.',
      ip,
      timestamp: new Date(),
    };
  }
}
