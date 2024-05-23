export interface TProductVariant {
  type: string;
  value: string;
}

export interface TProductInventory {
  quantity: number;
  inStock: boolean;
}

export interface TProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: TProductVariant[];
  inventory: TProductInventory;
}
