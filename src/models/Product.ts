import { Document, Schema, model } from "mongoose";

export interface ProductI extends Document {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

const ProductSchema = new Schema<ProductI>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
});


const ProductModel = model<ProductI>("product",ProductSchema)

export default ProductModel;