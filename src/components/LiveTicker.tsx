"use client";

import { useEffect, useRef, useState } from "react";
import { safeFetch } from "@/lib/safe-fetch";
import { track } from "@/lib/track";
import { getSessionId } from "@/lib/session";
import ProvenanceTag from "./ProvenanceTag";

type Pulse = {
  ok?: boolean;
  saidYesRecent: number;
  paidRecent: number;
  windowMinutes: number;
  seededSayRate: number;
  seededDoRate: number;
};

type Mode = "loading" | "ok" | "static";

export default function LiveTicker() {
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const fired = useRef(false);
  const failures = useRef(0);

  useEffect(() => {
    let stopped = false;
    let timer: number | undefined;

    async function tick() {
      if (typeof document !== "undefined" && document.hidden) {
        schedule();
        return;
      }
      const r = await safeFetch<Pulse>(
        "/api/live-pulse",
        { cache: "no-store" },
        { timeoutMs: 5000, retries: 1 },
      );
      if (stopped) return;
      if (r.ok && r.data.ok !== false) {
        failures.current = 0;
        setPulse(r.data);
        setMode("ok");
        if (!fired.current) {
          fired.current = true;
          track("live_pulse_viewed", {
            transport: "poll",
            session_id: getSessionId(),
          });
        }
      } else {
        failures.current += 1;
        if (failures.current >= 3 && !pulse) {
          setMode("static");
          return;
        }
      }
      schedule();
    }

    function schedule() {
      if (!stopped) timer = window.setTimeout(tick, 12000);
    }

    tick();
    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [pulse]);

  if (mode === "static") {
    return (
      <div className="flex items-center justify-between border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-3 py-2 shadow-hard-sm">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
          live demand updates as people vote
        </span>
        <ProvenanceTag kind="seeded" />
      </div>
    );
  }

  if (mode === "loading" || !pulse) {
    return (
      <div className="flex items-center justify-between border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-3 py-2 shadow-hard-sm">
        <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)]">
          measuring live demand…
        </span>
        <ProvenanceTag kind="seeded" />
      </div>
    );
  }

  const hasLive = pulse.saidYesRecent + pulse.paidRecent > 0;
  const liveGap =
    pulse.saidYesRecent > 0
      ? Math.round(
          ((pulse.saidYesRecent - pulse.paidRecent) / pulse.saidYesRecent) *
            100,
        )
      : 0;

  return (
    <div className="flex items-center justify-between gap-3 border-2 border-[var(--color-ink)] bg-[var(--color-card)] px-3 py-2 shadow-hard-sm">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-soft)]">
          {hasLive
            ? `live · last ${Math.round(pulse.windowMinutes / 60)}h`
            : "seeded baseline"}
        </p>
        {hasLive ? (
          <p className="font-mono text-[12px] text-[var(--color-ink)]">
            {pulse.saidYesRecent} said take-my-money ·{" "}
            <span className="font-bold text-[var(--color-cash-2)]">
              {pulse.paidRecent} actually paid
            </span>{" "}
            · {liveGap}% gap
          </p>
        ) : (
          <p className="font-mono text-[12px] text-[var(--color-ink)]">
            {pulse.seededSayRate}% say · {pulse.seededDoRate}% do — be the first
            real vote
          </p>
        )}
      </div>
      <ProvenanceTag kind={hasLive ? "live" : "seeded"} />
    </div>
  );
}
