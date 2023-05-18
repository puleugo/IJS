import { Delivery } from '@domain/delivery/delivery.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
//import { DeliveryPreviewResponse } from '@common/dto/delivery/delivery.dto';

import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  OneToMany,
  Repository,
} from 'typeorm';
import { User } from '@domain/user/user.entity';
import {
  UserNotFoundException,
  DuplicatiedUserException,
} from '@domain/error/user.error';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getDeliveries(): Promise<Delivery[]> {
    return await this.deliveryRepository.find({
      where: { createdAt: MoreThan(new Date(Date.now() - 10 * 60 * 1000)) },
    });
  }

  async getDeliveryById(deliveryId: number): Promise<Delivery> {
    if (!deliveryId) throw new NotFoundException();
    else{
      return await this.deliveryRepository.findOne({ where: { id: deliveryId } });
    }
  }

  async makeDelivery(delivery: {
    orderName: string;
    orderId: string;
    storeUrl: string;
    orderUrl: string;
  }): Promise<Delivery> {
    return await this.deliveryRepository.save(delivery);
  }

  async joinDelivery(orderId: number, userId: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: orderId },
      relations: {
        users: true,
      },
    });
    const finduser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!finduser) throw new UserNotFoundException();
    const updatedDelivery = await this.deliveryRepository.save({
      ...delivery,
      users: [...delivery.users, finduser],
    });
    return updatedDelivery;
  }

  async deleteDelivery(deliveryId: number): Promise<void> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
    }); 

    await this.deliveryRepository.softDelete(deliveryId);
  }
}
