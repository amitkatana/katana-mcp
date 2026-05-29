import { useEffect, useMemo, useState } from "react";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";
import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import {
  ArrowLeftSm,
  ArrowRotateCw,
  Translate,
} from "@openai/apps-sdk-ui/components/Icon";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { useTranslation } from "../../AppContext/TranslationContext";
import { useProductDetail } from "../../AppContext/ProductDetailContext";
import { TRANSLATION_FIELDS } from "../products/types";
import type {
  Language,
  ProductDetail,
  ProductTranslation,
  TranslationFieldKey,
} from "../products/types";
import { isHtml } from "../products/detail/format";

export function TranslationReview() {
  const {
    translation,
    busy,
    justSaved,
    closeTranslation,
    updateTranslation,
    requestTranslation,
  } = useTranslation();
  const {
    selected: product,
    languages,
    openProduct,
    busy: productBusy,
  } = useProductDetail();

  const fieldKey = (translation?.field as TranslationFieldKey | undefined) ?? "name";
  const fieldDef =
    TRANSLATION_FIELDS.find((f) => f.key === fieldKey) ?? TRANSLATION_FIELDS[0];

  const defaultLang = useMemo(
    () => languages.find((l) => l.isDefault) ?? languages[0],
    [languages],
  );

  const [referenceId, setReferenceId] = useState<number | null>(null);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [draft, setDraft] = useState<string>("");

  useEffect(() => {
    if (!defaultLang) return;
    if (referenceId == null) setReferenceId(defaultLang.id);
    if (targetId == null) {
      const firstNonDefault = languages.find((l) => !l.isDefault);
      setTargetId((firstNonDefault ?? defaultLang).id);
    }
  }, [defaultLang, languages, referenceId, targetId]);

  const referenceLang = languages.find((l) => l.id === referenceId) ?? defaultLang;
  const targetLang = languages.find((l) => l.id === targetId) ?? defaultLang;

  const referenceText = useMemo(() => {
    if (!product || !referenceLang) return translation?.original ?? "";
    return readForLanguage(product, fieldKey, referenceLang);
  }, [product, referenceLang, fieldKey, translation?.original]);

  const existingTargetText = useMemo(() => {
    if (!product || !targetLang) return "";
    return readForLanguage(product, fieldKey, targetLang);
  }, [product, targetLang, fieldKey]);

  useEffect(() => {
    setDraft(existingTargetText);
  }, [existingTargetText, targetId, fieldKey]);

  if (!translation) {
    return (
      <div className="w-full px-5 py-8 text-[var(--color-text)]">
        <EmptyMessage>
          <EmptyMessage.Title>No translation loaded</EmptyMessage.Title>
        </EmptyMessage>
      </div>
    );
  }

  if (!referenceLang || !targetLang) {
    return (
      <div className="w-full px-5 py-8 text-[var(--color-text)]">
        <EmptyMessage>
          <EmptyMessage.Title>No languages available</EmptyMessage.Title>
          <EmptyMessage.Description>
            Languages must be configured in KatanaPIM.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    );
  }

  const dirty = draft !== existingTargetText;
  const sameLang = referenceLang.id === targetLang.id;
  const canAsk = !!referenceText && !sameLang && !busy;

  const onAsk = () =>
    void requestTranslation({
      referenceLanguageName: referenceLang.name,
      referenceLanguageCulture: referenceLang.languageCulture,
      referenceText,
      targetLanguageName: targetLang.name,
      targetLanguageCulture: targetLang.languageCulture,
      fieldLabel: fieldDef.label.toLowerCase(),
    });

  const onUpdate = async () => {
    await updateTranslation(draft, targetLang.id);
    if (translation.product_id != null) {
      await openProduct(translation.product_id);
    }
  };

  return (
    <div className="w-full text-[var(--color-text)]">
      <div className="max-w-3xl mx-auto px-5 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            color="secondary"
            size="sm"
            onClick={closeTranslation}
          >
            <ArrowLeftSm className="w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            {translation.product_id != null && (
              <Button
                variant="ghost"
                color="secondary"
                size="sm"
                onClick={() =>
                  translation.product_id != null &&
                  void openProduct(translation.product_id)
                }
                disabled={productBusy}
                title="Re-fetch latest product data"
              >
                <ArrowRotateCw
                  className={`w-4 h-4 ${productBusy ? "animate-spin" : ""}`}
                />
                {productBusy ? "Refreshing…" : "Refresh"}
              </Button>
            )}
            {translation.product_id != null && (
              <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
                #{translation.product_id}
              </span>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-snug">
                {fieldDef.label}
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                Translate the {fieldDef.label.toLowerCase()} into a target
                language.
              </p>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <LanguagePicker
                label="Reference"
                languages={languages}
                value={referenceLang.id}
                onChange={setReferenceId}
              />
              <LanguagePicker
                label="Target"
                languages={languages}
                value={targetLang.id}
                onChange={setTargetId}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldBox
                heading={`${referenceLang.name} (reference)`}
                value={referenceText}
              />
              <FieldBox
                heading={`${targetLang.name} (current)`}
                value={existingTargetText}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="soft"
                color="primary"
                size="sm"
                onClick={onAsk}
                disabled={!canAsk}
                title={
                  sameLang
                    ? "Pick a target different from reference"
                    : !referenceText
                      ? "Reference text is empty"
                      : undefined
                }
              >
                <Translate className="w-3.5 h-3.5" />
                {busy ? "Asking ChatGPT…" : `Ask ChatGPT → ${targetLang.name}`}
              </Button>
              {sameLang && (
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Reference and target must differ.
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="translation-input"
                className="block text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5"
              >
                {targetLang.name} translation
              </label>
              <Textarea
                id="translation-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Type the ${targetLang.name} translation…`}
                disabled={busy}
                rows={6}
                autoResize
                maxRows={16}
                size="md"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="button"
                color="primary"
                variant="solid"
                size="sm"
                onClick={() => void onUpdate()}
                disabled={busy || productBusy || !dirty}
              >
                {busy ? "Updating…" : "Update"}
              </Button>
              {dirty && !busy && (
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Unsaved changes
                </span>
              )}
              {justSaved && (
                <Badge color="success" size="sm" pill>
                  Saved
                </Badge>
              )}
            </div>

            {translation.error && (
              <Alert
                color="danger"
                variant="soft"
                title="Update failed"
                description={translation.error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguagePicker({
  label,
  languages,
  value,
  onChange,
}: {
  label: string;
  languages: Language[];
  value: number;
  onChange: (id: number) => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-1.5">
        {label}
      </span>
      <select
        value={String(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-3 py-2 text-sm rounded-md
                   bg-[var(--color-surface-tertiary)]
                   border border-[var(--color-border)]
                   text-[var(--color-text)]
                   focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
      >
        {languages.map((l) => (
          <option key={l.id} value={String(l.id)}>
            {l.name} ({l.languageCulture}){l.isDefault ? " — default" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

function FieldBox({ heading, value }: { heading: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-md bg-[var(--color-surface-tertiary)] border border-[var(--color-border-subtle)]">
      <div className="mb-1 text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-tertiary)]">
        {heading}
      </div>
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
  );
}

function readForLanguage(
  product: ProductDetail,
  key: TranslationFieldKey,
  lang: Language,
): string {
  if (lang.isDefault) {
    const v = product[key];
    return typeof v === "string" ? v : "";
  }
  const t: ProductTranslation | undefined = (product.translations ?? []).find(
    (x) => x.language?.id === lang.id,
  );
  const v = t?.value?.[key];
  return typeof v === "string" ? v : "";
}

export default TranslationReview;
