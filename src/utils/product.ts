import { orderItemI } from "../models/Order";
import ProductModel from "../models/Product";
import { orderCost } from "./orderCost";

export const checkProductAndQuantityAvailability=async(orderItems:orderItemI[])=>{
    orderCost.subTotal = 0;
    for(let item of orderItems){
      
        let findProduct= await  ProductModel.findById(item._id);
        if (!findProduct) {
          return false
        } 
  
        if (item.quantity > findProduct.stock) {
          return false
        }

        orderCost.subTotal += item.quantity * findProduct.price;
  
      }
      return true
}