import {
	Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post,
} from '@nestjs/common';
import { DeliveryService, } from '@app/delivery/delivery.service';
import { ApiExcludeController, ApiTags, } from '@nestjs/swagger';
import { DeliveryData, DeliveryPreviewResponse, } from '@app/delivery/dto/delivery-profile.response';
import { Delivery, } from '@domain/delivery/delivery.entity';

@ApiTags('Delivery')
@ApiExcludeController()
@Controller('deliveries')
export class DeliveryController {
	constructor(private readonly deliveryService: DeliveryService) {
	}

    @Get()
	async getDeliveries(): Promise<DeliveryPreviewResponse[]> {
		const deliveries = await this.deliveryService.getDeliveries();

		return deliveries.map(
			(delivery) => {
				return new DeliveryPreviewResponse(delivery);
			}
		);
	}

    @Get(':deliveryId')
    async getDeliveryProfile(
        @Param('deliveryId', ParseIntPipe) deliveryId: number
    ): Promise<Delivery> {
    	return  await this.deliveryService.getDeliveryById(deliveryId);
    }

    @Post()
    async createDelivery(
        @Body() deliveryData: DeliveryData
    ): Promise<void> {
    	await this.deliveryService.makeDelivery(deliveryData);
    }

    @Post(':orderId/:userId')
    async joinDelivery(
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<Delivery> {
    	return await this.deliveryService.joinDelivery(orderId, userId);

    }

    @Delete(':deliveryId')
    async withdrawDelivery(
        @Param('deliveryId', ParseIntPipe) deliveryId: number
    ): Promise<void> {
    	return  await this.deliveryService.deleteDelivery(deliveryId);
    }
}
