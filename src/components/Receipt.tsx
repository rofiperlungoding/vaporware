"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { APP_NAME } from "@/lib/config";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
import { shareResult } from "@/lib/share";
import { getSessionScorecard, verdict } from "@/lib/verdict";
import { buildGrounding } from "@/lib/ai-context";
import { getPicks } from "@/lib/profile";

const TEAR =
  "linear-gradient(-45deg, var(--color-card) 50%, transparent 0), linear-gradient(45deg, var(--color-card) 50%, transparent 0)";

type AiState = "loading" | "ready" | "off";

export default function Receipt({
  onReplay,
  onSubmit,
}: {
  onReplay: () => void;
  onSubmit: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const score = useMemo(() => getSessionScorecard(), []);
  const v = useMemo(() => verdict(score.personalGap), [score.personalGap]);
  const grounding = useMemo(() => buildGrounding(getPicks()), []);
  const [shareLabel, setShareLabel] = useState("Share my receipt");

  const [aiState, setAiState] = useState<AiState>("loading");
  const [aiHeadline, setAiHeadline] = useState("");
  const [aiRoast, setAiRoast] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    track("receipt_viewed", {
      saidYes: score.saidYesCount,
      paid: score.paidCount,
      gap: score.personalGap,
      tier: v.id,
      session_id: getSessionId(),
    });
  }, [score, v.id]);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/verdict-narration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(grounding),
        });
        const data = await res.json();
        if (!active) return;
        if (data?.ok && typeof data.roast === "string" && data.roast) {
          setAiHeadline(typeof data.headline === "string" ? data.headline : "");
          setAiRoast(data.roast);
          setAiState("ready");
          track("ai_verdict_shown", {
            tier: v.id,
            grounded: true,
            session_id: getSessionId(),
          });
          return;
        }
        setAiState("off");
        track("ai_verdict_shown", {
          tier: v.id,
          grounded: false,
          session_id: getSessionId(),
        });
      } catch {
        if (!active) return;
        setAiState("off");
        track("ai_verdict_shown", {
          tier: v.id,
          grounded: false,
          session_id: getSessionId(),
        });
      }
    })();

    return () => {
      active = false;
    };
  }, [grounding, v.id]);

  const noPromises = score.saidYesCount === 0;
  const roast = noPromises
    ? "You passed on everything. Can't break a promise you never made."
    : v.roast;

  async function onShare() {
    const origin = window.location.origin;
    const imageUrl = `${origin}/api/receipt-image?saidYes=${score.saidYesCount}&paid=${score.paidCount}&gap=${score.personalGap}&tier=${encodeURIComponent(v.id)}`;
    const text = `My ${APP_NAME} demand receipt: I said I'd pay for ${score.saidYesCount}, actually paid for ${score.paidCount}. Personal say-do gap: ${score.personalGap}%. Verdict: ${v.title}.`;
    const result = await shareResult(text, imageUrl);
    track("receipt_shared", { tier: v.id, session_id: getSessionId() });
    if (result === "copied") setShareLabel("Copied ✓");
    else if (result === "shared") setShareLabel("Shared ✓");
    else setShareLabel("Try again");
    window.setTimeout(() => setShareLabel("Share my receipt"), 2500);
  }

  const orderNo = useMemo(
    () => Math.floor(100000 + Math.random() * 899999),
    [],
  );

  return (
    <div className="mx-auto w-full max-w-sm py-2">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-b-0 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
      >
        <div className="text-center">
          <p className="font-display text-2xl font-bold leading-none text-[var(--color-ink)]">
            {APP_NAME}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--color-ink-soft)]">
            Demand Receipt
          </p>
        </div>

        <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
          <span>No. {orderNo}</span>
          <span>this session</span>
        </div>

        <div className="my-4 border-t border-dashed border-[var(--color-ink)]/50" />

        <LineItem label="Said &lsquo;take my money&rsquo;" value={`${score.saidYesCount}×`} />
        <LineItem label="Actually paid" value={`${score.paidCount}×`} />
        <LineItem label="Bailed at checkout" value={`${score.bailedCount}×`} />
        <LineItem label="Passed" value={`${score.passedCount}×`} muted />

        <div className="my-4 border-t border-dashed border-[var(--color-ink)]/50" />

        <div className="flex items-end justify-between">
          <span className="max-w-[10rem] font-mono text-[11px] uppercase leading-tight tracking-wider text-[var(--color-ink-soft)]">
            Your personal say-do gap
          </span>
          <span
            className="font-display text-4xl font-bold leading-none"
            style={{ color: v.color }}
          >
            {score.personalGap}%
          </span>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <motion.span
            initial={reduceMotion ? false : { scale: 1.5, opacity: 0, rotate: -16 }}
            animate={{ scale: 1, opacity: 1, rotate: -4 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { delay: 0.35, type: "spring", stiffness: 280, damping: 12 }
            }
            className="stamp text-xl"
            style={{ color: v.color }}
          >
            {v.title}
          </motion.span>
          <p className="mt-3 text-center text-[13px] leading-relaxed text-[var(--color-ink)]">
            {roast}
          </p>

          {aiState === "loading" ? (
            <p className="mt-4 animate-pulse text-center font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
              🤖 consulting the ledger…
            </p>
          ) : null}

          {aiState === "ready" ? (
            <div className="mt-4 w-full border-t border-dashed border-[var(--color-ink)]/40 pt-4 text-center">
              <span className="stamp text-[11px] text-[var(--color-ink-soft)]">
                🤖 AI read
              </span>
              {aiHeadline ? (
                <p className="mt-2 font-display text-base font-bold text-[var(--color-ink)]">
                  {aiHeadline}
                </p>
              ) : null}
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink)]">
                {aiRoast}
              </p>
            </div>
          ) : null}
        </div>

        <p className="mt-5 text-center font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
          Your own behavior this session. No card was charged — that was the
          whole test.
        </p>
      </motion.div>

      <div
        aria-hidden
        className="h-2.5 w-full"
        style={{ background: TEAR, backgroundSize: "14px 14px", backgroundRepeat: "repeat-x" }}
      />

      <div className="mt-5 flex flex-col gap-3">
        <button
          onClick={onShare}
          className="border-2 border-[var(--color-ink)] bg-[var(--color-gold)] py-3 font-display text-sm font-bold text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          {shareLabel}
        </button>
        <Link
          href="/leaderboard"
          className="border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-3 text-center font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          See the crowd&apos;s gap →
        </Link>
        <button
          onClick={onSubmit}
          className="border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] py-3 font-display text-sm font-bold text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          + Add your own idea
        </button>
        <button
          onClick={onReplay}
          className="font-mono text-xs text-[var(--color-ink-soft)] underline-offset-4 hover:underline"
        >
          reshuffle and go again
        </button>
      </div>
    </div>
  );
}

function LineItem({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 py-1 font-mono text-[13px]">
      <span className={muted ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink)]"}>
        {label}
      </span>
      <span className="min-w-0 flex-1 translate-y-[-3px] border-b border-dotted border-[var(--color-ink)]/40" />
      <span className={muted ? "text-[var(--color-ink-soft)]" : "font-bold text-[var(--color-ink)]"}>
        {value}
      </span>
    </div>
  );
}
