export class DeliveryPreviewResponse {
  id: number;
  orderName: string;
  orderUrl: string;
  storeUrl: string;
  createdAt: Date;
  deliveryUrl: string;

  constructor({
    id,
    orderName,
    orderUrl,
    storeUrl,
    deliveryUrl,
    createdAt,
  }: {
    id: number;
    orderName: string;
    orderUrl: string;
    storeUrl: string;
    deliveryUrl: string;
    createdAt: Date;
  }) {
    this.id = id;
    this.orderName = orderName;
    this.orderUrl = orderUrl;
    this.storeUrl = storeUrl;
    this.createdAt = createdAt;
    this.deliveryUrl = deliveryUrl;
  }
}

export type DeliveryData = {
  orderName: string;
  orderId: string;
  storeUrl: string;
  orderUrl: string;
};
