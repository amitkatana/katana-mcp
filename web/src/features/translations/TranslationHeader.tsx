import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import type { TranslationOutput } from "./types";

type Props = {
  translation: TranslationOutput;
  onBack: () => void;
};

export function TranslationHeader({ translation, onBack }: Props) {
  return (
    <header className="translation-header">
      <div className="translation-title">
        <button
          type="button"
          onClick={onBack}
          className="translation-back text-white"
        >
          ← Back
        </button>
        <h1 className="text-white">Translation Review</h1>
        <div className="translation-tags">
          {translation.field && (
            <Badge color="secondary" size="sm" pill>
              {translation.field}
            </Badge>
          )}
          {translation.language && (
            <Badge color="info" size="sm" pill>
              {translation.language}
            </Badge>
          )}
          {translation.product_id != null && (
            <Badge color="discovery" size="sm" pill>
              #{translation.product_id}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
