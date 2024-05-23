import Joi from "joi";

export const productVariantSchema = Joi.object({
  type: Joi.string().required(),
  value: Joi.string().required(),
});

export const productInventorySchema = Joi.object({
  quantity: Joi.number().integer().positive().required(),
  inStock: Joi.boolean().required(),
});

export const productSchema = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  price: Joi.number().integer().positive().required(),
  category: Joi.string().min(1).required(),
  tags: Joi.array().items(Joi.string()),
  variants: Joi.array().items(productVariantSchema),
  inventory: productInventorySchema.required(),
});

export default productSchema;
