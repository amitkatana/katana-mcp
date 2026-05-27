import type { ReactNode } from "react";
import { ProductsProvider } from "./ProductsContext";
import { ProductDetailProvider } from "./ProductDetailContext";
import { TranslationProvider } from "./TranslationContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ProductsProvider>
      <ProductDetailProvider>
        <TranslationProvider>{children}</TranslationProvider>
      </ProductDetailProvider>
    </ProductsProvider>
  );
}
