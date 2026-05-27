import type { ProductDetail } from "../types";

type Props = {
  product: ProductDetail;
  busy: boolean;
  onBack: () => void;
};

export function ProductDetailToolbar({ product, busy, onBack }: Props) {
  return (
    <div className="flex items-center justify-between mb-5">
      <button
        onClick={onBack}
        disabled={busy}
        className="inline-flex items-center gap-1.5 px-3 h-9 text-sm font-medium
                   text-zinc-200 bg-white/[0.06] border border-white/10 rounded-lg
                   hover:bg-white/[0.1] hover:border-white/20 active:bg-white/[0.14]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   backdrop-blur-sm transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <span className="text-xs font-mono text-zinc-500 tracking-wide">
        Product #{product.Id}
      </span>
    </div>
  );
}
