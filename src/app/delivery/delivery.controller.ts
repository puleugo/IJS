import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { DeliveryService } from '@app/delivery/delivery.service';
import { ApiTags } from '@nestjs/swagger';

//TODO: 구현
@ApiTags('Delivery')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get()
  async getDeliveries() {
    return;
  }

  @Get(':deliveryId')
  async getDeliveryProfile(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    return;
  }

  @Post()
  async createDelivery() {
    return;
  }

  @Post(':deliveryId')
  async joinDelivery(@Param('deliveryId', ParseIntPipe) deliveryId: number) {
    return;
  }

  @Put(':deliveryId')
  async updateDelivery(@Param('deliveryId', ParseIntPipe) deliveryId: number) {
    return;
  }

  @Delete(':deliveryId')
  async withdrawDelivery(
    @Param('deliveryId', ParseIntPipe) deliveryId: number,
  ) {
    return;
  }
}
