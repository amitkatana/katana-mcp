type Props = { original?: string };

export function TranslationOriginal({ original }: Props) {
  if (!original) return null;
  return (
    <section className="translation-original">
      <span className="label">Original</span>
      <p>{original}</p>
    </section>
  );
}
