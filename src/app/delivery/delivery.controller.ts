import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post
} from '@nestjs/common';
import { DeliveryService } from '@app/delivery/delivery.service';
import { ApiTags } from '@nestjs/swagger';
import { dirxml } from 'console';
import { DeliveryPreviewResponse } from '@app/delivery/dto/delivery-profile.response';

//TODO: 구현
@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  async getDeliveries(): Promise<DeliveryPreviewResponse[]> {
    const deliveries = await this.deliveryService.getDeliveries();
    return deliveries.map(
      (deliveryService) => new DeliveryPreviewResponse(deliveryService),
    );
  }


  @Get(':deliveryId')
  async getDeliveryProfile(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    const delivery = await this.deliveryService.getDeliveryById(deliveryId);
    if (!delivery) {
      console.log('정보가 없습니다');
    }
    return delivery;
  }

  @Post()
  async createDelivery(
    @Body()
    deliveryData: {
      orderName: string;
      orderId: string;
      storeUrl: string;
      orderUrl: string;
      show: boolean;
    },
  ) {
    await this.deliveryService.makeDelivery(deliveryData);
  }

  @Post(':orderId/:userId')
  async joinDelivery(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.deliveryService.joinDelivery(orderId, userId);
  }

  @Delete(':deliveryId')
  async withdrawDelivery(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    const delivery = await this.deliveryService.deleteDelivery(deliveryId);
    return delivery;
  }
}
