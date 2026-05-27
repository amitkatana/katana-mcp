import { Textarea } from "@openai/apps-sdk-ui/components/Textarea";
import { Button } from "@openai/apps-sdk-ui/components/Button";
import { Badge } from "@openai/apps-sdk-ui/components/Badge";
import { Alert } from "@openai/apps-sdk-ui/components/Alert";

type Props = {
  draft: string;
  setDraft: (v: string) => void;
  busy: boolean;
  dirty: boolean;
  justSaved: boolean;
  error?: string;
  onUpdate: () => void;
};

export function TranslationEditor({
  draft,
  setDraft,
  busy,
  dirty,
  justSaved,
  error,
  onUpdate,
}: Props) {
  return (
    <>
      <label
        className="translation-label"
        htmlFor="translation-input text-white"
      >
        Translation
      </label>
      <Textarea
        id="translation-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Type the translation…"
        disabled={busy}
        rows={6}
        autoResize
        maxRows={16}
        size="md"
      />

      <div className="translation-actions">
        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          onClick={onUpdate}
          disabled={busy || !dirty}
        >
          {busy ? "Updating…" : "Update"}
        </Button>

        {dirty && !busy && (
          <span className="translation-status">
            <span className="dirty-dot" aria-hidden /> Unsaved changes
          </span>
        )}
        {justSaved && (
          <Badge color="success" size="sm" pill>
            Saved
          </Badge>
        )}
      </div>

      {error && (
        <Alert
          color="danger"
          variant="soft"
          title="Update failed"
          description={error}
        />
      )}
    </>
  );
}
