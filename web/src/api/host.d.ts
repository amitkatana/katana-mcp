declare global {
  interface Window {
    openai?: {
      toolInput?: unknown;
      toolOutput?: unknown;
      widgetState?: unknown;
      setWidgetState?: (state: unknown) => Promise<void>;
      callTool?: (
        name: string,
        args: Record<string, unknown>,
      ) => Promise<{ structuredContent?: unknown }>;
      sendFollowupTurn?: (opts: { prompt: string }) => Promise<void>;
      theme?: "light" | "dark";
      locale?: string;
      maxHeight?: number;
    };
  }
}

export {};
