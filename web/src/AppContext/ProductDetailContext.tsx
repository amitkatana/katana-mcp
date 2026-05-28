import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  getBridge,
  readToolOutput,
  sendFollowupTurn,
  useHostGlobals,
} from "../api/openai";
import type {
  Language,
  ProductDetail,
  ProductDetailOutput,
} from "../features/products/types";
import { isProductDetailPayload } from "./payload";

type Value = {
  selected: ProductDetail | null;
  languages: Language[];
  busy: boolean;
  openProduct: (id: number) => Promise<void>;
  clearSelection: () => void;
  goBack: () => void;
};

const Ctx = createContext<Value | null>(null);

function extractLanguages(out: unknown): Language[] {
  if (!isProductDetailPayload(out)) return [];
  const langs = (out as ProductDetailOutput).languages;
  return Array.isArray(langs) ? langs : [];
}

export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const initialRaw = readToolOutput<unknown>(null);
  const initial = isProductDetailPayload(initialRaw)
    ? (initialRaw as ProductDetailOutput).product
    : null;

  const [selected, setSelected] = useState<ProductDetail | null>(initial);
  const [languages, setLanguages] = useState<Language[]>(
    extractLanguages(initialRaw),
  );
  const [busy, setBusy] = useState(false);

  useHostGlobals(() => {
    const out = readToolOutput<unknown>(null);
    if (!isProductDetailPayload(out)) return;
    setSelected((out as ProductDetailOutput).product);
    setLanguages(extractLanguages(out));
  });

  const openProduct = useCallback(async (id: number) => {
    const bridge = getBridge();
    if (!bridge?.callTool) {
      await sendFollowupTurn(`Show details for product ${id}.`);
      return;
    }
    setBusy(true);
    try {
      const res = await bridge.callTool("product_detail", { product_id: id });
      const sc = res?.structuredContent as ProductDetailOutput | undefined;
      if (sc?.product) setSelected(sc.product);
      if (sc?.languages) setLanguages(sc.languages);
    } finally {
      setBusy(false);
    }
  }, []);

  const clearSelection = useCallback(() => setSelected(null), []);

  const value: Value = {
    selected,
    languages,
    busy,
    openProduct,
    clearSelection,
    goBack: clearSelection,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useProductDetail(): Value {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useProductDetail must be used within ProductDetailProvider");
  return ctx;
}
