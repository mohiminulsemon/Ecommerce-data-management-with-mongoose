import { Request, Response } from "express";
import { OrderServices } from "./order.services";
import orderValidationSchema from "./order.validation";
import { ProductServices } from "../product/product.services";

const createOrder = async (req: Request, res: Response) => {
  try {
    // Validate order data using Joi
    const { error, value: orderData } = orderValidationSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details,
      });
    }

    // Check the available quantity in inventory
    const { productId, quantity } = orderData;
    const product = await ProductServices.getSingleProductFromDB(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.inventory.inStock || product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient quantity available in inventory",
      });
    }

    // Create the order
    const newOrder = await OrderServices.createOrderIntoDB(orderData);

    // Reduce the quantity of the ordered product in the inventory
    await ProductServices.updateProductInventory(orderData.productId, -orderData.quantity);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error,
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.email as string | undefined;

    const orders = await OrderServices.getAllOrdersFromDB(userEmail);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      success: true,
      message: userEmail ? `Orders fetched successfully for user email!` : "Orders fetched successfully",
      data: orders,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error,
    });
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
};
