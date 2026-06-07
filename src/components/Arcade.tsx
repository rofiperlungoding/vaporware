"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import Link from "next/link";
import type { IdeaWithStats } from "@/lib/types";
import {
  APP_NAME,
  APP_TAGLINE,
  FEATURES,
  SIGNUP_NUDGE_AFTER,
} from "@/lib/config";
import { DECKS, deckMeta, matchesDeck, type DeckKey } from "@/lib/themes";
import { getDeck as getDeckPref, setDeck as setDeckPref } from "@/lib/deck-pref";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
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
import Receipt from "./Receipt";

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

function buildDeck(all: IdeaWithStats[], key: DeckKey): IdeaWithStats[] {
  const filtered = FEATURES.themedDecks
    ? all.filter((i) => matchesDeck(i.id, key))
    : all;
  return shuffle(filtered);
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
  const [allIdeas, setAllIdeas] = useState<IdeaWithStats[]>([]);
  const [deck, setDeck] = useState<IdeaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("swipe");
  const [outcome, setOutcome] = useState<Outcome>("passed");
  const [revealIdea, setRevealIdea] = useState<IdeaWithStats | null>(null);

  const [deckKey, setDeckKey] = useState<DeckKey>("all");
  const deckKeyRef = useRef<DeckKey>("all");

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
    const ideas = data.ideas as IdeaWithStats[];
    setAllIdeas(ideas);
    setDeck(buildDeck(ideas, deckKeyRef.current));
    setIndex(0);
    setPhase("swipe");
    setRevealIdea(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (FEATURES.themedDecks) {
      const k = getDeckPref();
      deckKeyRef.current = k;
      setDeckKey(k);
    }
    loadIdeas();
    setPicks(getPicks());
    setAccount(getAccount());
    setNudgeDismissed(isNudgeDismissed());
  }, [loadIdeas]);

  const current = deck[index];
  const remaining = deck.length - index;
  const ended = !loading && !current;

  const changeDeck = useCallback(
    (key: DeckKey) => {
      if (key === deckKeyRef.current) return;
      deckKeyRef.current = key;
      setDeckKey(key);
      setDeckPref(key);
      track("deck_theme_selected", { theme: key, session_id: getSessionId() });
      setDeck(buildDeck(allIdeas, key));
      setIndex(0);
      setPhase("swipe");
      setRevealIdea(null);
    },
    [allIdeas],
  );

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

  const showDeckPicker = FEATURES.themedDecks && !loading && !ended;
  const banner = deckMeta(deckKey).banner;

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

      {showDeckPicker ? (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            {DECKS.map((d) => (
              <button
                key={d.key}
                onClick={() => changeDeck(d.key)}
                className={`border-2 border-[var(--color-ink)] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-transform hover:-translate-y-0.5 ${
                  deckKey === d.key
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-card)] text-[var(--color-ink)]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          {banner ? (
            <p className="mt-3 font-display text-sm italic text-[var(--color-ink-soft)]">
              {banner}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="relative mt-6 flex-1">
        {loading ? (
          <div className="flex h-[430px] items-center justify-center font-mono text-sm text-[var(--color-ink-soft)]">
            shuffling the deck…
          </div>
        ) : ended ? (
          <Receipt onReplay={loadIdeas} onSubmit={() => setShowSubmit(true)} />
        ) : (
          <>
            <div className="relative mx-auto h-[430px] w-full">
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
                    onCaught={() => emitIdeaEvent("caught_in_act", current)}
                  />
                ) : null}

                {phase === "reveal" && revealIdea ? (
                  <Reveal
                    key="reveal"
                    idea={revealIdea}
                    outcome={outcome}
                    onNext={next}
                    onRevealComplete={() =>
                      emitIdeaEvent("reveal_completed", revealIdea)
                    }
                  />
                ) : null}
              </AnimatePresence>
            </div>

            {phase === "swipe" ? (
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

            <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
              {remaining} idea{remaining === 1 ? "" : "s"} left
            </p>
          </>
        )}
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
