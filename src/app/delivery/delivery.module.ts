import { Module } from '@nestjs/common';
import { DeliveryController } from '@app/delivery/delivery.controller';
import { DeliveryService } from '@app/delivery/delivery.service';

@Module({
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
