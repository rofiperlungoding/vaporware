"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import type { IdeaWithStats } from "@/lib/types";
import { APP_NAME } from "@/lib/config";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
import CheckoutModal from "./CheckoutModal";
import ProvenanceTag from "./ProvenanceTag";

type Phase = "swipe" | "checkout" | "result";

function tokenHash(token: string): string {
  let h = 5381;
  for (let i = 0; i < token.length; i++) {
    h = ((h << 5) + h + token.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

export default function PaintedDoorClient({
  token,
  idea,
}: {
  token: string;
  idea: IdeaWithStats | null;
}) {
  const [phase, setPhase] = useState<Phase>("swipe");
  const [result, setResult] = useState<IdeaWithStats | null>(null);

  const record = useCallback(
    async (saidYes: boolean, didClick: boolean) => {
      if (!idea) return;
      track("painted_door_vote", {
        token_hash: tokenHash(token),
        session_id: getSessionId(),
      });
      setResult(idea);
      setPhase("result");
      try {
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ideaId: idea.id,
            sessionId: getSessionId(),
            saidYes,
            didClick,
          }),
        });
        const data = await res.json();
        if (res.ok && data.idea) setResult(data.idea as IdeaWithStats);
      } catch {
        return;
      }
    },
    [idea, token],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (phase !== "swipe" || !idea) return;
      if (e.key === "ArrowRight") setPhase("checkout");
      else if (e.key === "ArrowLeft") record(false, false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, idea, record]);

  if (!idea) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-16 text-center">
        <p className="font-display text-2xl font-bold text-[var(--color-ink)]">
          This door leads nowhere.
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          The link is wrong or the idea was removed.
        </p>
        <Link
          href="/"
          className="mt-6 border-2 border-[var(--color-ink)] bg-[var(--color-cash)] px-4 py-2 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm"
        >
          Go to {APP_NAME} →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
      <header className="flex items-end justify-between border-b-2 border-[var(--color-ink)] pb-4">
        <div>
          <h1 className="font-display text-2xl font-bold leading-none tracking-tight text-[var(--color-ink)]">
            {APP_NAME}
            <span className="text-[var(--color-cash)]">.</span>
          </h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
            Painted door · one idea
          </p>
        </div>
        <Link
          href="/"
          className="border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] shadow-hard-sm"
        >
          Full deck
        </Link>
      </header>

      <div className="relative mt-6 flex-1">
        <div className="relative mx-auto h-[420px] w-full">
          <div className="flex h-full flex-col justify-between rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard">
            <div className="flex items-center justify-between">
              <span className="border border-[var(--color-ink)] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[var(--color-ink)]">
                {idea.category}
              </span>
              <span className="font-mono text-sm font-bold text-[var(--color-cash-2)]">
                {idea.price}
              </span>
            </div>
            <div className="py-3">
              <h2 className="font-display text-[2rem] font-semibold leading-[1.05] tracking-tight text-[var(--color-ink)]">
                {idea.oneLiner}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                {idea.tagline}
              </p>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
              Would you actually pay?
            </p>
          </div>

          <AnimatePresence>
            {phase === "checkout" ? (
              <CheckoutModal
                key="checkout"
                idea={idea}
                onConfirm={() => record(true, true)}
                onBail={() => record(true, false)}
              />
            ) : null}

            {phase === "result" && result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-[150] flex flex-col justify-between rounded-xl border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
                    This idea&apos;s own gap
                  </p>
                  <ProvenanceTag kind="live" />
                </div>
                <div className="space-y-4">
                  <Bar label="said “take my money”" value={result.stats.sayRate} color="var(--color-ink)" />
                  <Bar label="actually clicked pay" value={result.stats.doRate} color="var(--color-cash-2)" />
                </div>
                <div>
                  <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-gold)]">
                    early · low sample
                  </p>
                  <Link
                    href="/"
                    className="block w-full border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-3 text-center font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
                  >
                    Judge the full deck →
                  </Link>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {phase === "swipe" ? (
          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              aria-label="Pass"
              onClick={() => record(false, false)}
              className="flex h-14 w-14 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-card)] font-display text-2xl text-[var(--color-nope)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              ✕
            </button>
            <button
              aria-label="I would pay for this"
              onClick={() => setPhase("checkout")}
              className="flex h-14 w-14 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-cash)] font-display text-2xl text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              $
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
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
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
