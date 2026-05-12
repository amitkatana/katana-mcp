import { Button } from "@openai/apps-sdk-ui/components/Button";

type Props = {
  language?: string;
  hasOriginal: boolean;
  busy: boolean;
  onAsk: () => void;
};

export function TranslationAskAi({ language, hasOriginal, busy, onAsk }: Props) {
  const isDutch = language === "nl-NL";
  return (
    <div className="translation-ai-actions">
      <Button
        type="button"
        color="secondary"
        variant="soft"
        size="sm"
        disabled={busy || !isDutch || !hasOriginal}
        onClick={onAsk}
        title={
          isDutch
            ? "Ask ChatGPT to translate the original into Dutch"
            : "Only Dutch (nl-NL) is supported for now"
        }
      >
        {busy ? "Asking ChatGPT…" : "Ask ChatGPT to translate (Dutch)"}
      </Button>
      {!isDutch && (
        <span className="translation-status">
          ChatGPT translations only support Dutch right now.
        </span>
      )}
    </div>
  );
}
