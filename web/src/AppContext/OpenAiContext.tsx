import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
  Product,
  ProductDetail,
  ProductDetailOutput,
  ProductsOutput,
} from "../features/products/types";
import type { TranslationOutput } from "../features/translations/types";

const EMPTY: ProductsOutput = { products: [] };

function isTranslationPayload(v: unknown): v is TranslationOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return "field" in o || "language" in o || "translation" in o || "original" in o;
}

function isProductDetailPayload(v: unknown): v is ProductDetailOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return "product" in o && typeof o.product === "object" && o.product !== null;
}

type OpenAiContextValue = {
  products: Product[];
  selected: ProductDetail | null;
  translation: TranslationOutput | null;
  busy: boolean;
  justSaved: boolean;
  searchProducts: (search: string, limit?: number) => Promise<void>;
  refreshProducts: (limit?: number) => Promise<void>;
  openProduct: (id: number) => Promise<void>;
  clearSelection: () => void;
  goBack: () => Promise<void>;
  openTranslation: (params: {
    field: string;
    language: string;
    languageId?: number;
    key?: string;
    original?: string;
    productId?: number;
  }) => void;
  closeTranslation: () => void;
  updateTranslation: (draft: string) => Promise<void>;
  requestTranslation: () => Promise<void>;
};

const Ctx = createContext<OpenAiContextValue | null>(null);

type Props = { children: ReactNode };

export function OpenAiProvider({ children }: Props) {
  const initialRaw = readToolOutput<unknown>(EMPTY);
  const initialTranslation = isTranslationPayload(initialRaw)
  ? (initialRaw as TranslationOutput)
  : null;
  const initialDetail = isProductDetailPayload(initialRaw)
  ? (initialRaw as ProductDetailOutput).product
  : null;
  const initialProducts: ProductsOutput =
  isTranslationPayload(initialRaw) || isProductDetailPayload(initialRaw)
  ? EMPTY
  : (initialRaw as ProductsOutput);
  console.log(initialTranslation,"TAS")

  const [products, setProducts] = useState<Product[]>(initialProducts.products);
  const [selected, setSelected] = useState<ProductDetail | null>(initialDetail);
  const [translation, setTranslation] = useState<TranslationOutput | null>(
    initialTranslation,
  );
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (savedAt === null) return;
    const t = setTimeout(() => setSavedAt(null), 2000);
    return () => clearTimeout(t);
  }, [savedAt]);

  useHostGlobals(() => {
    const out = readToolOutput<unknown>(EMPTY);
    if (isTranslationPayload(out)) {
      setTranslation(out as TranslationOutput);
      return;
    }
    if (isProductDetailPayload(out)) {
      setSelected((out as ProductDetailOutput).product);
      return;
    }
    const p = out as ProductsOutput;
    if (Array.isArray(p.products)) setProducts(p.products);
  });

  const applyToolResult = useRef((sc: unknown) => {
    if (!sc) return;
    if (isProductDetailPayload(sc)) {
      const detail = (sc as ProductDetailOutput).product;
      if (detail) setSelected(detail);
      return;
    }
    const po = sc as ProductsOutput;
    if (po.error) return;
    if (Array.isArray(po.products)) setProducts(po.products);
  });

  const callProductsTool = useCallback(
    async (name: string, args: Record<string, unknown>) => {
      const bridge = getBridge();
      if (!bridge?.callTool) return undefined;
      setBusy(true);
      try {
        const res = await bridge.callTool(name, args);
        const sc = res?.structuredContent as unknown;
        if (sc) applyToolResult.current(sc);
        return sc;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const updateTranslation = useCallback(
    async (draft: string) => {
      const bridge = getBridge();
      const current = translation;
      if (!current) return;
      if (!bridge?.callTool) {
        setTranslation({ ...current, translation: draft, saved: true });
        setSavedAt(Date.now());
        return;
      }
      setBusy(true);
      try {
        const res = await bridge.callTool("update_translation", {
          product_id: current.product_id,
          key: current.key ?? current.field,
          language_id: current.language_id,
          translation: draft,
        });
        const sc = res?.structuredContent as TranslationOutput | undefined;
        if (sc) {
          setTranslation((prev) => ({ ...(prev ?? {}), ...sc }));
          if (sc.saved) setSavedAt(Date.now());
        }
      } finally {
        setBusy(false);
      }
    },
    [translation],
  );

  const value = useMemo<OpenAiContextValue>(
    () => ({
      products,
      selected,
      translation,
      busy,
      justSaved: savedAt !== null,
      searchProducts: async (search, limit = 50) => {
        setSelected(null);
        setTranslation(null);
        await callProductsTool("product_list", { search, limit });
      },
      refreshProducts: async (limit = 50) => {
        setSelected(null);
        setTranslation(null);
        await callProductsTool("product_list", { limit });
      },
      openProduct: async (id) => {
        setTranslation(null);
        const bridge = getBridge();
        if (bridge?.callTool) {
          await callProductsTool("product_detail", { product_id:id });
          return;
        }
        await sendFollowupTurn(`Show details for product ${id}.`);
      },
      clearSelection: () => setSelected(null),
      goBack: () => setSelected(null),
      openTranslation: ({ field, language, languageId, key, original, productId }) => {
        const pid = productId ?? selected?.Id;
        setTranslation({
          product_id: pid,
          field,
          language,
          language_id: languageId,
          key,
          original,
          translation: "",
        });
      },
      closeTranslation: () => setTranslation(null),
      updateTranslation,
      requestTranslation: async () => {
        if (!translation) return;
        const original = translation.original ?? "";
        const productId = translation.product_id;
        const field = translation.field;
        const prompt =
          `Translate the following ${field ?? "text"} for product ${productId ?? ""} into Dutch (nl-NL). ` +
          `Return only the Dutch translation as plain text, no extra commentary.\n\nOriginal:\n${original}`;
        await sendFollowupTurn(prompt);
      },
    }),
    [products, selected, translation, busy, savedAt, callProductsTool, updateTranslation],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOpenAi(): OpenAiContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOpenAi must be used within OpenAiProvider");
  return ctx;
}

export default OpenAiProvider;
