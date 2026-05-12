import { useMemo, useState } from "react";
import { Translate } from "@openai/apps-sdk-ui/components/Icon";
import type { LocalizedString, ProductDetail } from "../types";
import { isHtml } from "./format";
import type { OnTranslate } from "./DescriptionsTab";

type Props = { product: ProductDetail; onTranslate?: OnTranslate };

type LangBucket = {
  culture: string;
  languageId: number;
  short?: LocalizedString;
  full?: LocalizedString;
};

const FIELD_LOCALE_KEY: Record<string, string> = {
  short_description: "ShortDescription",
  full_description: "FullDescription",
};

export function LocalizationsTab({ product, onTranslate }: Props) {
  const byLanguage = useMemo<LangBucket[]>(() => {
    const map = new Map<string, LangBucket>();
    const ensure = (loc: LocalizedString): LangBucket => {
      const key = loc.languageCulture || `lang-${loc.languageId}`;
      let bucket = map.get(key);
      if (!bucket) {
        bucket = { culture: key, languageId: loc.languageId };
        map.set(key, bucket);
      }
      return bucket;
    };
    for (const loc of product.shortDescription ?? []) ensure(loc).short = loc;
    for (const loc of product.FullDescription ?? []) ensure(loc).full = loc;
    return Array.from(map.values());
  }, [product.shortDescription, product.FullDescription]);

  const [activeLang, setActiveLang] = useState<string | null>(
    byLanguage[0]?.culture ?? null,
  );

  if (byLanguage.length === 0) {
    return (
      <div className="px-5 py-4">
        <div className="text-sm text-zinc-500 italic py-8 text-center">
          No localizations available
        </div>
      </div>
    );
  }

  const active = byLanguage.find((l) => l.culture === activeLang) ?? byLanguage[0];

  return (
    <div className="px-5 py-4">
      <div className="flex flex-wrap gap-1.5 mb-4">
        {byLanguage.map((lang) => {
          const count = (lang.short ? 1 : 0) + (lang.full ? 1 : 0);
          return (
            <button
              key={lang.culture}
              onClick={() => setActiveLang(lang.culture)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                active.culture === lang.culture
                  ? "bg-white/[0.1] text-white ring-1 ring-inset ring-white/20"
                  : "bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200"
              }`}
            >
              <span className="font-mono">{lang.culture}</span>
              <span className="text-zinc-500">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        <LocalizedField
          label="Short description"
          field="short_description"
          loc={active.short}
          languageId={active.languageId}
          culture={active.culture}
          onTranslate={onTranslate}
        />
        <LocalizedField
          label="Full description"
          field="full_description"
          loc={active.full}
          languageId={active.languageId}
          culture={active.culture}
          onTranslate={onTranslate}
        />
      </div>
    </div>
  );
}

function LocalizedField({
  label,
  field,
  loc,
  languageId,
  culture,
  onTranslate,
}: {
  label: string;
  field: string;
  loc?: LocalizedString;
  languageId: number;
  culture: string;
  onTranslate?: OnTranslate;
}) {
  const value = loc?.value ?? "";
  const handleTranslate = () =>
    onTranslate?.({
      field,
      language: culture,
      languageId: loc?.languageId ?? languageId,
      key: loc?.LocaleKey ?? FIELD_LOCALE_KEY[field] ?? field,
      original: value || undefined,
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        {onTranslate && (
          <button
            type="button"
            onClick={handleTranslate}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium
                       text-zinc-300 bg-white/[0.04] border border-white/10
                       hover:bg-white/[0.1] hover:text-white hover:border-white/20
                       transition-colors"
          >
            <Translate className="w-3 h-3" /> Review
          </button>
        )}
      </div>
      <div className="px-3 py-2 bg-white/[0.02] rounded-md border border-white/[0.06]">
        {!value ? (
          <div className="text-sm text-zinc-500 italic">— empty —</div>
        ) : isHtml(value) ? (
          <div
            className="text-sm text-zinc-200 prose prose-invert prose-sm max-w-none
                       [&_p]:my-1 [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        ) : (
          <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {value}
          </div>
        )}
      </div>
    </div>
  );
}
