import type { ProductDetail } from "../types";
import { formatDate, formatPrice } from "./format";

type Props = { product: ProductDetail };

export function DetailsTab({ product }: Props) {
  const items = [
    { label: "ID", value: product.Id, mono: true },
    { label: "Type", value: product.ProductTypeId ?? "—" },
    { label: "SKU", value: product.Sku || "—", mono: true },
    { label: "GTIN", value: product.Gtin || "—", mono: true },
    { label: "External key", value: product.ExternalKey || "—", mono: true },
    { label: "Price", value: formatPrice(product.Price) },
    { label: "Old price", value: formatPrice(product.OldPrice) },
    { label: "Stock", value: product.StockQuantity ?? "—" },
    { label: "Created", value: formatDate(product.CreatedOnUtc) },
    { label: "Updated", value: formatDate(product.UpdatedOnUtc) },
  ];

  return (
    <dl className="divide-y divide-white/[0.06]">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-3 gap-4 px-5 py-3 hover:bg-white/[0.02] transition-colors"
        >
          <dt className="text-sm font-medium text-zinc-400">{item.label}</dt>
          <dd className="col-span-2 text-sm text-zinc-100 break-words">
            {item.mono && item.value !== "—" ? (
              <code className="px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded text-zinc-200">
                {item.value}
              </code>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
