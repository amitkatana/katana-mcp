import { useEffect, useState } from "react";
import {
  readToolOutput,
  readWidgetState,
  setWidgetState,
  useHostGlobals,
  useToolCaller,
} from "../../api/openai";
import type { Product, ProductsOutput } from "./types";

const EMPTY: ProductsOutput = { products: [] };

type WidgetState = { selectedId: number | null };

export function useProducts() {
  const initial = readToolOutput<ProductsOutput>(EMPTY);
  const [products, setProducts] = useState<Product[]>(initial.products);
  const [selectedId, setSelectedId] = useState<number | null>(
    () => readWidgetState<WidgetState>({ selectedId: null }).selectedId,
  );

  useHostGlobals(() => setProducts(readToolOutput<ProductsOutput>(EMPTY).products));

  useEffect(() => {
    void setWidgetState({ selectedId });
  }, [selectedId]);

  const { call, busy } = useToolCaller<ProductsOutput>((sc) => {
    if (Array.isArray(sc.products)) setProducts(sc.products);
  });

  return {
    products,
    selectedId,
    busy,
    selectProduct: setSelectedId,
    searchProducts: (search: string, limit = 50) =>
      call("list_products", { search, limit }),
    refreshProducts: (limit = 50) => call("list_products", { limit }),
    loadProduct: (id: number) => call("get_product", { id }),
  };
}
