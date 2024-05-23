import { Request, Response } from "express";
import { ProductServices } from "./product.services";
import mongoose from "mongoose";
import productSchema from "./product.validation";

const createNewProduct = async (req: Request, res: Response) => {
  try {
    // Validate product data using Joi
    const { error, value: productData } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details,
      });
    }

    const newProduct = await ProductServices.createNewProductIntoDB(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
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

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const { searchTerm } = req.query;

    const products = await ProductServices.getAllProductsFromDB(
      searchTerm ? searchTerm.toString() : undefined,
    );

    if (products.length > 0) {
      res.status(200).json({
        success: true,
        message: searchTerm
          ? `Products matching search term '${searchTerm}' fetched successfully!`
          : "All products fetched successfully",
        data: products,
      });
    } else {
      res.status(404).json({
        success: false,
        message: searchTerm
          ? `No products found matching search term '${searchTerm}'`
          : "No products found",
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error,
    });
  }
};

const getSingleProduct = async (req: Request, res: Response) => {
  try {
    let { productId } = req.params;
    // Remove leading colon if present
    if (productId.startsWith(":")) {
      productId = productId.substring(1);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const product = await ProductServices.getSingleProductFromDB(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
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

const updateProduct = async (req: Request, res: Response) => {
  try {
    let { productId } = req.params;
    // Remove leading colon if present
    if (productId.startsWith(":")) {
      productId = productId.substring(1);
    }

    // Validate updated product data using Joi
    const { error, value: updatedProductData } = productSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: error.details,
      });
    }

    const updatedProduct = await ProductServices.updateProductInDB(
      productId,
      updatedProductData,
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
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

const deleteProduct = async (req: Request, res: Response) => {
  try {
    let { productId } = req.params;
    // Remove leading colon if present
    if (productId.startsWith(":")) {
      productId = productId.substring(1);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format",
      });
    }

    const deletedProduct = await ProductServices.deleteProductFromDB(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
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

export const ProductControllers = {
  createNewProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
