export type Product = {
  id: number;
  product_type_id: number | null;
  name: string;
  external_key: string | null;
  gtin: string | null;
  sku: string | null;
  created_on_utc: string | null;
  is_published: boolean;
};

export type ProductsOutput = {
  products: Product[];
  search?: string;
  limit?: number;
  selected_id?: number;
  error?: string;
};
