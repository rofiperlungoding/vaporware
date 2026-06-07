export type Provenance = "seeded" | "live" | "ai" | "mixed";

const LABELS: Record<Provenance, string> = {
  seeded: "demo data",
  live: "live",
  ai: "🤖 AI read",
  mixed: "demo + live",
};

const COLORS: Record<Provenance, string> = {
  seeded: "var(--color-ink-soft)",
  live: "var(--color-cash-2)",
  ai: "var(--color-ink-soft)",
  mixed: "var(--color-gold)",
};

export default function ProvenanceTag({
  kind,
  className = "",
}: {
  kind: Provenance;
  className?: string;
}) {
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest ${className}`}
      style={{ borderColor: COLORS[kind], color: COLORS[kind] }}
    >
      {LABELS[kind]}
    </span>
  );
}
