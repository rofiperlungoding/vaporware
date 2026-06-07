const CAUGHT_KEY = "vaporware_caught";

export function hasBeenCaught(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(CAUGHT_KEY) === "1";
  } catch {
    return false;
  }
}

export function markCaught(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(CAUGHT_KEY, "1");
  } catch {
    return;
  }
}
