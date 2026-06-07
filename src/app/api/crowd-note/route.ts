import { NextResponse } from "next/server";
import { getCategoryStats, type CategoryStat } from "@/lib/aggregates";
import { callMistral } from "@/lib/mistral";
import { allow, clientKey } from "@/lib/ai-guards";

export const runtime = "nodejs";

const SYSTEM = `You are the editor of "Vaporware", a product that measures the gap between what people SAY they'd pay for and what they actually DO. You are given say-rate and do-rate per product category. Write ONE dry, sharp editorial sentence about the pattern.

HARD RULES:
- Only use the numbers given. Never invent a category or figure.
- <= 30 words. No preamble, no advice. Dry, a little mean.
- Output strict JSON: { "note": string }.`;

function staticNote(stats: CategoryStat[]): string {
  if (stats.length === 0) return "Not enough votes yet to call a pattern.";
  const sorted = [...stats].sort((a, b) => a.doRate - b.doRate);
  const worst = sorted[0];
  const best = sorted[sorted.length - 1];
  if (worst.category === best.category) {
    return `${best.category} ideas: ${best.doRate}% who say yes actually pay.`;
  }
  return `${worst.category} ideas are all talk (${worst.doRate}% pay); ${best.category} converts for real (${best.doRate}%).`;
}

export async function GET(request: Request) {
  let stats: CategoryStat[];
  try {
    stats = await getCategoryStats();
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const fallback = staticNote(stats);

  if (!allow(`note:${clientKey(request)}`)) {
    return NextResponse.json({ ok: true, note: fallback, grounded: false });
  }

  try {
    const out = await callMistral<{ note?: unknown }>({
      system: SYSTEM,
      user: JSON.stringify(stats.slice(0, 8)),
    });
    const note =
      typeof out.note === "string" && out.note.trim()
        ? out.note.slice(0, 200)
        : "";
    if (!note) throw new Error("empty");
    return NextResponse.json({ ok: true, note, grounded: true });
  } catch {
    return NextResponse.json({ ok: true, note: fallback, grounded: false });
  }
}
