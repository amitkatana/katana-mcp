/**
 * Dev-only mock for `window.openai` so widgets can render outside ChatGPT.
 *
 * Install: import this module from each entry BEFORE rendering.
 *   if (import.meta.env.DEV) await import("./api/mock-bridge");
 *
 * Pages can be loaded directly:
 *   /product-list.html              → list of fake products
 *   /product-list.html?search=foo   → pre-filtered list
 *   /product-detail.html?id=2       → single product
 */
import type {
  Product,
  ProductDetail,
  ProductDetailOutput,
  ProductsOutput,
  ResponseEnvelope,
} from "../features/products/types";
import type { TranslationOutput } from "../features/translations/types";

const FAKE_PRODUCTS: Product[] = [
  {
    Id: 1,
    ProductType: 5,
    ProductTypeDescription: "Bearing",
    CreatedOnUtc: "2024-08-12T09:30:00Z",
    TextFieldsModel: {
      Name: "Industrial Bearing 6204-2RS",
      Sku: "BRG-6204",
      Gtin: "0123456789012",
    },
    Collections: {
      Images: [
        {
          Id: 101,
          Url: "https://picsum.photos/seed/bearing/80",
          AltTag: "Bearing",
          DisplayOrder: 0,
        },
      ],
    },
  },
  {
    Id: 2,
    ProductType: 5,
    ProductTypeDescription: "Fastener",
    CreatedOnUtc: "2024-09-02T14:11:00Z",
    UpdatedOnUtc: "2024-12-10T09:15:00Z",
    TextFieldsModel: {
      Name: "Stainless Bolt M8x40",
      Sku: "BOLT-M8-40",
      Gtin: "0123456789029",
      ShortDescription: "Grade A2 stainless steel hex bolt, 8mm shaft × 40mm length.",
      FullDescription:
        "<p>High-strength <strong>A2 stainless</strong> hex bolt suitable for outdoor and marine applications.</p>",
    },
    Collections: {
      Images: [
        {
          Id: 201,
          Url: "https://picsum.photos/seed/bolt/80",
          AltTag: "Bolt",
          DisplayOrder: 0,
        },
        {
          Id: 202,
          Url: "https://picsum.photos/seed/bolt2/80",
          AltTag: "Bolt alt",
          DisplayOrder: 1,
        },
      ],
    },
  },
  {
    Id: 3,
    ProductType: 15,
    ProductTypeDescription: "Child",
    CreatedOnUtc: "2024-10-21T11:05:00Z",
    TextFieldsModel: {
      Name: "Brass Hex Nut M8 (draft)",
      Sku: "NUT-M8",
    },
    Collections: { Images: [] },
  },
  {
    Id: 4,
    ProductType: 30,
    ProductTypeDescription: "Parent",
    CreatedOnUtc: "2024-11-15T08:45:00Z",
    TextFieldsModel: {
      Name: "Rubber Gasket 80mm",
      Sku: "GSK-80",
      Gtin: "0123456789043",
    },
    Collections: {
      Images: [
        {
          Id: 401,
          Url: "https://picsum.photos/seed/gasket/80",
          AltTag: "Gasket",
          DisplayOrder: 0,
        },
      ],
    },
  },
  {
    Id: 5,
    ProductType: 40,
    ProductTypeDescription: "Grand Parent",
    TextFieldsModel: {
      Name: "Unnamed prototype",
      Sku: "",
    },
  },
];

const FAKE_PRODUCT_DETAILS: Record<number, ProductDetail> = {
  2: {
    Id: 2,
    ProductTypeId: 10,
    Name: "Stainless Bolt M8x40",
    Sku: "BOLT-M8-40",
    Gtin: "0123456789029",
    ExternalKey: "EXT-002",
    Price: 1.49,
    OldPrice: 1.99,
    StockQuantity: 240,
    Published: true,
    CreatedOnUtc: "2024-09-02T14:11:00Z",
    UpdatedOnUtc: "2024-12-10T09:15:00Z",
    shortDescription: [
      { languageId: 1, languageCulture: "nl-NL", value: "RVS bout M8x40" },
      { languageId: 3, languageCulture: "fr-FR", value: "Boulon inox M8x40" },
    ],
    FullDescription: [
      {
        languageId: 1,
        languageCulture: "nl-NL",
        value: "<p>Hoogwaardige <strong>A2 RVS</strong> zeskantbout.</p>",
      },
    ],
  },
};

function detailFor(id: number): ProductDetail {
  const existing = FAKE_PRODUCT_DETAILS[id];
  if (existing) return existing;
  const p = FAKE_PRODUCTS.find((x) => x.Id === id) ?? FAKE_PRODUCTS[0];
  const tf = p.TextFieldsModel;
  return {
    Id: p.Id,
    ProductTypeId: p.ProductType ?? null,
    Name: tf.Name,
    Sku: tf.Sku ?? "",
    Gtin: tf.Gtin ?? "",
    ExternalKey: "",
    Price: 0,
    OldPrice: 0,
    StockQuantity: 0,
    Published: true,
    CreatedOnUtc: p.CreatedOnUtc ?? null,
    UpdatedOnUtc: p.UpdatedOnUtc ?? null,
    shortDescription: [],
    FullDescription: [],
  };
}

