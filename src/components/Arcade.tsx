"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import type { IdeaWithStats } from "@/lib/types";
import { APP_NAME, APP_TAGLINE, SIGNUP_NUDGE_AFTER } from "@/lib/config";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
import { shareResult } from "@/lib/share";
import {
  addPick,
  clearPicks,
  dismissNudge,
  getAccount,
  getPicks,
  isNudgeDismissed,
  type Account,
  type Pick,
} from "@/lib/profile";
import SwipeCard from "./SwipeCard";
import CheckoutModal from "./CheckoutModal";
import Reveal from "./Reveal";
import SubmitModal from "./SubmitModal";
import MyPicksModal from "./MyPicksModal";
import AccountModal from "./AccountModal";
import SignupNudge from "./SignupNudge";

type Phase = "swipe" | "checkout" | "reveal";
type Outcome = "paid" | "bailed" | "passed";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function emitIdeaEvent(
  event: string,
  idea: { id: string; oneLiner: string },
): void {
  track(event, {
    idea_id: idea.id,
    idea_title: idea.oneLiner,
    session_id: getSessionId(),
  });
}

export default function Arcade() {
  const [deck, setDeck] = useState<IdeaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("swipe");
  const [outcome, setOutcome] = useState<Outcome>("passed");
  const [revealIdea, setRevealIdea] = useState<IdeaWithStats | null>(null);

  const [showSubmit, setShowSubmit] = useState(false);
  const [showPicks, setShowPicks] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  const [picks, setPicks] = useState<Pick[]>([]);
  const [account, setAccount] = useState<Account | null>(null);
  const [nudgeDismissed, setNudgeDismissed] = useState(true);

  const loadIdeas = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/ideas", { cache: "no-store" });
    const data = await res.json();
    setDeck(shuffle(data.ideas as IdeaWithStats[]));
    setIndex(0);
    setPhase("swipe");
    setRevealIdea(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadIdeas();
    setPicks(getPicks());
    setAccount(getAccount());
    setNudgeDismissed(isNudgeDismissed());
  }, [loadIdeas]);

  const current = deck[index];
  const remaining = deck.length - index;

  useEffect(() => {
    if (current) emitIdeaEvent("idea_viewed", current);
  }, [current]);

  const finalizeVote = useCallback(
    async (saidYes: boolean, didClick: boolean, nextOutcome: Outcome) => {
      if (!current) return;
      setOutcome(nextOutcome);
      setRevealIdea(current);
      setPhase("reveal");

      setPicks(
        addPick({
          ideaId: current.id,
          oneLiner: current.oneLiner,
          category: current.category,
          price: current.price,
          decision: nextOutcome,
          ts: Date.now(),
        }),
      );

      try {
        const res = await fetch("/api/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ideaId: current.id,
            sessionId: getSessionId(),
            saidYes,
            didClick,
          }),
        });
        const data = await res.json();
        if (res.ok && data.idea) setRevealIdea(data.idea as IdeaWithStats);
      } catch {
        return;
      }
    },
    [current],
  );

  const handleSwipe = useCallback(
    (decision: "yes" | "no") => {
      if (!current) return;
      if (decision === "yes") {
        emitIdeaEvent("said_yes", current);
        emitIdeaEvent("checkout_opened", current);
        setPhase("checkout");
      } else {
        emitIdeaEvent("said_no", current);
        finalizeVote(false, false, "passed");
      }
    },
    [current, finalizeVote],
  );

  const next = useCallback(() => {
    setPhase("swipe");
    setRevealIdea(null);
    setIndex((i) => i + 1);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (showSubmit || showPicks || showAccount) return;
      if (phase === "swipe" && current) {
        if (e.key === "ArrowRight") handleSwipe("yes");
        else if (e.key === "ArrowLeft") handleSwipe("no");
      } else if (phase === "reveal" && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, current, showSubmit, showPicks, showAccount, handleSwipe, next]);

  const stack = useMemo(() => deck.slice(index, index + 3), [deck, index]);

  const showNudge =
    !account && !nudgeDismissed && picks.length >= SIGNUP_NUDGE_AFTER;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-6">
      <header className="flex items-end justify-between border-b-2 border-[var(--color-ink)] pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold leading-none tracking-tight text-[var(--color-ink)]">
            {APP_NAME}
            <span className="text-[var(--color-cash)]">.</span>
          </h1>
          <p className="mt-1 max-w-[14rem] text-xs leading-snug text-[var(--color-ink-soft)]">
            {account ? `Hey ${account.name} — ` : ""}
            {APP_TAGLINE}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setShowPicks(true)}
            className="border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
          >
            Picks {picks.length > 0 ? `· ${picks.length}` : ""}
          </button>
          <Link
            href="/leaderboard"
            className="border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
          >
            Scores
          </Link>
        </div>
      </header>

      <div className="relative mt-6 flex-1">
        <div className="relative mx-auto h-[430px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center font-mono text-sm text-[var(--color-ink-soft)]">
              shuffling the deck…
            </div>
          ) : current ? (
            <>
              {stack
                .map((idea, i) => (
                  <SwipeCard
                    key={idea.id}
                    idea={idea}
                    isTop={i === 0 && phase === "swipe"}
                    depth={i}
                    onDecide={handleSwipe}
                  />
                ))
                .reverse()}

              <AnimatePresence>
                {phase === "checkout" && current ? (
                  <CheckoutModal
                    key="checkout"
                    idea={current}
                    onConfirm={() => {
                      emitIdeaEvent("paid", current);
                      finalizeVote(true, true, "paid");
                    }}
                    onBail={() => {
                      emitIdeaEvent("checkout_abandoned", current);
                      finalizeVote(true, false, "bailed");
                    }}
                  />
                ) : null}

                {phase === "reveal" && revealIdea ? (
                  <Reveal
                    key="reveal"
                    idea={revealIdea}
                    outcome={outcome}
                    onNext={next}
                  />
                ) : null}
              </AnimatePresence>
            </>
          ) : (
            <EndScreen
              picks={picks}
              onReplay={loadIdeas}
              onSubmit={() => setShowSubmit(true)}
            />
          )}
        </div>

        {!loading && current && phase === "swipe" ? (
          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              aria-label="Pass on this idea"
              onClick={() => handleSwipe("no")}
              className="flex h-14 w-14 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-card)] font-display text-2xl text-[var(--color-nope)] shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              ✕
            </button>
            <button
              onClick={() => setShowSubmit(true)}
              className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] underline-offset-4 hover:text-[var(--color-ink)] hover:underline"
            >
              + add idea
            </button>
            <button
              aria-label="I would pay for this"
              onClick={() => handleSwipe("yes")}
              className="flex h-14 w-14 items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-cash)] font-display text-2xl text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              $
            </button>
          </div>
        ) : null}

        {!loading && current ? (
          <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
            {remaining} idea{remaining === 1 ? "" : "s"} left
          </p>
        ) : null}
      </div>

      <AnimatePresence>
        {showNudge ? (
          <SignupNudge
            key="nudge"
            pickCount={picks.length}
            onCreateAccount={() => setShowAccount(true)}
            onDismiss={() => {
              dismissNudge();
              setNudgeDismissed(true);
            }}
          />
        ) : null}

        {showSubmit ? (
          <SubmitModal
            key="submit"
            onClose={() => setShowSubmit(false)}
            onCreated={(idea) => {
              track("idea_submitted", {
                idea_id: idea.id,
                session_id: getSessionId(),
              });
              setShowSubmit(false);
              loadIdeas();
            }}
          />
        ) : null}

        {showPicks ? (
          <MyPicksModal
            key="picks"
            picks={picks}
            account={account}
            onClose={() => setShowPicks(false)}
            onCreateAccount={() => {
              setShowPicks(false);
              setShowAccount(true);
            }}
            onClear={() => {
              clearPicks();
              setPicks([]);
            }}
          />
        ) : null}

        {showAccount ? (
          <AccountModal
            key="account"
            pickCount={picks.length}
            onClose={() => setShowAccount(false)}
            onCreated={(acc) => {
              setAccount(acc);
              setShowAccount(false);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function EndScreen({
  picks,
  onReplay,
  onSubmit,
}: {
  picks: Pick[];
  onReplay: () => void;
  onSubmit: () => void;
}) {
  const [shareLabel, setShareLabel] = useState("Share my verdict");

  const paid = picks.filter((p) => p.decision === "paid").length;
  const bailed = picks.filter((p) => p.decision === "bailed").length;

  async function onShare() {
    const text =
      `I judged ${picks.length} startup ideas on ${APP_NAME}. ` +
      `I'd actually pay for ${paid}, but I'm all talk on ${bailed}. ` +
      `What would you really click "pay" for?`;
    const result = await shareResult(text);
    track("share_verdict", { result, picks: picks.length });
    if (result === "copied") setShareLabel("Copied to clipboard ✓");
    else if (result === "shared") setShareLabel("Thanks for sharing ✓");
    else setShareLabel("Couldn't share — try again");
    window.setTimeout(() => setShareLabel("Share my verdict"), 2500);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-8 text-center shadow-hard">
      <p className="font-display text-5xl">♠</p>
      <h2 className="mt-3 font-display text-2xl font-bold text-[var(--color-ink)]">
        You judged the whole deck
      </h2>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        You&apos;d pay for {paid}, but you&apos;re all talk on {bailed}. Now see
        which ideas everyone loved but nobody would actually pay for.
      </p>
      <div className="mt-6 flex w-full flex-col gap-3">
        <a
          href="/leaderboard"
          className="border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-3 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          See the Hall of Delusion →
        </a>
        <button
          onClick={onShare}
          className="border-2 border-[var(--color-ink)] bg-[var(--color-gold)] py-3 font-display text-sm font-bold text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          {shareLabel}
        </button>
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
