import { authenticateUser } from './../middleware/authMiddleware';
import { Router } from "express";
import productController from "../controllers/productController";

const router = Router();

router.get("/:category?",authenticateUser,productController.getAllProduct);
router.post("/add-to-cart",authenticateUser,productController.addToCart)
router.get("/prod/:id",authenticateUser,productController.getByProductId)

export default router;