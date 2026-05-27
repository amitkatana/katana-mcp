import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import type { Product } from "../types";
import { isFamilyProduct, primaryImage, productTypeLabel } from "../helpers";
import { ProductThumbnail } from "./ProductThumbnail";

type Props = {
  product: Product;
  onSelect: () => void;
};

export function ProductRow({ product, onSelect }: Props) {
  const name = product.TextFieldsModel?.Name || "(no name)";
  const sku = product.TextFieldsModel?.Sku;
  const type = productTypeLabel(product);
  const image = primaryImage(product);
  const family = isFamilyProduct(product);

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className="flex items-center gap-3 px-5 py-3 cursor-pointer
                 hover:bg-gray-50 active:bg-gray-100
                 focus:outline-none focus:bg-blue-50
                 transition"
    >
      <ProductThumbnail image={image} alt={name} />

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-sm font-medium truncate">{name}</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {sku && (
            <Badge size="sm" color="secondary">
              SKU {sku}
            </Badge>
          )}
          {type && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                family
                  ? "bg-purple-100 text-purple-700 border border-purple-200"
                  : "bg-gray-100 text-gray-700 border border-gray-200"
              }`}
            >
              {type}
            </span>
          )}
        </div>
      </div>

      <span aria-hidden className="text-gray-400 text-lg leading-none">
        ›
      </span>
    </li>
  );
}
