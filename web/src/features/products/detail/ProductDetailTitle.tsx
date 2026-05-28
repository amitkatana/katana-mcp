import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import type { ProductDetail } from "../types";
import { formatPrice } from "./format";

type Props = { product: ProductDetail };

export function ProductDetailTitle({ product }: Props) {
  return (
    <div className="px-5 py-4 border-b border-[var(--color-border)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-[var(--color-text)] leading-snug">
            {product.name || (
              <span className="text-[var(--color-text-tertiary)] italic font-normal">
                Untitled product
              </span>
            )}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.sku && (
              <Badge variant="soft" color="secondary" size="sm">
                <span className="font-mono">SKU {product.sku}</span>
              </Badge>
            )}
            {product.gtin && (
              <Badge variant="soft" color="secondary" size="sm">
                <span className="font-mono">GTIN {product.gtin}</span>
              </Badge>
            )}
            {product.productType?.name && (
              <Badge variant="outline" color="secondary" size="sm">
                {product.productType.name}
              </Badge>
            )}
            {product.price != null && (
              <Badge variant="soft" color="success" size="sm">
                {formatPrice(product.price)}
              </Badge>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <Badge
            variant="soft"
            color={product.published ? "success" : "secondary"}
            size="sm"
            pill
          >
            {product.published ? "Published" : "Unpublished"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
