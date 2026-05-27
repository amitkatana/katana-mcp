import { Translate } from "@openai/apps-sdk-ui/components/Icon";
import type { LocalizedString, ProductDetail } from "../types";
import { isHtml } from "./format";

export type OnTranslateParams = {
  field: string;
  language: string;
  languageId?: number;
  key?: string;
  original?: string;
};

export type OnTranslate = (params: OnTranslateParams) => void;

const DEFAULT_LOCALE_KEY: Record<string, string> = {
  short_description: "ShortDescription",
  full_description: "FullDescription",
  name: "Name",
};

type Props = { product: ProductDetail; onTranslate?: OnTranslate };

export function DescriptionsTab({ product, onTranslate }: Props) {
  return (
    <div className="px-5 py-4 space-y-5">
      <DescriptionBlock
        label="Short description"
        field="short_description"
        values={product.shortDescription ?? []}
        onTranslate={onTranslate}
      />
      <DescriptionBlock
        label="Full description"
        field="full_description"
        values={product.FullDescription ?? []}
        onTranslate={onTranslate}
      />
    </div>
  );
}

function DescriptionBlock({
  label,
  field,
  values,
  onTranslate,
}: {
  label: string;
  field: string;
  values: LocalizedString[];
  onTranslate?: OnTranslate;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {label}
        </span>
      </div>
      {values.length === 0 ? (
        <div className="text-sm text-zinc-500 italic">— empty —</div>
      ) : (
        <div className="space-y-2">
          {values.map((loc) => (
            <LocalizedDescription
              key={`${field}-${loc.languageCulture}-${loc.languageId}`}
              loc={loc}
              field={field}
              onTranslate={onTranslate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LocalizedDescription({
  loc,
  field,
  onTranslate,
}: {
  loc: LocalizedString;
  field: string;
  onTranslate?: OnTranslate;
}) {
  const value = loc.value ?? "";
  const handleTranslate = () =>
    onTranslate?.({
      field,
      language: loc.languageCulture,
      languageId: loc.languageId,
      key: loc.LocaleKey ?? DEFAULT_LOCALE_KEY[field] ?? field,
      original: value || undefined,
    });

  return (
    <div className="group relative px-3 py-2 bg-white/[0.02] rounded-md border border-white/[0.06] hover:border-white/[0.12] transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px] text-zinc-400">
          {loc.languageCulture}
        </span>
        {onTranslate && (
          <button
            type="button"
            onClick={handleTranslate}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium
                       text-zinc-300 bg-white/[0.04] border border-white/10
                       opacity-0 group-hover:opacity-100 focus:opacity-100
                       hover:bg-white/[0.1] hover:text-white hover:border-white/20
                       transition-opacity"
          >
            <Translate className="w-3 h-3" /> Review
          </button>
        )}
      </div>
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
  );
}
