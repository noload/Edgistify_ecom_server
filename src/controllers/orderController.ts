import { Request, Response } from "express";
import { PlaceOrderRequestDTO } from "../dtos/orderDTO";
import UserModel from "../models/User";
import razorpay from "../services/razorpay";
import OrderModel, { PaymentI } from "../models/Order";
import crypto from "crypto";
const placeOrder = async (
  req: Request<{}, {}, PlaceOrderRequestDTO>,
  res: Response
): Promise<any> => {
  try {
    const { shippingAddress, orderCost, orderItems } =
      req.body as PlaceOrderRequestDTO;

    const userId = (req as any).user.userId;

    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userDetails = {
      _id: findUser._id,
      fullName: findUser.fullName,
      email: findUser.email,
    };
    const options = {
      amount: Number(orderCost.totalCost) * 100,
      currency: "INR",
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new OrderModel({
      userDetails,
      shippingAddress,
      orderCost,
      orderItems,
      orderID: order.id,
    });
    await newOrder.save();
    return res
      .status(200)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.log(`Error in order Place`, error);
    return res.status(500).json({ message: "Order failed to create" });
  }
};

const validatePayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac(
      "sha256",
      process.env.key_secret as string
    );

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ message: "Transaction not legit!" });

    const paymentDetails = {
      paymentStatus: "Paid",
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    };
    const order = await OrderModel.findOne({ orderID: razorpayOrderId });
    if (order) {
      order.orderStatus = "Processing";
      order.paymentDetails.razorpay_order_id = razorpayOrderId;
      order.paymentDetails.razorpay_payment_id = razorpayPaymentId;
      order.paymentDetails.razorpay_signature = razorpaySignature;
      await order.save()
    }
    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export default { placeOrder, validatePayment };
