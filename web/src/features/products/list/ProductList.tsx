import { FormEvent, useState } from "react";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { useOpenAi } from "../../../AppContext/OpenAiContext";
import { ProductRow } from "./ProductRow";

export function ProductList() {
  const { products, busy, searchProducts, openProduct } = useOpenAi();
  const [draft, setDraft] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    searchProducts(draft.trim());
  };

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Products</h1>
        <span className="text-sm text-gray-500">{products.length} shown</span>
      </div>

      <div className="px-5 py-3 border-b border-gray-100">
        <form className="flex gap-2" onSubmit={submit}>
          <input
            type="text"
            placeholder="Search by name, SKU, GTIN…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={busy}
            className="flex-1"
          />
          <button
            type="submit"
            disabled={busy}
            className="shrink-0 px-3 h-8 text-xs font-medium text-white bg-blue-600 rounded-full
                       hover:bg-blue-700 active:bg-blue-800
                       transition"
          >
            {busy ? "…" : "Search"}
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <EmptyMessage fill="absolute">
          <EmptyMessage.Title>No products found</EmptyMessage.Title>
          <EmptyMessage.Description>
            Try a different search term...
          </EmptyMessage.Description>
        </EmptyMessage>
      ) : (
        <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {products.map((p) => (
            <ProductRow
              key={p.id}
              product={p}
              onSelect={() => openProduct(p.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
