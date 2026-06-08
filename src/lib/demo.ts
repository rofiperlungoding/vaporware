import { addPick, clearPicks } from "./profile";
import { setDeck } from "./deck-pref";

const SEED = [
  {
    ideaId: "seed-ai2026-cofounder",
    oneLiner: "An AI co-founder that owns 50% and never replies on weekends",
    category: "AI",
    price: "$49/mo",
    decision: "bailed" as const,
  },
  {
    ideaId: "seed-ai2026-dating-ghostwriter",
    oneLiner:
      "AI that writes your dating-app replies so you never have to be charming",
    category: "AI",
    price: "$9/mo",
    decision: "bailed" as const,
  },
  {
    ideaId: "seed-ai2026-prompt-wrapper",
    oneLiner: "A $200/mo wrapper around a free model with a nicer logo",
    category: "AI",
    price: "$200/mo",
    decision: "bailed" as const,
  },
  {
    ideaId: "seed-ai2026-agent-swarm",
    oneLiner: "Deploy 40 AI agents to do the job one intern could",
    category: "AI",
    price: "$99/mo",
    decision: "bailed" as const,
  },
  {
    ideaId: "seed-ai2026-receipt-scanner",
    oneLiner: "AI that files your expenses the second you tap pay",
    category: "Fintech",
    price: "$7/mo",
    decision: "paid" as const,
  },
];

function safeRemove(store: Storage | undefined, key: string): void {
  try {
    store?.removeItem(key);
  } catch {
    return;
  }
}

export function maybeRunDemo(): boolean {
  if (typeof window === "undefined") return false;
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(window.location.search);
  } catch {
    return false;
  }
  if (params.get("demo") !== "1") return false;

  clearPicks();
  safeRemove(window.sessionStorage, "vaporware_caught");
  safeRemove(window.localStorage, "vaporware_trust_seen");

  const now = Date.now();
  SEED.forEach((p, i) => addPick({ ...p, ts: now + i }));
  setDeck("ai-2026");

  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch {
    return true;
  }
  return true;
}
