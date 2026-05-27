import { useState } from "react";
import { useProductDetail } from "../../../AppContext/ProductDetailContext";
import { useTranslation } from "../../../AppContext/TranslationContext";
import { ProductDetailToolbar } from "./ProductDetailToolbar";
import { ProductDetailTitle } from "./ProductDetailTitle";
import { TabButton } from "./TabButton";
import { DetailsTab } from "./DetailsTab";
import { DescriptionsTab, type OnTranslate } from "./DescriptionsTab";
import { LocalizationsTab } from "./LocalizationsTab";

type Tab = "details" | "descriptions" | "localizations";

export function ProductDetail() {
  const { selected: product, busy, clearSelection, goBack } = useProductDetail();
  const { openTranslation } = useTranslation();
  const [tab, setTab] = useState<Tab>("details");

  if (!product) {
    return <div className="empty">No product loaded.</div>;
  }

  const onBack = () => {
    clearSelection();
    goBack();
  };
  const onTranslate: OnTranslate = (params) =>
    openTranslation({ ...params, productId: product.Id });

  const langSet = new Set<string>();
  for (const loc of product.shortDescription ?? []) langSet.add(loc.languageCulture);
  for (const loc of product.FullDescription ?? []) langSet.add(loc.languageCulture);
  const locCount = langSet.size;

  return (
    <div className="w-full text-zinc-100">
      <div className="max-w-3xl mx-auto px-5 py-5">
        <ProductDetailToolbar product={product} busy={busy} onBack={onBack} />

        <div className="bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/20">
          <ProductDetailTitle product={product} />

          <div className="flex items-center gap-1 px-3 pt-3 border-b border-white/10">
            <TabButton active={tab === "details"} onClick={() => setTab("details")}>
              Details
            </TabButton>
            <TabButton
              active={tab === "descriptions"}
              onClick={() => setTab("descriptions")}
            >
              Descriptions
            </TabButton>
            <TabButton
              active={tab === "localizations"}
              onClick={() => setTab("localizations")}
              count={locCount}
            >
              Localizations
            </TabButton>
          </div>

          <div className="min-h-[200px]">
            {tab === "details" && <DetailsTab product={product} />}
            {tab === "descriptions" && (
              <DescriptionsTab product={product} onTranslate={onTranslate} />
            )}
            {tab === "localizations" && (
              <LocalizationsTab product={product} onTranslate={onTranslate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
