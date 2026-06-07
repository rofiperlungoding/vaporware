export type ThemeId = "classic" | "ai-2026";
export type DeckKey = "all" | "ai-2026";

export type DeckMeta = {
  key: DeckKey;
  label: string;
  banner: string;
};

export const DECKS: DeckMeta[] = [
  { key: "all", label: "All", banner: "" },
  {
    key: "ai-2026",
    label: "AI Startups 2026",
    banner: "Everyone shipped these. Who'd actually pay?",
  },
];

const PREFIXES: { prefix: string; theme: ThemeId }[] = [
  { prefix: "seed-ai2026-", theme: "ai-2026" },
];

export function themeForId(id: string): ThemeId {
  for (const p of PREFIXES) {
    if (id.startsWith(p.prefix)) return p.theme;
  }
  return "classic";
}

export function deckMeta(key: DeckKey): DeckMeta {
  return DECKS.find((d) => d.key === key) ?? DECKS[0];
}

export function matchesDeck(id: string, key: DeckKey): boolean {
  if (key === "all") return true;
  return themeForId(id) === key;
}
