import { validateLoginUser } from './../validation.ts/userValidation';
import { Router } from "express";
import userController from "../controllers/userController";
import { validateRegisterUser } from "../validation.ts/userValidation";

const router = Router();
router.post("/register",validateRegisterUser,userController.createUser)
router.post("/login",validateLoginUser,userController.login)

export default router;