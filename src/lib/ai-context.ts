import { verdict, type VerdictTierId } from "./verdict";
import type { Pick } from "./profile";

export type GroundingIdea = { title: string; category: string };

export type Grounding = {
  tier: VerdictTierId;
  saidYes: number;
  paid: number;
  bailed: number;
  passed: number;
  personalGap: number;
  contradictions: GroundingIdea[];
  honored: GroundingIdea[];
};

function toIdea(p: Pick): GroundingIdea {
  return { title: p.oneLiner.slice(0, 120), category: p.category.slice(0, 40) };
}

function recent(arr: Pick[]): GroundingIdea[] {
  return [...arr]
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 6)
    .map(toIdea);
}

export function buildGrounding(picks: Pick[]): Grounding {
  const paidPicks = picks.filter((p) => p.decision === "paid");
  const bailedPicks = picks.filter((p) => p.decision === "bailed");
  const passedPicks = picks.filter((p) => p.decision === "passed");

  const paid = paidPicks.length;
  const bailed = bailedPicks.length;
  const passed = passedPicks.length;
  const saidYes = paid + bailed;
  const personalGap = Math.round(((saidYes - paid) / Math.max(saidYes, 1)) * 100);

  return {
    tier: verdict(personalGap).id,
    saidYes,
    paid,
    bailed,
    passed,
    personalGap,
    contradictions: recent(bailedPicks),
    honored: recent(paidPicks),
  };
}
