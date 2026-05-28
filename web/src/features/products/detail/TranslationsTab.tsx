import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { Translate } from "@openai/apps-sdk-ui/components/Icon";
import type {
  Language,
  ProductDetail,
  TranslationFieldKey,
} from "../types";
import { TRANSLATION_FIELDS } from "../types";
import { isHtml } from "./format";

export type OnTranslateParams = {
  field: string;
  key?: string;
  original?: string;
};

export type OnTranslate = (params: OnTranslateParams) => void;

type Props = {
  product: ProductDetail;
  languages: Language[];
  onTranslate?: OnTranslate;
};

export function TranslationsTab({ product, languages, onTranslate }: Props) {
  const defaultLang = languages.find((l) => l.isDefault) ?? languages[0];

  if (!defaultLang) {
    return (
      <div className="px-5 py-8">
        <EmptyMessage>
          <EmptyMessage.Title>No languages configured</EmptyMessage.Title>
          <EmptyMessage.Description>
            Add languages in KatanaPIM to manage translations.
          </EmptyMessage.Description>
        </EmptyMessage>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
        <span>Default language</span>
        <Badge size="xs" variant="soft" color="primary">
          <span className="font-mono uppercase mr-1">
            {defaultLang.languageCode || defaultLang.languageCulture.slice(0, 2)}
          </span>
          {defaultLang.name}
        </Badge>
      </div>

      <div className="space-y-3">
        {TRANSLATION_FIELDS.map((f) => {
          const value = readField(product, f.key);
          return (
            <DefaultField
              key={f.key}
              label={f.label}
              fieldKey={f.key}
              localeKey={f.localeKey}
              value={value}
              onTranslate={onTranslate}
            />
          );
        })}
      </div>
    </div>
  );
}

function DefaultField({
  label,
  fieldKey,
  localeKey,
  value,
  onTranslate,
}: {
  label: string;
  fieldKey: TranslationFieldKey;
  localeKey: string;
  value: string;
  onTranslate?: OnTranslate;
}) {
  const handleTranslate = () =>
    onTranslate?.({
      field: fieldKey,
      key: localeKey,
      original: value || undefined,
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
            disabled={!value}
          >
            <Translate className="w-3 h-3" /> Translate…
          </Button>
        )}
      </div>
      <FieldBox value={value} />
    </div>
  );
}

function FieldBox({ value }: { value: string }) {
  return (
    <div className="px-3 py-2 rounded-md bg-[var(--color-surface-tertiary)] border border-[var(--color-border-subtle)]">
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

function readField(product: ProductDetail, key: TranslationFieldKey): string {
  const v = product[key];
  return typeof v === "string" ? v : "";
}
