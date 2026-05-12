import React from "react";
import { createRoot } from "react-dom/client";
if (import.meta.env.DEV) await import("../api/mock-bridge");
import "@openai/apps-sdk-ui/css";
import "../main.css";
import "../index.css";
import "../features/translations/translation.css";
import { AppsSDKUIProvider } from "@openai/apps-sdk-ui/components/AppsSDKUIProvider";
import { OpenAiProvider } from "../AppContext/OpenAiContext";
import { TranslationReview } from "../features/translations";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppsSDKUIProvider linkComponent="a">
      <OpenAiProvider>
        <TranslationReview />
      </OpenAiProvider>
    </AppsSDKUIProvider>
  </React.StrictMode>,
);
