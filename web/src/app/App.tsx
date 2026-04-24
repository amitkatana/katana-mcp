import { ProductDetail, ProductList, useProducts } from "../features/products";

export function App() {
  const { products, selectedId, busy, selectProduct, searchProducts, loadProduct } =
    useProducts();
  const selected = products.find((p) => p.id === selectedId) ?? null;

  if (selected) {
    return (
      <ProductDetail
        product={selected}
        busy={busy}
        onBack={() => selectProduct(null)}
      />
    );
  }

  return (
    <ProductList
      products={products}
      busy={busy}
      onSearch={(q) => searchProducts(q)}
      onSelect={async (id) => {
        selectProduct(id);
        await loadProduct(id);
      }}
    />
  );
}
