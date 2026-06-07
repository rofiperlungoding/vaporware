export const APP_NAME = "Vaporware";
export const APP_TAGLINE = "Everyone says they'd pay. Few actually click.";
export const APP_DESCRIPTION =
  "A validation arcade for product ideas. Swipe what you'd pay for — then we measure who actually pulls out their wallet. The gap between what people say and what they do is the whole point.";

export const NUMBERS_DISCLOSURE =
  "Starting numbers are seeded demo data, modeled on real painted-door test benchmarks and the documented intention–behavior gap. Every swipe you make adds to the real tally on top.";

export const SWIPE_THRESHOLD = 110;

export const SIGNUP_NUDGE_AFTER = 5;

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return value === "1" || value.toLowerCase() === "true";
}

export const FEATURES = {
  themedDecks: flag(process.env.NEXT_PUBLIC_FEATURE_THEMED_DECKS, true),
  segmentedGap: flag(process.env.NEXT_PUBLIC_FEATURE_SEGMENTED_GAP, true),
  liveTicker: flag(process.env.NEXT_PUBLIC_FEATURE_LIVE_TICKER, true),
  trustLayer: flag(process.env.NEXT_PUBLIC_FEATURE_TRUST_LAYER, true),
  paintedDoorLink: flag(process.env.NEXT_PUBLIC_FEATURE_PAINTED_DOOR_LINK, true),
} as const;

export type FeatureName = keyof typeof FEATURES;
