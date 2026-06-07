// Thin analytics shim. Novus auto-captures clicks/pageviews once its snippet is in
// the layout, but we also fire explicit, named events for the behaviors that matter
// most — especially the "moment of truth" wallet click. When Novus is installed,
// route these to its track API here in one place.
type TrackProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    // Novus / Pendo style agent global (present once the snippet is installed).
    novus?: { track?: (event: string, props?: TrackProps) => void };
    pendo?: { track?: (event: string, props?: TrackProps) => void };
  }
}

export function track(event: string, props?: TrackProps): void {
  if (typeof window === "undefined") return;
  try {
    window.novus?.track?.(event, props);
    window.pendo?.track?.(event, props);
  } catch {
    // never let analytics break the UX
  }
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.debug("[track]", event, props ?? {});
  }
}
