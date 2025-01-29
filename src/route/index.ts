import { Router } from "express";

import userRoute from "./userRoute";
import productRoute from "./productRoute";
import orderRoute from "./orderRoute"

const router = Router();

router.use("/user",userRoute)
router.use("/product",productRoute)
router.use("/order",orderRoute)
export default router;