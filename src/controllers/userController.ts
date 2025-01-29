import { Request, Response } from "express";
import UserModel, { userI } from "../models/User";
import { UserLoginRequest } from "../dtos/userDTO";
import { generateToken } from "../services/jwtServices";

const createUser = async (
  req: Request<{}, {}, userI>,
  res: Response
): Promise<any> => {
  try {
    const { fullName, email, password } = req.body as userI;

    const findUser = await UserModel.findOne({ email });

    if (findUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const user = new UserModel({
      fullName,
      email,
      password,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Error in controller", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

const login = async (req: Request, res: Response):Promise<any> => {
  try {
    const { email, password } = req.body as UserLoginRequest;

    const findUser = await UserModel.findOne({ email });

    if (!findUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const isValid = await findUser.comparePassword(password);
    if (!isValid) {
      return res.status(400).json({ message: "Password is wrong" });
    }
    const token = generateToken(findUser._id);

    
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "User loggedIn successfully", token,user:findUser });
  } catch (error) {
    console.log("Error in controller", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export default {login,createUser}
