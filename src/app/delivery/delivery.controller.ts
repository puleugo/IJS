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
import { DeliveryPreviewResponse } from '@app/delivery/dto/delivery-profile.response';

@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  async getDeliveries(): Promise<DeliveryPreviewResponse[]> {
    const deliveries = await this.deliveryService.getDeliveries();
    return deliveries.map(
      (delivery) => new DeliveryPreviewResponse(delivery),
    );
  }


  @Get(':deliveryId')
  async getDeliveryProfile(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    const delivery = await this.deliveryService.getDeliveryById(deliveryId);
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
    },
  ) {
    await this.deliveryService.makeDelivery(deliveryData);
  }

  @Post(':orderId/:userId')
  async joinDelivery(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    const join = await this.deliveryService.joinDelivery(orderId, userId);
    return join;
  }

  @Delete(':deliveryId')
  async withdrawDelivery(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    const delivery = await this.deliveryService.deleteDelivery(deliveryId);
    return delivery;
  }
}
