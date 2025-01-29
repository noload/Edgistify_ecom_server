import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

export const generateToken =(userId:string) => {
    return jwt.sign({userId},process.env.JWT_SECRETE as string);
}

export const verifyToken = (token:string)=>{
    return jwt.verify(token,process.env.JWT_SECRETE as string) as JwtPayload
}