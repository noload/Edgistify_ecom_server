import { orderCostI, orderItemI } from "../models/Order";

export interface PlaceOrderRequestDTO {
  shippingAddress: string;
  orderItems: [orderItemI];
  orderCost: orderCostI;
}
