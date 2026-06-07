"use client";

import { motion } from "motion/react";
import type { IdeaWithStats } from "@/lib/types";

type Outcome = "paid" | "bailed" | "passed";

function stampFor(idea: IdeaWithStats): { label: string; color: string } {
  const { sayRate, doRate } = idea.stats;
  if (sayRate >= 45 && doRate < 18) return { label: "All Talk", color: "var(--color-nope)" };
  if (doRate >= 40) return { label: "Real Demand", color: "var(--color-cash)" };
  return { label: "Lukewarm", color: "var(--color-gold)" };
}

function verdict(idea: IdeaWithStats, outcome: Outcome): string {
  const { sayRate, doRate } = idea.stats;
  if (outcome === "paid") {
    return doRate < 25
      ? "You actually clicked. You're rarer than the crowd suggests."
      : "You clicked — and so do most who get this far. That's real demand.";
  }
  if (outcome === "bailed") {
    return "You said you'd pay, then bailed at checkout. That's the gap, live.";
  }
  return sayRate > 55
    ? "You passed on a crowd favourite. Contrarian, or correct?"
    : "Hard pass. The crowd mostly agrees with you on this one.";
}

export default function Reveal({
  idea,
  outcome,
  onNext,
}: {
  idea: IdeaWithStats;
  outcome: Outcome;
  onNext: () => void;
}) {
  const { sayRate, doRate } = idea.stats;
  const stamp = stampFor(idea);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[150] flex flex-col justify-between rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
            The say–do gap
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-[var(--color-ink)]">
            {idea.oneLiner}
          </h3>
        </div>
        <motion.span
          initial={{ scale: 1.6, opacity: 0, rotate: -18 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 14 }}
          className="stamp shrink-0 text-sm"
          style={{ color: stamp.color }}
        >
          {stamp.label}
        </motion.span>
      </div>

      <div className="space-y-5 py-2">
        <Stat label="said “take my money”" value={sayRate} color="var(--color-ink)" delay={0.05} />
        <Stat label="actually clicked pay" value={doRate} color="var(--color-cash-2)" delay={0.28} />
      </div>

      <div>
        <p className="mb-4 text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {verdict(idea, outcome)}
        </p>
        <button
          onClick={onNext}
          className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] py-3 font-display text-base font-bold text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Next idea →
        </button>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  color,
  delay,
}: {
  label: string;
  value: number;
  color: string;
  delay: number;
}) {
  return (
    <div>
      <div className="flex items-end justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-soft)]">
          {label}
        </span>
        <span className="font-display text-3xl font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="mt-2 h-3 overflow-hidden border border-[var(--color-ink)] bg-[var(--color-paper)]">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
