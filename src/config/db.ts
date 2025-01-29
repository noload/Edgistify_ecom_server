import mongoose from "mongoose"
import ProductModel from "../models/Product";
const connectBD=async()=>{
 try {
    await mongoose.connect(process.env.DB_URL as string)
    console.log("Database connected successfully");
    
 } catch (error) {
    console.log(`Failed to connect database`,error);
    throw new Error('database connection failed')
 }
}

export default connectBD;