import { Schema, model } from "mongoose";
import {
  TProduct,
  TProductInventory,
  TProductVariant,
} from "./product/product.interface";

const productVariantSchema = new Schema<TProductVariant>({
  type: { type: String, required: true },
  value: { type: String, required: true },
});

const productInventorySchema = new Schema<TProductInventory>({
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
});

const productSchema = new Schema<TProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  variants: [productVariantSchema],
  inventory: productInventorySchema,
});

export const ProductModel = model<TProduct>("Product", productSchema);