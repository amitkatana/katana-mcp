import type { ReactNode } from "react";

type Props = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  count?: number;
};

export function TabButton({ active, onClick, children, count }: Props) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-md transition-colors relative ${
        active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {children}
      {count != null && count > 0 && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-300 leading-none">
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-t-full" />
      )}
    </button>
  );
}
