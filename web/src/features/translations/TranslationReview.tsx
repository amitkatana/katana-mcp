import { useEffect, useState } from "react";
import { useOpenAi } from "../../AppContext/OpenAiContext";
import { TranslationHeader } from "./TranslationHeader";
import { TranslationOriginal } from "./TranslationOriginal";
import { TranslationAskAi } from "./TranslationAskAi";
import { TranslationEditor } from "./TranslationEditor";

export function TranslationReview() {
  const {
    translation,
    busy,
    justSaved,
    closeTranslation,
    updateTranslation,
    requestTranslation,
  } = useOpenAi();
  const [draft, setDraft] = useState<string>(translation?.translation ?? "");

  useEffect(() => {
    setDraft(translation?.translation ?? "");
  }, [
    translation?.product_id,
    translation?.field,
    translation?.language,
    translation?.translation,
  ]);

  if (!translation) {
    return <div className="empty">No translation loaded.</div>;
  }

  const dirty = draft !== (translation.translation ?? "");

  return (
    <div className="translation-app">
      <TranslationHeader translation={translation} onBack={closeTranslation} />
      <TranslationOriginal original={translation.original} />
      <TranslationAskAi
        language={translation.language}
        hasOriginal={!!translation.original}
        busy={busy}
        onAsk={() => void requestTranslation()}
      />
      <TranslationEditor
        draft={draft}
        setDraft={setDraft}
        busy={busy}
        dirty={dirty}
        justSaved={justSaved}
        error={translation.error}
        onUpdate={() => void updateTranslation(draft)}
      />
    </div>
  );
}

export default TranslationReview;
