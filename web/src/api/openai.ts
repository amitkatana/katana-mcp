import { useCallback, useEffect, useRef, useState } from "react";

export type OpenAIBridge = NonNullable<Window["openai"]>;

export function getBridge(): OpenAIBridge | undefined {
  return window.openai;
}

/** Subscribe to host global updates (toolOutput, theme, etc.). */
export function useHostGlobals(onChange: () => void): void {
  const ref = useRef(onChange);
  ref.current = onChange;
  useEffect(() => {
    const handler = () => ref.current();
    window.addEventListener("openai:set_globals", handler);
    return () => window.removeEventListener("openai:set_globals", handler);
  }, []);
}

/** Read structured tool output as a typed value. */
export function readToolOutput<T>(fallback: T): T {
  const out = getBridge()?.toolOutput as T | undefined;
  console.log(out,"FOEM MCS ")
  return out ?? fallback;
}

/** Persist a snapshot of widget state on the host. Safe no-op if unsupported. */
export async function setWidgetState(state: unknown): Promise<void> {
  try {
    await getBridge()?.setWidgetState?.(state);
  } catch {
    /* host without persistence */
  }
}

export function readWidgetState<T>(fallback: T): T {
  const s = getBridge()?.widgetState as T | undefined;
  return s ?? fallback;
}

/** Send a follow-up turn to ChatGPT so the assistant replies. */
export async function sendFollowupTurn(prompt: string): Promise<void> {
  try {
    await getBridge()?.sendFollowupTurn?.({ prompt });
  } catch {
    /* host without followup support */
  }
}

/** Hook returning a `callTool` that tracks busy state and applies a result mapper. */
export function useToolCaller<TOut>(
  applyResult: (sc: TOut) => void,
): {
  call: (name: string, args: Record<string, unknown>) => Promise<TOut | undefined>;
  busy: boolean;
} {
  const [busy, setBusy] = useState(false);
  const apply = useRef(applyResult);
  apply.current = applyResult;
  const call = useCallback(async (name: string, args: Record<string, unknown>) => {
    const bridge = getBridge();
    if (!bridge?.callTool) return undefined;
    setBusy(true);
    try {
      const res = await bridge.callTool(name, args);
      const sc = res?.structuredContent as TOut | undefined;
      if (sc) apply.current(sc);
      return sc;
    } finally {
      setBusy(false);
    }
  }, []);
  return { call, busy };
}
