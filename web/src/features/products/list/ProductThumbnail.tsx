import type { ProductImage } from "../types";

type Props = {
  image: ProductImage | null;
  alt: string;
};

export function ProductThumbnail({ image, alt }: Props) {
  if (image?.Url) {
    return (
      <img
        src={image.Url}
        alt={image.AltTag ?? alt}
        loading="lazy"
        className="shrink-0 w-10 h-10 rounded-md object-cover bg-gray-100 border border-gray-200"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="shrink-0 w-10 h-10 rounded-md bg-gray-100 border border-gray-200
                 flex items-center justify-center text-gray-400"
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}
