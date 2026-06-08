"use client";

import { useEffect, useMemo } from "react";
import { motion } from "motion/react";
import type { Account, Pick } from "@/lib/profile";
import { FEATURES } from "@/lib/config";
import { clearAllData } from "@/lib/trust";
import { useFocusTrap } from "@/lib/useFocusTrap";

export default function MyPicksModal({
  picks,
  account,
  onClose,
  onCreateAccount,
  onClear,
}: {
  picks: Pick[];
  account: Account | null;
  onClose: () => void;
  onCreateAccount: () => void;
  onClear: () => void;
}) {
  const groups = useMemo(() => {
    return {
      paid: picks.filter((p) => p.decision === "paid"),
      bailed: picks.filter((p) => p.decision === "bailed"),
      passed: picks.filter((p) => p.decision === "passed"),
    };
  }, [picks]);

  const trapRef = useFocusTrap<HTMLDivElement>();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[350] flex items-center justify-center bg-[var(--color-ink)]/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 26, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="flex max-h-[85vh] w-full max-w-md flex-col border-2 border-[var(--color-ink)] bg-[var(--color-card)] shadow-hard"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Your picks"
        ref={trapRef}
      >
        <div className="flex items-start justify-between border-b-2 border-[var(--color-ink)] p-5">
          <div>
            <h3 className="font-display text-xl font-bold text-[var(--color-ink)]">
              Your picks
            </h3>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
              {account ? `saved as ${account.name}` : "guest · on this device"}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xl leading-none text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
          >
            ✕
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-5">
          {picks.length === 0 ? (
            <p className="py-8 text-center font-mono text-sm text-[var(--color-ink-soft)]">
              No picks yet. Go swipe some ideas.
            </p>
          ) : (
            <div className="space-y-6">
              <Group
                title="You'd actually pay"
                hint="said yes — and clicked pay"
                color="var(--color-cash-2)"
                items={groups.paid}
              />
              <Group
                title="All talk"
                hint="said yes, then bailed at checkout"
                color="var(--color-nope)"
                items={groups.bailed}
              />
              <Group
                title="Passed"
                hint="not for you"
                color="var(--color-ink-soft)"
                items={groups.passed}
              />
            </div>
          )}
        </div>

        <div className="border-t-2 border-[var(--color-ink)] p-5">
          {account ? (
            <p className="text-center font-mono text-[11px] text-[var(--color-ink-soft)]">
              Synced to {account.email} on this device.
            </p>
          ) : (
            <button
              onClick={onCreateAccount}
              className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-2.5 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              Save these to a free account
            </button>
          )}
          {picks.length > 0 ? (
            <button
              onClick={onClear}
              className="mt-3 w-full text-center font-mono text-[11px] text-[var(--color-ink-soft)] underline-offset-4 hover:text-[var(--color-nope)] hover:underline"
            >
              clear my picks
            </button>
          ) : null}

          {FEATURES.trustLayer ? (
            <div className="mt-4 border-t border-dashed border-[var(--color-ink)]/40 pt-3">
              <p className="font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
                We store your picks (and name/email if you make an account) on
                this device only — no server profile, no selling data.
              </p>
              <button
                onClick={() => {
                  clearAllData();
                  window.location.reload();
                }}
                className="mt-2 w-full text-center font-mono text-[11px] text-[var(--color-ink-soft)] underline-offset-4 hover:text-[var(--color-nope)] hover:underline"
              >
                clear all my data
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Group({
  title,
  hint,
  color,
  items,
}: {
  title: string;
  hint: string;
  color: string;
  items: Pick[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h4 className="font-display text-base font-bold" style={{ color }}>
          {title}
        </h4>
        <span className="font-mono text-sm font-bold" style={{ color }}>
          {items.length}
        </span>
      </div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
        {hint}
      </p>
      {items.length === 0 ? (
        <p className="font-mono text-xs text-[var(--color-ink-soft)]">—</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((p) => (
            <li
              key={p.ideaId}
              className="flex items-center gap-2 border border-[var(--color-ink)]/30 bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)]"
            >
              <span className="flex-1 leading-snug">{p.oneLiner}</span>
              <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-soft)]">
                {p.price}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