const STATE_KEY = "katana-mock-widget-state";

function emit(): void {
  window.dispatchEvent(new CustomEvent("openai:set_globals"));
}

function filtered(search?: string, limit?: number): Product[] {
  let rows = FAKE_PRODUCTS;
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter((p) => {
      const tf = p.TextFieldsModel;
      return (
        tf.Name.toLowerCase().includes(q) ||
        (tf.Sku ?? "").toLowerCase().includes(q) ||
        (tf.Gtin ?? "").toLowerCase().includes(q)
      );
    });
  }
  if (limit) rows = rows.slice(0, limit);
  return rows;
}

function envelope(items: Product[], limit?: number): ResponseEnvelope {
  const pageSize = limit ?? items.length;
  return {
    pageIndex: 0,
    pageSize,
    totalCount: FAKE_PRODUCTS.length,
    totalPages: pageSize > 0 ? Math.ceil(FAKE_PRODUCTS.length / pageSize) : 1,
    items,
  };
}

const FAKE_TRANSLATION: TranslationOutput = {
  product_id: 2,
  field: "name",
  language: "fr-FR",
  original: "Stainless Bolt M8x40",
  translation: "Boulon inox M8x40",
};

function buildInitialOutput(): ProductsOutput | ProductDetailOutput | TranslationOutput {
  const url = new URL(window.location.href);
  const path = url.pathname;
  if (path.endsWith("product-detail.html")) {
    const id = Number(url.searchParams.get("id") ?? 2);
    const detail = detailFor(id);
    return { product: detail, product_id: detail.Id };
  }
  if (path.endsWith("translation-review.html")) {
    const out: TranslationOutput = { ...FAKE_TRANSLATION };
    const pid = url.searchParams.get("product_id");
    if (pid) out.product_id = Number(pid);
    const lang = url.searchParams.get("language");
    if (lang) out.language = lang;
    return out;
  }
  const search = url.searchParams.get("search") ?? "";
  const limitStr = url.searchParams.get("limit");
  const limit = limitStr ? Number(limitStr) : 50;
  return { products: envelope(filtered(search, limit), limit), query: search, limit };
}

function loadState(): unknown {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(s: unknown): void {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

function install(): void {
  if ((window as any).openai) return; // real host present, skip

  const bridge = {
    toolOutput: buildInitialOutput() as unknown,
    widgetState: loadState() as unknown,

    async callTool(name: string, args: Record<string, unknown>) {
      console.log("[mock] callTool", name, args);
      let structuredContent: ProductsOutput | ProductDetailOutput | TranslationOutput;
      if (name === "product_list" || name === "list_products") {
        const search =
          (args.query as string | undefined) ??
          (args.search as string | undefined) ??
          "";
        const limit = (args.limit as number | undefined) ?? 50;
        structuredContent = {
          products: envelope(filtered(search, limit), limit),
          query: search,
          limit,
        };
      } else if (name === "product_detail") {
        const id = Number(args.product_id ?? args.id);
        await new Promise((r) => setTimeout(r, 200));
        const detail = detailFor(id);
        structuredContent = { product: detail, product_id: detail.Id };
      } else if (name === "update_translation") {
        // simulate latency + echo back saved translation
        await new Promise((r) => setTimeout(r, 400));
        const prev = (bridge.toolOutput as TranslationOutput) ?? {};
        structuredContent = {
          ...prev,
          translation: String(args.translation ?? ""),
          saved: true,
        };
      } else {
        structuredContent = { products: envelope([], 0) };
      }
      bridge.toolOutput = structuredContent;
      emit();
      return { structuredContent };
    },

    async setWidgetState(state: unknown) {
      bridge.widgetState = state;
      saveState(state);
    },

    async sendFollowUpMessage({ prompt }: { prompt: string }) {
      console.log("[mock] sendFollowUpMessage:", prompt);
      // crude routing for dev: detect "details for product N" / "list again"
      const m = prompt.match(/product\s+(\d+)/i);
      if (m) {
        window.location.href = `/product-detail.html?id=${m[1]}`;
        return;
      }
      if (/list/i.test(prompt)) {
        window.location.href = "/product-list.html";
        return;
      }
    },
  };

  (window as any).openai = bridge;

  // Dev banner so it's obvious you're in mock mode
  const banner = document.createElement("div");
  banner.textContent = "MOCK MODE — fake data, no real MCP server";
  Object.assign(banner.style, {
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    background: "#fde68a",
    color: "#7c2d12",
    fontFamily: "system-ui, sans-serif",
    fontSize: "11px",
    fontWeight: "600",
    textAlign: "center",
    padding: "4px",
    zIndex: "9999",
    letterSpacing: "0.04em",
  } satisfies Partial<CSSStyleDeclaration>);
  document.addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(banner);
  });
}

install();
