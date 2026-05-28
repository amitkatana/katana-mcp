import { useState } from "react";
import { SegmentedControl } from "@openai/apps-sdk-ui/components/SegmentedControl";
import { EmptyMessage } from "@openai/apps-sdk-ui/components/EmptyMessage";
import { useProductDetail } from "../../../AppContext/ProductDetailContext";
import { useTranslation } from "../../../AppContext/TranslationContext";
import { ProductDetailToolbar } from "./ProductDetailToolbar";
import { ProductDetailTitle } from "./ProductDetailTitle";
import { DetailsTab } from "./DetailsTab";
import { TranslationsTab, type OnTranslate } from "./TranslationsTab";

type Tab = "details" | "translations";

export function ProductDetail() {
  const { selected: product, busy, clearSelection, goBack } = useProductDetail();
  const { openTranslation } = useTranslation();
  const [tab, setTab] = useState<Tab>("details");

  if (!product) {
    return (
      <div className="w-full px-5 py-8 text-[var(--color-text)]">
        <EmptyMessage>
          <EmptyMessage.Title>No product loaded</EmptyMessage.Title>
        </EmptyMessage>
      </div>
    );
  }

  const onBack = () => {
    clearSelection();
    goBack();
  };
  const onTranslate: OnTranslate = (params) =>
    openTranslation({ ...params, productId: product.id });

  const locCount = product.translations?.length ?? 0;

  return (
    <div className="w-full text-[var(--color-text)]">
      <div className="max-w-3xl mx-auto px-5 py-5">
        <ProductDetailToolbar product={product} busy={busy} onBack={onBack} />

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] overflow-hidden">
          <ProductDetailTitle product={product} />

          <div className="px-4 pt-3 pb-1 border-b border-[var(--color-border)]">
            <SegmentedControl
              value={tab}
              onChange={(v) => setTab(v as Tab)}
              size="sm"
            >
              <SegmentedControl.Option value="details">
                Details
              </SegmentedControl.Option>
              <SegmentedControl.Option value="translations">
                <span className="inline-flex items-center gap-1.5">
                  Translations
                  {locCount > 0 && (
                    <span className="text-[10px] tabular-nums opacity-70">
                      {locCount}
                    </span>
                  )}
                </span>
              </SegmentedControl.Option>
            </SegmentedControl>
          </div>

          <div className="min-h-[200px]">
            {tab === "details" && <DetailsTab product={product} />}
            {tab === "translations" && (
              <TranslationsTab product={product} onTranslate={onTranslate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
