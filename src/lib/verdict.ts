import { getPicks } from "./profile";

export type Scorecard = {
  saidYesCount: number;
  paidCount: number;
  bailedCount: number;
  passedCount: number;
  totalJudged: number;
  personalGap: number;
};

export function getSessionScorecard(): Scorecard {
  const picks = getPicks();
  const paidCount = picks.filter((p) => p.decision === "paid").length;
  const bailedCount = picks.filter((p) => p.decision === "bailed").length;
  const passedCount = picks.filter((p) => p.decision === "passed").length;
  const saidYesCount = paidCount + bailedCount;
  const totalJudged = picks.length;
  const personalGap = Math.round(
    ((saidYesCount - paidCount) / Math.max(saidYesCount, 1)) * 100,
  );
  return {
    saidYesCount,
    paidCount,
    bailedCount,
    passedCount,
    totalJudged,
    personalGap,
  };
}

export type VerdictTierId =
  | "wallet-matches-mouth"
  | "lukewarm"
  | "certified-talker"
  | "pure-vapor";

export type VerdictTier = {
  id: VerdictTierId;
  title: string;
  roast: string;
  color: string;
};

export function verdict(gap: number): VerdictTier {
  if (gap <= 15) {
    return {
      id: "wallet-matches-mouth",
      title: "Wallet Matches Mouth",
      roast:
        "Rare specimen. When you said you'd pay, you mostly meant it. The market could use more of you.",
      color: "var(--color-cash-2)",
    };
  }
  if (gap <= 45) {
    return {
      id: "lukewarm",
      title: "Lukewarm",
      roast:
        "Some spine, mostly vibes. You commit when it's cheap and ghost when it counts.",
      color: "var(--color-gold)",
    };
  }
  if (gap <= 75) {
    return {
      id: "certified-talker",
      title: "Certified Talker",
      roast:
        "Big yeses, light wallet. You'd fund the entire arcade in theory and none of it in practice.",
      color: "var(--color-nope)",
    };
  }
  return {
    id: "pure-vapor",
    title: "Pure Vapor",
    roast:
      "All hat, no cattle. You're the exact user that kills startups at the seed round. We named the app after you.",
    color: "var(--color-nope)",
  };
}
