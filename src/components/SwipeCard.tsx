"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
} from "motion/react";
import type { IdeaWithStats } from "@/lib/types";
import { SWIPE_THRESHOLD } from "@/lib/config";

type Decision = "yes" | "no";

export default function SwipeCard({
  idea,
  isTop,
  depth,
  onDecide,
}: {
  idea: IdeaWithStats;
  isTop: boolean;
  depth: number; // 0 = top card, 1 = next, etc.
  onDecide: (decision: Decision) => void;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-9, 0, 9]);
  const yesOpacity = useTransform(x, [40, 150], [0, 1]);
  const noOpacity = useTransform(x, [-150, -40], [1, 0]);

  function flyOut(decision: Decision) {
    const target = decision === "yes" ? 640 : -640;
    animate(x, target, { duration: reduceMotion ? 0.01 : 0.26, ease: "easeIn" });
    window.setTimeout(() => onDecide(decision), reduceMotion ? 0 : 170);
  }

  return (
    <motion.div
      className="absolute inset-0 select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : depth * -1.5,
        zIndex: 100 - depth,
        scale: 1 - depth * 0.035,
        y: depth * 12,
        pointerEvents: isTop ? "auto" : "none",
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE_THRESHOLD) flyOut("yes");
        else if (info.offset.x < -SWIPE_THRESHOLD) flyOut("no");
        else animate(x, 0, { type: "spring", stiffness: 420, damping: 32 });
      }}
      whileTap={{ cursor: "grabbing" }}
    >
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

        <div className="flex items-center justify-between border-t border-dashed border-[var(--color-ink)]/30 pt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
          <span>← pass · pay →</span>
          <span>{idea.stats.totalVotes.toLocaleString()} votes</span>
        </div>
      </div>

      {isTop ? (
        <>
          <motion.div
            style={{ opacity: yesOpacity }}
            className="stamp pointer-events-none absolute left-6 top-10 -rotate-[14deg] text-2xl text-[var(--color-cash)]"
          >
            Take my money
          </motion.div>
          <motion.div
            style={{ opacity: noOpacity }}
            className="stamp pointer-events-none absolute right-6 top-10 rotate-[14deg] text-2xl text-[var(--color-nope)]"
          >
            Nope
          </motion.div>
        </>
      ) : null}
    </motion.div>
  );
}
