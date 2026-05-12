import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import type { Product } from "../types";

type Props = {
  product: Product;
  onSelect: () => void;
};

export function ProductRow({ product, onSelect }: Props) {
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
      className={`flex items-center gap-3 px-5 py-3 cursor-pointer
                  hover:bg-gray-50 active:bg-gray-100
                  focus:outline-none focus:bg-blue-50
                  transition
                  ${product.is_published ? "" : "opacity-60"}`}
    >
      <span
        title={product.is_published ? "Published" : "Unpublished"}
        aria-label={product.is_published ? "Published" : "Unpublished"}
        className={`shrink-0 w-2 h-2 rounded-full
                    ${product.is_published ? "bg-green-500" : "bg-gray-300"}`}
      />

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <span className="text-sm font-medium truncate">
          {product.name || "(no name)"}
        </span>
        {product.sku && (
          <Badge size="sm" color="secondary">
            SKU {product.sku}
          </Badge>
        )}
      </div>

      <span aria-hidden className="text-gray-400 text-lg leading-none">
        ›
      </span>
    </li>
  );
}
