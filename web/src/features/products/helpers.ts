import type { Product, ProductImage } from "./types";

export function primaryImage(product: Product): ProductImage | null {
  const images = product.Collections?.Images ?? [];
  if (images.length === 0) return null;
  return [...images].sort((a, b) => a.DisplayOrder - b.DisplayOrder)[0];
}

export const ProductTypeId = {
  Simple: 5,
  Child: 15,
  Parent: 30,
  GrandParent: 40,
} as const;

const PRODUCT_TYPE_LABEL: Record<number, string> = {
  [ProductTypeId.Simple]: "Simple",
  [ProductTypeId.Child]: "Child",
  [ProductTypeId.Parent]: "Parent",
  [ProductTypeId.GrandParent]: "Grand Parent",
};

export function productTypeLabel(product: Product): string {
  return (
    PRODUCT_TYPE_LABEL[product.ProductType] ??
    product.ProductTypeDescription ??
    ""
  );
}

export function isFamilyProduct(product: Product): boolean {
  return (
    product.ProductType === ProductTypeId.Child ||
    product.ProductType === ProductTypeId.Parent ||
    product.ProductType === ProductTypeId.GrandParent
  );
}
