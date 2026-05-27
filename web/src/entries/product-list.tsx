import React from "react";
import { createRoot } from "react-dom/client";
if (import.meta.env.DEV) await import("../api/mock-bridge");
import "@openai/apps-sdk-ui/css";
import "../main.css";
import "../index.css";
import "../features/products/product.css";
import "../features/translations/translation.css";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { AppProviders } from "../AppContext";
import { useProductDetail } from "../AppContext/ProductDetailContext";
import { useTranslation } from "../AppContext/TranslationContext";
import { ProductList, ProductDetail } from "../features/products";
import { TranslationReview } from "../features/translations";

function ProductListApp() {
  const { selected } = useProductDetail();
  const { translation } = useTranslation();
  if (translation) return <TranslationReview />;
  if (selected) return <ProductDetail />;
  return <ProductList />;
}

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <AppsSDKUIProvider linkComponent="a">
      <AppProviders>
        <ProductListApp />
      </AppProviders>
    </AppsSDKUIProvider>
  </React.StrictMode>,
);
