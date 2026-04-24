import type { Product } from "./types";

type Props = {
  product: Product;
  busy: boolean;
  onBack: () => void;
};

export function ProductDetail({ product, busy, onBack }: Props) {
  return (
    <div className="products-app">
      <div className="products-header">
        <button onClick={onBack} disabled={busy}>
          ‹ Back
        </button>
        <span className="count">Product #{product.id}</span>
      </div>

      <h2 className="detail-title">
        {product.name || "(no name)"}
        <span className={`status-pill ${product.is_published ? "on" : "off"}`}>
          {product.is_published ? "Published" : "Unpublished"}
        </span>
      </h2>

      <dl className="meta">
        <dt>ID</dt>
        <dd><code>{product.id}</code></dd>

        <dt>Type</dt>
        <dd>{product.product_type_id ?? "—"}</dd>

        <dt>SKU</dt>
        <dd>{product.sku || "—"}</dd>

        <dt>GTIN</dt>
        <dd>{product.gtin || "—"}</dd>

        <dt>External key</dt>
        <dd>{product.external_key || "—"}</dd>

        <dt>Status</dt>
        <dd>{product.is_published ? "Published" : "Unpublished"}</dd>

        {product.created_on_utc && (
          <>
            <dt>Created</dt>
            <dd>{new Date(product.created_on_utc).toLocaleString()}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
