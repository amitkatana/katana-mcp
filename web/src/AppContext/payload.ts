import type {
  ProductDetailOutput,
  ResponseEnvelope,
} from "../features/products/types";
import type { TranslationOutput } from "../features/translations/types";

export const EMPTY_ENVELOPE: ResponseEnvelope = {
  pageIndex: 0,
  pageSize: 0,
  totalCount: 0,
  totalPages: 0,
  items: [],
};

export type ProductsMeta = Omit<ResponseEnvelope, "items">;

export function stripItems(env: ResponseEnvelope): ProductsMeta {
  const { items: _items, ...meta } = env;
  void _items;
  return meta;
}

function toEnvelope(v: unknown): ResponseEnvelope | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  if (Array.isArray((o as { items?: unknown }).items)) {
    return o as unknown as ResponseEnvelope;
  }
  return null;
}

export function extractEnvelope(out: unknown): ResponseEnvelope | null {
  if (!out || typeof out !== "object") return null;
  const o = out as Record<string, unknown>;
  const direct = toEnvelope(o.products);
  if (direct) return direct;
  return toEnvelope(out);
}

export function isTranslationPayload(v: unknown): v is TranslationOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return "field" in o || "language" in o || "translation" in o || "original" in o;
}

export function isProductDetailPayload(v: unknown): v is ProductDetailOutput {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return "product" in o && typeof o.product === "object" && o.product !== null;
}
