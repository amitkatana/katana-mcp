import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getBridge,
  readToolOutput,
  sendFollowupTurn,
  useHostGlobals,
} from "../api/openai";
import type { TranslationOutput } from "../features/translations/types";
import { isTranslationPayload } from "./payload";

type OpenTranslationParams = {
  field: string;
  language: string;
  languageId?: number;
  key?: string;
  original?: string;
  productId?: number;
};

type Value = {
  translation: TranslationOutput | null;
  busy: boolean;
  justSaved: boolean;
  openTranslation: (p: OpenTranslationParams) => void;
  closeTranslation: () => void;
  updateTranslation: (draft: string) => Promise<void>;
  requestTranslation: () => Promise<void>;
};

const Ctx = createContext<Value | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const initialRaw = readToolOutput<unknown>(null);
  const initial = isTranslationPayload(initialRaw)
    ? (initialRaw as TranslationOutput)
    : null;

  const [translation, setTranslation] = useState<TranslationOutput | null>(
    initial,
  );
  const [busy, setBusy] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (savedAt === null) return;
    const t = setTimeout(() => setSavedAt(null), 2000);
    return () => clearTimeout(t);
  }, [savedAt]);

  useHostGlobals(() => {
    const out = readToolOutput<unknown>(null);
    if (!isTranslationPayload(out)) return;
    setTranslation(out as TranslationOutput);
  });

  const openTranslation = useCallback(
    ({ field, language, languageId, key, original, productId }: OpenTranslationParams) => {
      setTranslation({
        product_id: productId,
        field,
        language,
        language_id: languageId,
        key,
        original,
        translation: "",
      });
    },
    [],
  );

  const closeTranslation = useCallback(() => setTranslation(null), []);

  const updateTranslation = useCallback(
    async (draft: string) => {
      const current = translation;
      if (!current) return;
      const bridge = getBridge();
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

  const requestTranslation = useCallback(async () => {
    if (!translation) return;
    const original = translation.original ?? "";
    const productId = translation.product_id;
    const field = translation.field;
    const prompt =
      `Translate the following ${field ?? "text"} for product ${productId ?? ""} into Dutch (nl-NL). ` +
      `Return only the Dutch translation as plain text, no extra commentary.\n\nOriginal:\n${original}`;
    await sendFollowupTurn(prompt);
  }, [translation]);

  const value: Value = {
    translation,
    busy,
    justSaved: savedAt !== null,
    openTranslation,
    closeTranslation,
    updateTranslation,
    requestTranslation,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTranslation(): Value {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
