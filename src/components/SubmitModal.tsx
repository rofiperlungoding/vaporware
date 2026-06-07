"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { IdeaWithStats } from "@/lib/types";
import { getSessionId } from "@/lib/session";
import { track } from "@/lib/track";
import { FEATURES } from "@/lib/config";

type ReadState = "loading" | "ready" | "off";
type DoorRead = { predictedPattern: string; trap: string; oneLiner: string };

const STATIC_READ =
  "New ideas almost always over-index on \u201Csay\u201D. Real votes will settle whether the wallet follows.";

export default function SubmitModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (idea: IdeaWithStats) => void;
}) {
  const [oneLiner, setOneLiner] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState("Wildcard");
  const [price, setPrice] = useState("$5/mo");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [phase, setPhase] = useState<"form" | "read">("form");
  const [createdIdea, setCreatedIdea] = useState<IdeaWithStats | null>(null);
  const [readState, setReadState] = useState<ReadState>("loading");
  const [read, setRead] = useState<DoorRead | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [linkLabel, setLinkLabel] = useState("Copy share link");

  async function createLink(ideaId: string) {
    if (!FEATURES.paintedDoorLink) return;
    try {
      const res = await fetch("/api/painted-door/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, sessionId: getSessionId() }),
      });
      const data = await res.json();
      if (data?.ok && data.token) {
        setShareUrl(`${window.location.origin}/d/${data.token}`);
        track("painted_door_link_created", { session_id: getSessionId() });
      }
    } catch {
      return;
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkLabel("Copied ✓");
    } catch {
      setLinkLabel("Copy failed");
    }
    window.setTimeout(() => setLinkLabel("Copy share link"), 2500);
  }

  async function fetchRead(title: string, description: string) {
    track("ai_read_requested", { session_id: getSessionId() });
    try {
      const res = await fetch("/api/painted-door-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data?.ok && (data.predictedPattern || data.oneLiner)) {
        setRead({
          predictedPattern: data.predictedPattern ?? "",
          trap: data.trap ?? "",
          oneLiner: data.oneLiner ?? "",
        });
        setReadState("ready");
        track("ai_read_shown", { grounded: true, session_id: getSessionId() });
        return;
      }
      setReadState("off");
      track("ai_read_shown", { grounded: false, session_id: getSessionId() });
    } catch {
      setReadState("off");
      track("ai_read_shown", { grounded: false, session_id: getSessionId() });
    }
  }

  async function submit() {
    if (oneLiner.trim().length < 8) {
      setError("Give it a real one-liner first (8+ characters).");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oneLiner, tagline, category, price }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      const idea = data.idea as IdeaWithStats;
      setCreatedIdea(idea);
      setPhase("read");
      setReadState("loading");
      fetchRead(oneLiner.trim(), tagline.trim());
      createLink(idea.id);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function finish() {
    if (createdIdea) onCreated(createdIdea);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--color-ink)]/45 p-4 backdrop-blur-[2px]"
      onClick={phase === "form" ? onClose : undefined}
    >
      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 26, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-md border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
        onClick={(e) => e.stopPropagation()}
      >
        {phase === "form" ? (
          <>
            <h3 className="font-display text-xl font-bold text-[var(--color-ink)]">
              Throw your idea in the arena
            </h3>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Strangers will swipe it. Then find out how many actually click pay.
            </p>

            <div className="mt-5 space-y-3">
              <Field label="One-liner *">
                <textarea
                  value={oneLiner}
                  onChange={(e) => setOneLiner(e.target.value)}
                  rows={2}
                  maxLength={120}
                  placeholder="AI that books your dentist by arguing with the receptionist"
                  className="w-full resize-none border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
                />
              </Field>
              <Field label="Tagline">
                <input
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  maxLength={160}
                  placeholder="One sentence on why someone would care."
                  className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
                />
              </Field>
              <div className="flex gap-3">
                <Field label="Category">
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    maxLength={40}
                    className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
                  />
                </Field>
                <Field label="Price">
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    maxLength={20}
                    className="w-full border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:bg-[var(--color-card)]"
                  />
                </Field>
              </div>
            </div>

            {error ? (
              <p className="mt-3 font-mono text-xs text-[var(--color-nope)]">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 border-2 border-[var(--color-ink)] bg-[var(--color-paper-2)] py-2.5 font-display text-sm font-bold text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex-1 border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-2.5 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? "Launching…" : "Launch it"}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-ink-soft)]">
              Launched · now in the deck
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-[var(--color-ink)]">
              {oneLiner.trim()}
            </h3>

            <div className="my-4 border-t border-dashed border-[var(--color-ink)]/40" />

            {readState === "loading" ? (
              <p className="animate-pulse font-mono text-[12px] uppercase tracking-wider text-[var(--color-ink-soft)]">
                🤖 reading the door…
              </p>
            ) : null}

            {readState === "ready" && read ? (
              <div>
                <span className="stamp text-[11px] text-[var(--color-ink-soft)]">
                  🤖 AI hunch — not crowd data yet
                </span>
                <p className="mt-3 text-[14px] font-semibold leading-snug text-[var(--color-ink)]">
                  {read.oneLiner}
                </p>
                {read.predictedPattern ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                    {read.predictedPattern}
                  </p>
                ) : null}
                {read.trap ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink)]">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-nope)]">
                      Likely trap ·{" "}
                    </span>
                    {read.trap}
                  </p>
                ) : null}
              </div>
            ) : null}

            {readState === "off" ? (
              <p className="text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                {STATIC_READ}
              </p>
            ) : null}

            {shareUrl ? (
              <div className="mt-5 border-t border-dashed border-[var(--color-ink)]/40 pt-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
                  Collect real say-do data on your idea
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate border-2 border-[var(--color-ink)] bg-[var(--color-paper)] px-2 py-1.5 font-mono text-[11px] text-[var(--color-ink)]">
                    {shareUrl}
                  </code>
                  <button
                    onClick={copyLink}
                    className="shrink-0 border-2 border-[var(--color-ink)] bg-[var(--color-gold)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase text-[var(--color-ink)] shadow-hard-sm"
                  >
                    {linkLabel}
                  </button>
                </div>
              </div>
            ) : null}

            <button
              onClick={finish}
              className="mt-6 w-full border-2 border-[var(--color-ink)] bg-[var(--color-cash)] py-2.5 font-display text-sm font-bold text-[var(--color-card)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              Into the deck →
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block w-full">
      <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-soft)]">
        {label}
      </span>
      {children}
    </label>
  );
}
