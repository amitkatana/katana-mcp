import type { ProductDetail } from "../types";
import { formatPrice } from "./format";

type Props = { product: ProductDetail };

export function ProductDetailTitle({ product }: Props) {
  return (
    <div className="px-5 py-5 border-b border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-white leading-tight">
            {product.Name || (
              <span className="text-zinc-500 italic font-normal">(no name)</span>
            )}
          </h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.Sku && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-xs font-mono text-zinc-300 border border-white/10">
                SKU {product.Sku}
              </span>
            )}
            {product.Gtin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-xs font-mono text-zinc-300 border border-white/10">
                GTIN {product.Gtin}
              </span>
            )}
            {product.ProductTypeId != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] text-xs text-zinc-400 border border-white/10">
                Type {product.ProductTypeId}
              </span>
            )}
            {product.Price != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/[0.08] text-xs font-medium text-emerald-300 border border-emerald-500/20">
                {formatPrice(product.Price)}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
              product.Published
                ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                : "bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                product.Published ? "bg-emerald-400" : "bg-zinc-400"
              }`}
            />
            {product.Published ? "Published" : "Unpublished"}
          </span>
        </div>
      </div>
    </div>
  );
}
