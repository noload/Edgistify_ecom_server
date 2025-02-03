import Razorpay from "razorpay";
import dotenv from "dotenv"
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.key_id as string,
  key_secret: process.env.key_secret as string,
});

export default razorpay;