import type { ProductDetail } from "../types";
import { formatDate, formatPrice, isHtml } from "./format";

type Props = { product: ProductDetail };

type Row = { label: string; value: any; mono?: boolean };

export function DetailsTab({ product }: Props) {
  const rows: Row[] = [
    { label: "ID", value: product.id, mono: true },
    { label: "Type", value: product.productType?.name ?? "—" },
    { label: "SKU", value: product.sku || "—", mono: true },
    { label: "GTIN", value: product.gtin || "—", mono: true },
    { label: "External key", value: product.externalKey || "—", mono: true },
    {
      label: "MPN",
      value: product.manufacturerPartNumber || "—",
      mono: true,
    },
    { label: "Price", value: formatPrice(product.price) },
    { label: "Old price", value: formatPrice(product.oldPrice) },
    { label: "Special price", value: formatPrice(product.specialPrice) },
    { label: "Cost", value: formatPrice(product.productCost) },
    { label: "Stock", value: product.stockQuantity ?? "—" },
    { label: "Meta title", value: product.metaTitle || "—" },
    { label: "Meta description", value: product.metaDescription || "—" },
    { label: "Created", value: formatDate(product.createdOnUtc) },
    { label: "Updated", value: formatDate(product.updatedOnUtc) },
  ];

  const shortDesc = product.shortdescription ?? "";
  const fullDesc = product.fullDescription ?? "";

  return (
    <div>
      <dl className="divide-y divide-[var(--color-border-subtle)]">
        {rows.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-3 gap-4 px-5 py-2.5"
          >
            <dt className="text-sm text-[var(--color-text-tertiary)]">
              {item.label}
            </dt>
            <dd className="col-span-2 text-sm text-[var(--color-text)] break-words">
              {item.mono && item.value !== "—" ? (
                <code className="px-1.5 py-0.5 text-xs font-mono bg-[var(--color-surface-tertiary)] rounded text-[var(--color-text)]">
                  {item.value}
                </code>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="px-5 py-4 space-y-4 border-t border-[var(--color-border)]">
        <DescBlock label="Short description" value={shortDesc} />
        <DescBlock label="Full description" value={fullDesc} />
      </div>
    </div>
  );
}

function DescBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {label}
      </div>
      <div className="px-3 py-2 rounded-md bg-[var(--color-surface-tertiary)] border border-[var(--color-border-subtle)]">
        {!value ? (
          <div className="text-sm text-[var(--color-text-tertiary)] italic">
            — empty —
          </div>
        ) : isHtml(value) ? (
          <div
            className="text-sm text-[var(--color-text)] prose prose-sm max-w-none
                       [&_p]:my-1 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}
