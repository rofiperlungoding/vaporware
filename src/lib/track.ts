type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    novus?: {
      track?: (event: string, props?: TrackProps) => void;
      initialize?: (config?: Record<string, unknown>) => void;
    };
    pendo?: {
      track?: (event: string, props?: TrackProps) => void;
      initialize?: (config?: Record<string, unknown>) => void;
    };
  }
}

function sendToNovus(event: string, props?: TrackProps): void {
  const agent = window.novus ?? window.pendo;
  agent?.track?.(event, props);
}

export function track(event: string, props?: TrackProps): void {
  if (typeof window === "undefined") return;
  try {
    sendToNovus(event, props);
  } catch {
    return;
  }
}
