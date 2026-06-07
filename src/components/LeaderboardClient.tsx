"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { IdeaWithStats } from "@/lib/types";
import { NUMBERS_DISCLOSURE } from "@/lib/config";

export default function LeaderboardClient() {
  const [ideas, setIdeas] = useState<IdeaWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ideas", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setIdeas(d.ideas as IdeaWithStats[]))
      .finally(() => setLoading(false));
  }, []);

  const ranked = useMemo(
    () => ideas.filter((i) => i.stats.saidYes >= 20),
    [ideas],
  );

  const delusions = useMemo(
    () =>
      [...ranked]
        .sort((a, b) => b.stats.delusionScore - a.stats.delusionScore)
        .slice(0, 5),
    [ranked],
  );

  const sleepers = useMemo(
    () =>
      [...ranked].sort((a, b) => b.stats.doRate - a.stats.doRate).slice(0, 5),
    [ranked],
  );

  return (
    <div className="mx-auto w-full max-w-md flex-1 px-5 py-6">
      <header className="flex items-end justify-between border-b-2 border-[var(--color-ink)] pb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          The Scoreboard
        </h1>
        <Link
          href="/"
          className="border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--color-ink)] shadow-hard-sm transition-transform hover:-translate-y-0.5"
        >
          ← Swipe
        </Link>
      </header>

      {loading ? (
        <p className="mt-10 text-center font-mono text-sm text-[var(--color-ink-soft)]">
          counting…
        </p>
      ) : (
        <>
          <Section
            title="Hall of Delusion"
            subtitle="Everyone swears they'd pay. Almost nobody clicks."
            ideas={delusions}
            metric={(i) => `${i.stats.sayRate}% say · ${i.stats.doRate}% do`}
            metricColor="var(--color-nope)"
          />
          <Section
            title="Sleeper Hits"
            subtitle="Quieter love, but the ones who say yes actually pay."
            ideas={sleepers}
            metric={(i) => `${i.stats.doRate}% actually click`}
            metricColor="var(--color-cash-2)"
          />

          <p className="mt-10 border-t border-dashed border-[var(--color-ink)]/40 pt-4 font-mono text-[10px] leading-relaxed text-[var(--color-ink-soft)]">
            {NUMBERS_DISCLOSURE}
          </p>
        </>
      )}
    </div>
  );
}

function Section({
  title,
  subtitle,
  ideas,
  metric,
  metricColor,
}: {
  title: string;
  subtitle: string;
  ideas: IdeaWithStats[];
  metric: (i: IdeaWithStats) => string;
  metricColor: string;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-xl font-bold text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mb-3 text-xs text-[var(--color-ink-soft)]">{subtitle}</p>
      <div className="space-y-2">
        {ideas.length === 0 ? (
          <p className="font-mono text-sm text-[var(--color-ink-soft)]">
            Not enough votes yet. Go swipe some ideas first.
          </p>
        ) : (
          ideas.map((idea, i) => (
            <div
              key={idea.id}
              className="flex items-center gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-card)] p-3 shadow-hard-sm"
            >
              <span className="w-5 shrink-0 text-center font-display text-lg font-bold text-[var(--color-ink-soft)]">
                {i + 1}
              </span>
              <p className="flex-1 text-sm leading-snug text-[var(--color-ink)]">
                {idea.oneLiner}
              </p>
              <span
                className="shrink-0 font-mono text-[11px] font-bold"
                style={{ color: metricColor }}
              >
                {metric(idea)}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
