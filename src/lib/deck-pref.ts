import type { DeckKey } from "./themes";

const KEY = "vaporware_deck";

export function getDeck(): DeckKey {
  if (typeof window === "undefined") return "all";
  try {
    return window.localStorage.getItem(KEY) === "ai-2026" ? "ai-2026" : "all";
  } catch {
    return "all";
  }
}

export function setDeck(key: DeckKey): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, key);
  } catch {
    return;
  }
}
