import { Document, ObjectId, Schema, model } from "mongoose";

interface OrderI extends Document {
  orderID: string;
  userDetails: {
    _id: ObjectId;
    fullName: string;
    email: string;
  };
  orderItems: [orderItemI];
  shippingAddress: string;
  paymentDetails: PaymentI;
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered";
  orderCost: orderCostI;
}
export interface PaymentI extends Document {
  paymentStatus: "Pending" | "Paid" | "Failed";
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
export interface orderItemI extends Document {
  productId: ObjectId;
  quantity: number;
}

export interface orderCostI extends Document {
  rainFee: number;
  platformFee: number;
  deliveryFee: number;
  subTotal: number;
  cartFee: number;
  totalCost: number;
}

const OrderSchema = new Schema<OrderI>({
  orderID: { type: String },
  userDetails: {
    _id: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    fullName: { type: String },
    email: { type: String },
  },
  shippingAddress: { type: String, required: true },
  paymentDetails: {
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpay_order_id: { type: String },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },
  },
  orderStatus: {
    type: String,
    enum: ["Pending" , "Processing" , "Shipped" , "Delivered"],
    default: "Pending",
  },
  orderItems: [
    {
      _id: { type: Schema.Types.ObjectId, required: true, ref: "product" },
      quantity: { type: Number, required: true },
    },
  ],
  orderCost: {
    rainFee: { type: Number, required: true, default: 0 },
    platformFee: { type: Number, required: true, default: 0 },
    subTotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    totalCost: { type: Number, required: true },
  },
});

const OrderModel = model<OrderI>("order", OrderSchema);

export default OrderModel;
