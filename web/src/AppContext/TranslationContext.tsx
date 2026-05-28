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
  key?: string;
  productId?: number;
  original?: string;
};

type RequestTranslationParams = {
  referenceLanguageName: string;
  referenceLanguageCulture: string;
  referenceText: string;
  targetLanguageName: string;
  targetLanguageCulture: string;
  fieldLabel: string;
};

type Value = {
  translation: TranslationOutput | null;
  busy: boolean;
  justSaved: boolean;
  openTranslation: (p: OpenTranslationParams) => void;
  closeTranslation: () => void;
  updateTranslation: (draft: string, targetLanguageId: number) => Promise<void>;
  requestTranslation: (p: RequestTranslationParams) => Promise<void>;
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
    ({ field, key, original, productId }: OpenTranslationParams) => {
      setTranslation({
        product_id: productId,
        field,
        key,
        original,
        translation: "",
      });
    },
    [],
  );

  const closeTranslation = useCallback(() => setTranslation(null), []);

  const updateTranslation = useCallback(
    async (draft: string, targetLanguageId: number) => {
      const current = translation;
      if (!current) return;
      const bridge = getBridge();
      if (!bridge?.callTool) {
        setTranslation({
          ...current,
          translation: draft,
          language_id: targetLanguageId,
          saved: true,
        });
        setSavedAt(Date.now());
        return;
      }
      setBusy(true);
      try {
        const res = await bridge.callTool("update_translation", {
          product_id: current.product_id,
          key: current.key ?? current.field,
          language_id: targetLanguageId,
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

  const requestTranslation = useCallback(
    async ({
      referenceLanguageName,
      referenceLanguageCulture,
      referenceText,
      targetLanguageName,
      targetLanguageCulture,
      fieldLabel,
    }: RequestTranslationParams) => {
      if (!referenceText) return;
      const prompt =
        `Translate the following ${fieldLabel} from ${referenceLanguageName} (${referenceLanguageCulture}) into ${targetLanguageName} (${targetLanguageCulture}). ` +
        `Return only the ${targetLanguageName} translation as plain text, no extra commentary.\n\nSource:\n${referenceText}`;
      await sendFollowupTurn(prompt);
    },
    [],
  );

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
