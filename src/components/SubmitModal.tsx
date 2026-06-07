"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { IdeaWithStats } from "@/lib/types";
import { track } from "@/lib/track";

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
      track("idea_submitted", {
        ideaId: idea.id,
        category,
        price,
        oneLinerLength: oneLiner.trim().length,
        hasTagline: tagline.trim().length > 0,
      });
      onCreated(idea);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[var(--color-ink)]/45 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 26, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="w-full max-w-md border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-6 shadow-hard"
        onClick={(e) => e.stopPropagation()}
      >
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
          <p className="mt-3 font-mono text-xs text-[var(--color-nope)]">{error}</p>
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
