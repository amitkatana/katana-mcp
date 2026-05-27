import React from "react";
import { createRoot } from "react-dom/client";
if (import.meta.env.DEV) await import("../api/mock-bridge");
import "../main.css";
import "../index.css";
import "../features/products/product.css";
import "../features/translations/translation.css";
import { AppProviders } from "../AppContext";
import { useTranslation } from "../AppContext/TranslationContext";
import { ProductDetail } from "../features/products";
import { TranslationReview } from "../features/translations";

function App() {
  const { translation } = useTranslation();
  return translation ? <TranslationReview /> : <ProductDetail />;
}

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
);
