import mongoose from "mongoose";
import { ProductModel } from "../products.model";
import { TProduct } from "./product.interface";

const createNewProductIntoDB = async (product: TProduct) => {
  const newProduct = await ProductModel.create(product);
  return newProduct;
};

const getAllProductsFromDB = async (searchTerm?: string) => {
  let query = {};
  if (searchTerm) {
    const regex = new RegExp(searchTerm, "i");
    query = {
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { tags: { $in: [regex] } },
        { "variants.type": regex },
        { "variants.value": regex },
      ],
    };
  }

  const products = await ProductModel.find(query);
  return products;
};

// const getAllProductFromDB = async () => {
//   const products = await ProductModel.find();
//   return products;
// };

const getSingleProductFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  const product = await ProductModel.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

const updateProductInDB = async (
  productId: string,
  updatedProductData: TProduct,
) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    updatedProductData,
    { new: true },
  );

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  return updatedProduct;
};

const deleteProductFromDB = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }

  const deletedProduct = await ProductModel.findByIdAndDelete(id);
  return deletedProduct;
};

// const searchProduct = async (searchTerm: string) => {
//   const regex = new RegExp(searchTerm, "i");
//   const products = await ProductModel.find({
//     $or: [{ name: regex }, { description: regex }],
//   });
//   return products;
// };

const updateProductInventory = async (productId: string, quantity: number) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID format");
  }

  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // Update product inventory
  product.inventory.quantity -= quantity;
  product.inventory.inStock = product.inventory.quantity > 0;

  await product.save();
};

export const ProductServices = {
  createNewProductIntoDB,
  getAllProductsFromDB,
  // getAllProductFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductFromDB,
  // searchProduct,
  updateProductInventory,
};
