export const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (iso: string | null | undefined) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

export const isHtml = (s: string) => /<[a-z][\s\S]*>/i.test(s);
