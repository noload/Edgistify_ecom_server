import mongoose, { Document, Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { NextFunction } from "express";

interface userI extends Document<string>{
    fullName:string;
    email:string;
    password:string;
    comparePassword:(password:string)=>Boolean;
}

const userSchema = new Schema<userI>({
    fullName:{type:String,required:true,min:3},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}
})

userSchema.methods.comparePassword = function (password:string){
    try {
        return bcrypt.compare(password,this.password)
    } catch (error) {
        console.log(`Error while comparing password`,error);
        throw new Error((error as Error).message)   
    }
}


userSchema.pre("save",async function (next){
    if (this.isModified("password")) {
        let salt = await bcrypt.genSalt(10)
        this.password =await bcrypt.hash(this.password,salt)
    }
    next()
})


const UserModel = model<userI>("user",userSchema);
export {userI}
export default UserModel;