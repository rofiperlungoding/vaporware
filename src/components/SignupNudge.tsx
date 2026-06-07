"use client";

import { motion } from "motion/react";

// Non-blocking nudge: appears after a guest has played a while. Never interrupts
// a swipe — it sits at the bottom and can be dismissed.
export default function SignupNudge({
  pickCount,
  onCreateAccount,
  onDismiss,
}: {
  pickCount: number;
  onCreateAccount: () => void;
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[250] flex justify-center px-4"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-ink)] p-3 text-[var(--color-paper)] shadow-hard">
        <div className="flex-1">
          <p className="font-display text-sm font-bold leading-tight">
            {pickCount} picks &amp; counting
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-[var(--color-paper-2)]">
            You&apos;re playing as a guest. Make a free account to keep them.
          </p>
        </div>
        <button
          onClick={onCreateAccount}
          className="shrink-0 border-2 border-[var(--color-cash)] bg-[var(--color-cash)] px-3 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] transition-transform hover:-translate-y-0.5"
        >
          Save
        </button>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 px-1 font-mono text-lg leading-none text-[var(--color-paper-2)] hover:text-[var(--color-paper)]"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}
