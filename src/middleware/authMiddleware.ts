import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../services/jwtServices";
import { JwtPayload } from "jsonwebtoken";

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) :Promise<any>=> {
  try {
    let token = req.cookies.token;

    
    if (!token) {
      token = req.headers.authorization?.split(" ")[1]
      if (!token) {
      return res.status(403).json({ message: "Token nnot found" });
      }
    }

    const decode: JwtPayload = await verifyToken(token);
    if (!decode) {
      return res.status(409).json({ message: "Token is invalid" });
    }

    (req as any).user = { userId: decode.userId };
    next()
  } catch (error) {
    console.log(`Error in auth middleware`, error);
    return res.status(500).json({ message: (error as Error).message });
  }
};
