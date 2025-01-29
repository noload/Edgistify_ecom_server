import { Router } from "express";
import orderController from "../controllers/orderController";
import { authenticateUser } from "../middleware/authMiddleware";


const router = Router();

router.post("/place-order",authenticateUser,orderController.placeOrder)
router.post("/validate-payment",orderController.validatePayment)

export default router;