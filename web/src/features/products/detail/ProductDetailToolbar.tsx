import { Button } from "@openai/apps-sdk-ui/components/Button";
import { ArrowLeftSm } from "@openai/apps-sdk-ui/components/Icon";
import type { ProductDetail } from "../types";

type Props = {
  product: ProductDetail;
  busy: boolean;
  onBack: () => void;
};

export function ProductDetailToolbar({ product, busy, onBack }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        color="secondary"
        size="sm"
        onClick={onBack}
        disabled={busy}
      >
        <ArrowLeftSm className="w-4 h-4" />
        Back
      </Button>
      <span className="font-mono text-xs text-[var(--color-text-tertiary)]">
        #{product.id}
      </span>
    </div>
  );
}
