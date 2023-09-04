import {
	Controller, Ip, Post,
} from '@nestjs/common';
import { ApiTags, } from '@nestjs/swagger';
import { LogResponseTypes, } from '@common/type/log-respone.type';
import { InjectRedis, Redis, } from '@nestjs-modules/ioredis';

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
	constructor(@InjectRedis() private readonly redis: Redis) {}

    @Post()
	healthCheck(@Ip() ip: string): LogResponseTypes {
		return {
			status: 'success',
			message: '확인되었습니다.',
			ip,
			timestamp: new Date(),
		};
	}

    @Post('redis')
    async healthCheckRedis(@Ip() ip: string): Promise<LogResponseTypes> {
    	await this.redis.set('key', 'Redis data');
    	const redisData = await this.redis.get('key');

    	return {
    		status: 'success',
    		message: `${redisData}가 확인되었습니다.`,
    		ip,
    		timestamp: new Date(),
    	};
    }
}
