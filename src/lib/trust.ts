const SEEN = "vaporware_trust_seen";
const CONSENT = "vaporware_consent";

const ALL_KEYS = [
  "vaporware_picks",
  "vaporware_account",
  "vaporware_nudge_dismissed",
  "vaporware_session",
  "vaporware_deck",
  SEEN,
  CONSENT,
];

export function hasSeenDisclosure(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(SEEN) === "1";
  } catch {
    return true;
  }
}

export function markDisclosure(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SEEN, "1");
  } catch {
    return;
  }
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(CONSENT) === "1";
  } catch {
    return false;
  }
}

export function setConsent(value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT, value ? "1" : "0");
  } catch {
    return;
  }
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  try {
    for (const k of ALL_KEYS) window.localStorage.removeItem(k);
    window.sessionStorage.removeItem("vaporware_caught");
  } catch {
    return;
  }
}
