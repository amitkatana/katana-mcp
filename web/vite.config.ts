import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// One entry per build. Set ENTRY=product-list|product-detail|translation-review.
const ENTRY = process.env.ENTRY ?? "product-list";

export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: "../apps/katana-mcp/dist",
    emptyOutDir: false,
    target: "es2020",
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: { [ENTRY]: resolve(__dirname, `${ENTRY}.html`) },
      output: { inlineDynamicImports: true },
    },
  },
});
