import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { getBridge, readToolOutput, useHostGlobals } from "../api/openai";
import type { Product } from "../features/products/types";
import {
  EMPTY_ENVELOPE,
  type ProductsMeta,
  extractEnvelope,
  isProductDetailPayload,
  isTranslationPayload,
  stripItems,
} from "./payload";

type Value = {
  products: Product[];
  productsMeta: ProductsMeta | null;
  busy: boolean;
  searchProducts: (query: string, limit?: number) => Promise<void>;
  refreshProducts: (limit?: number) => Promise<void>;
};

const Ctx = createContext<Value | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const initialRaw = readToolOutput<unknown>({ products: EMPTY_ENVELOPE });
  const initialEnv =
    isTranslationPayload(initialRaw) || isProductDetailPayload(initialRaw)
      ? null
      : extractEnvelope(initialRaw);

  const [products, setProducts] = useState<Product[]>(initialEnv?.items ?? []);
  const [productsMeta, setProductsMeta] = useState<ProductsMeta | null>(
    initialEnv ? stripItems(initialEnv) : null,
  );
  const [busy, setBusy] = useState(false);

  useHostGlobals(() => {
    const out = readToolOutput<unknown>(null);
    if (isTranslationPayload(out) || isProductDetailPayload(out)) return;
    const env = extractEnvelope(out);
    if (!env) return;
    setProducts(env.items);
    setProductsMeta(stripItems(env));
  });

  const runList = useCallback(async (args: Record<string, unknown>) => {
    const bridge = getBridge();
    if (!bridge?.callTool) return;
    setBusy(true);
    try {
      const res = await bridge.callTool("product_list", args);
      const env = extractEnvelope(res?.structuredContent);
      if (env) {
        setProducts(env.items);
        setProductsMeta(stripItems(env));
      }
    } finally {
      setBusy(false);
    }
  }, []);

  const value: Value = {
    products,
    productsMeta,
    busy,
    searchProducts: (query, limit = 50) => runList({ query, limit }),
    refreshProducts: (limit = 50) => runList({ query: "", limit }),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProducts(): Value {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
