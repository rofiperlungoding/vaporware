// Client-side profile: an anonymous player's own picks + an optional local
// "account". No sign-in required to play. Everything lives in localStorage for
// now; when the backend lands, swap these bodies for Supabase Auth + a picks
// table keyed by user id. The rest of the app talks only to these functions.

export type PickDecision = "paid" | "bailed" | "passed";

export type Pick = {
  ideaId: string;
  oneLiner: string;
  category: string;
  price: string;
  decision: PickDecision;
  ts: number;
};

export type Account = { name: string; email: string; since: number };

const PICKS_KEY = "vaporware_picks";
const ACCOUNT_KEY = "vaporware_account";
const NUDGE_KEY = "vaporware_nudge_dismissed";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / disabled — fail quietly, play continues
  }
}

export function getPicks(): Pick[] {
  return read<Pick[]>(PICKS_KEY, []);
}

// One pick per idea — the latest decision wins (handles reshuffles/replays).
export function addPick(pick: Pick): Pick[] {
  const picks = getPicks().filter((p) => p.ideaId !== pick.ideaId);
  picks.push(pick);
  write(PICKS_KEY, picks);
  return picks;
}

export function clearPicks(): void {
  write(PICKS_KEY, []);
}

export function getAccount(): Account | null {
  return read<Account | null>(ACCOUNT_KEY, null);
}

export function saveAccount(name: string, email: string): Account {
  const account: Account = {
    name: name.trim().slice(0, 60),
    email: email.trim().slice(0, 120),
    since: Date.now(),
  };
  write(ACCOUNT_KEY, account);
  return account;
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCOUNT_KEY);
}

export function isNudgeDismissed(): boolean {
  return read<boolean>(NUDGE_KEY, false);
}

export function dismissNudge(): void {
  write(NUDGE_KEY, true);
}
