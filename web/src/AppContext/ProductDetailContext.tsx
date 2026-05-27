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
  ProductDetail,
  ProductDetailOutput,
} from "../features/products/types";
import { isProductDetailPayload } from "./payload";

type Value = {
  selected: ProductDetail | null;
  busy: boolean;
  openProduct: (id: number) => Promise<void>;
  clearSelection: () => void;
  goBack: () => void;
};

const Ctx = createContext<Value | null>(null);

export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const initialRaw = readToolOutput<unknown>(null);
  const initial = isProductDetailPayload(initialRaw)
    ? (initialRaw as ProductDetailOutput).product
    : null;

  const [selected, setSelected] = useState<ProductDetail | null>(initial);
  const [busy, setBusy] = useState(false);

  useHostGlobals(() => {
    const out = readToolOutput<unknown>(null);
    if (!isProductDetailPayload(out)) return;
    setSelected((out as ProductDetailOutput).product);
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
    } finally {
      setBusy(false);
    }
  }, []);

  const clearSelection = useCallback(() => setSelected(null), []);

  const value: Value = {
    selected,
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
