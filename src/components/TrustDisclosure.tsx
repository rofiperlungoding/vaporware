"use client";

import { motion, useReducedMotion } from "motion/react";

export default function TrustDisclosure({
  onDismiss,
}: {
  onDismiss: () => void;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 flex items-start gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] p-3 shadow-hard-sm"
    >
      <div className="flex-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-ink-soft)]">
          Painted-door demo
        </p>
        <p className="mt-1 text-[12px] leading-snug text-[var(--color-ink)]">
          No card is ever charged. We measure whether you click <em>pay</em> to
          study the say-do gap. Your picks stay on this device.
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Got it"
        className="shrink-0 border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-2 py-1 font-mono text-[11px] font-bold uppercase text-[var(--color-ink)]"
      >
        Got it
      </button>
    </motion.div>
  );
}
