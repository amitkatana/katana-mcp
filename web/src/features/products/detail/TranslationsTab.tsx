import { useState } from "react";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { SegmentedControl } from "@openai/apps-sdk-ui/components/SegmentedControl";
import { Translate } from "@openai/apps-sdk-ui/components/Icon";
import type {
  ProductDetail,
  ProductTranslation,
  TranslationFieldKey,
} from "../types";
import { TRANSLATION_FIELDS } from "../types";
import { isHtml } from "./format";

export type OnTranslateParams = {
  field: string;
  language: string;
  languageId?: number;
  key?: string;
  original?: string;
};

export type OnTranslate = (params: OnTranslateParams) => void;

type Props = { product: ProductDetail; onTranslate?: OnTranslate };

export function TranslationsTab({ product, onTranslate }: Props) {
  const translations = product.translations ?? [];

  const [activeId, setActiveId] = useState<string>(
    translations[0] ? String(translations[0].language.id) : "",
  );

  if (translations.length === 0) {
    return (
      <div className="px-5 py-8">
        <EmptyMessage>
          <EmptyMessage.Title>No translations</EmptyMessage.Title>
          <EmptyMessage.Description>
            This product has no localized content yet.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    );
  }

  const active =
    translations.find((t) => String(t.language.id) === activeId) ??
    translations[0];

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="overflow-x-auto">
        <SegmentedControl
          value={String(active.language.id)}
          onChange={(v) => setActiveId(v)}
          size="sm"
        >
          {translations.map((t) => {
            const filled = countFilled(t);
            return (
              <SegmentedControl.Option
                key={t.language.id}
                value={String(t.language.id)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono uppercase">
                    {t.language.twoLetterIsoCode}
                  </span>
                  <Badge size="xs" variant="soft" color="secondary">
                    {filled}/{TRANSLATION_FIELDS.length}
                  </Badge>
                </span>
              </SegmentedControl.Option>
            );
          })}
        </SegmentedControl>
      </div>

      <div className="space-y-3">
        {TRANSLATION_FIELDS.map((f) => (
          <TranslationField
            key={f.key}
            label={f.label}
            fieldKey={f.key}
            localeKey={f.localeKey}
            language={active.language.twoLetterIsoCode}
            languageId={active.language.id}
            original={readOriginal(product, f.key)}
            value={readTranslated(active, f.key)}
            onTranslate={onTranslate}
          />
        ))}
      </div>
    </div>
  );
}

function TranslationField({
  label,
  fieldKey,
  localeKey,
  language,
  languageId,
  original,
  value,
  onTranslate,
}: {
  label: string;
  fieldKey: TranslationFieldKey;
  localeKey: string;
  language: string;
  languageId: number;
  original: string;
  value: string;
  onTranslate?: OnTranslate;
}) {
  const handleTranslate = () =>
    onTranslate?.({
      field: fieldKey,
      language,
      languageId,
      key: localeKey,
      original: original || undefined,
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
          {label}
        </span>
        {onTranslate && (
          <Button
            variant="ghost"
            color="secondary"
            size="xs"
            onClick={handleTranslate}
          >
            <Translate className="w-3 h-3" /> Ask ChatGPT
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FieldBox heading="Original" value={original} />
        <FieldBox heading={language.toUpperCase()} value={value} />
      </div>
    </div>
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

function readOriginal(product: ProductDetail, key: TranslationFieldKey): string {
  const v = product[key];
  return typeof v === "string" ? v : "";
}

function readTranslated(t: ProductTranslation, key: TranslationFieldKey): string {
  const v = t.value?.[key];
  return typeof v === "string" ? v : "";
}

function countFilled(t: ProductTranslation): number {
  let n = 0;
  for (const f of TRANSLATION_FIELDS) {
    const v = t.value?.[f.key];
    if (typeof v === "string" && v.trim().length > 0) n++;
  }
  return n;
}
