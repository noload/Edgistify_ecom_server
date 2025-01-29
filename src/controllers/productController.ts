import { Request, Response } from "express";
import { PaginationDTO } from "../dtos/paginationDTO";
import ProductModel, { ProductI } from "../models/Product";
import { orderCost } from "../utils/orderCost";
import { checkProductAndQuantityAvailability } from "../utils/product";

const getAllProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { page = 1, limit = 20 } = req.query as unknown as PaginationDTO;
    const Page = Number(page);
    const Limit = Number(limit);
    const skip = (Page - 1) * Limit;
    const {category} = req.params

    const filter = category === "all" ? {} : { category: new RegExp(`^${category}`, "i") };

    const products = await ProductModel.find(filter).skip(skip).limit(Limit);

    const totalCount = await ProductModel.countDocuments(filter);

    if (products.length == 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const pagination = {
      page: Page,
      totalPages: Math.floor(totalCount / Limit),
      limit: Limit,
      totalItems: totalCount,
    };

    return res.status(200).json({
      message: "Product  details fetched successfully",
      data: products,
      pagination,
    });
  } catch (error) {
    console.log("Error in product controller", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderItems } = req.body;

    if (!orderItems) {
      return res.status(400).json({
        message: "OrderItemms are required",
      });
    }
    if (!(await checkProductAndQuantityAvailability(orderItems))) {
      return res
        .status(400)
        .json({
          message:
            "Product is not found or Quantity greater than stock available",
        });
    }

    return res
      .status(200)
      .json({
        message: "OrderItem added to cart successfully",
        orderCost: {
          ...orderCost,
          subTotal: Number(orderCost.subTotal.toFixed()),
        },
        orderItems
      });
  } catch (error) {
    console.log(`Error in addToCart controller`, error);
    return res.status(500).json({ message: "Failed to add cart " });
  }
};

export default { getAllProduct, addToCart };
