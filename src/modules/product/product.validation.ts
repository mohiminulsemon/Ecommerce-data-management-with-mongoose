import { z } from "zod";

export const productVariantSchema = z.object({
  type: z.string(),
  value: z.string(),
});

export const productInventorySchema = z.object({
  quantity: z.number().int().positive(),
  inStock: z.boolean(),
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().int().positive(),
  category: z.string().min(1),
  tags: z.array(z.string()),
  variants: z.array(productVariantSchema),
  inventory: productInventorySchema,
});

export default productSchema;
