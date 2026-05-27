import React from "react";
import { createRoot } from "react-dom/client";
if (import.meta.env.DEV) await import("../api/mock-bridge");
import "../main.css";
import "../index.css";
import "../features/products/product.css";
import "../features/translations/translation.css";
import { OpenAiProvider, useOpenAi } from "../AppContext/OpenAiContext";
import { ProductDetail } from "../features/products";
import { TranslationReview } from "../features/translations";

function App() {
  const { translation } = useOpenAi();
  return translation ? <TranslationReview /> : <ProductDetail />;
}

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <OpenAiProvider>
      <App />
    </OpenAiProvider>
  </React.StrictMode>,
);
