import { FormEvent, useState } from "react";
import type { Product } from "./types";

type Props = {
  products: Product[];
  busy: boolean;
  onSearch: (query: string) => void;
  onSelect: (id: number) => void;
};

export function ProductList({ products, busy, onSearch, onSelect }: Props) {
  const [draft, setDraft] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(draft.trim());
  };

  return (
    <div className="products-app">
      <div className="products-header">
        <h1>Products</h1>
        <span className="count">{products.length} shown</span>
      </div>

      <form className="add-row" onSubmit={submit}>
        <input
          type="text"
          placeholder="Search by name, SKU, GTIN…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="primary" disabled={busy}>
          Search
        </button>
      </form>

      {products.length === 0 ? (
        <div className="empty">No products found.</div>
      ) : (
        <ul className="product-list">
          {products.map((p) => (
            <ProductRow key={p.id} product={p} onSelect={() => onSelect(p.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ProductRow({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: () => void;
}) {
  return (
    <li
      className={`product ${product.is_published ? "published" : "unpublished"}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <span
        className={`status-dot ${product.is_published ? "on" : "off"}`}
        title={product.is_published ? "Published" : "Unpublished"}
        aria-label={product.is_published ? "Published" : "Unpublished"}
      />
      <div className="row-main">
        <span className="title">{product.name || "(no name)"}</span>
        {product.sku && <span className="badge">SKU {product.sku}</span>}
      </div>
      <span className="chevron" aria-hidden>
        ›
      </span>
    </li>
  );
}
