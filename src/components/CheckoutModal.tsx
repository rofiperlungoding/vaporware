"use client";

import { motion } from "motion/react";
import type { IdeaWithStats } from "@/lib/types";

// The point of the whole product: people say "take my money" freely, but a real
// checkout button is where intent meets friction. We measure who actually clicks.
// Styled as a receipt slip to reinforce the wallet/demand metaphor.
export default function CheckoutModal({
  idea,
  onConfirm,
  onBail,
}: {
  idea: IdeaWithStats;
  onConfirm: () => void;
  onBail: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[200] flex items-center justify-center bg-[var(--color-ink)]/40 p-4 backdrop-blur-[2px]"
    >
      <motion.div
        initial={{ y: 26, rotate: -1, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        exit={{ y: 26, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 26 }}
        className="w-full max-w-[20rem] border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
      >
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-soft)]">
          Reserve your spot
        </p>
        <div className="my-3 border-t border-dashed border-[var(--color-ink)]/40" />

        <h3 className="font-display text-xl font-semibold leading-tight text-[var(--color-ink)]">
          {idea.oneLiner}
        </h3>

        <div className="my-4 flex items-baseline justify-between font-mono">
          <span className="text-xs uppercase tracking-wider text-[var(--color-ink-soft)]">
            Total due
          </span>
          <span className="font-display text-3xl font-bold text-[var(--color-cash-2)]">
            {idea.price}
          </span>
        </div>

        <div className="mb-4 border-t border-dashed border-[var(--color-ink)]/40" />

        <button
          onClick={onConfirm}
          className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-3 text-center font-display text-base font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Confirm &amp; pay {idea.price}
        </button>

        <button
          onClick={onBail}
          className="mt-3 w-full text-center font-mono text-xs text-[var(--color-ink-soft)] underline-offset-4 hover:underline"
        >
          actually… never mind
        </button>

        <p className="mt-4 text-center font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
          Demand test only — no card is charged, nothing is billed. We&apos;re
          just measuring who really clicks.
        </p>
      </motion.div>
    </motion.div>
  );
}
