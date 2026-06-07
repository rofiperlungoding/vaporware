import { NextResponse } from "next/server";
import { callMistral, MistralUnavailable } from "@/lib/mistral";
import {
  allow,
  cacheGet,
  cacheSet,
  clientKey,
  hashKey,
  sanitizeText,
} from "@/lib/ai-guards";

export const runtime = "nodejs";

const SYSTEM = `You are the narrator of "Vaporware", a sardonic editorial product that exposes the gap between what people SAY they'd pay for and what they actually DO. You are dry, sharp, a little mean, never cruel about protected characteristics. You write like a receipt printed by a machine that has seen everything.

You are given a player's ACTUAL session record: which product ideas they swiped "take my money" on, which they actually paid for, and which they bailed on.

TASK: write a 2-3 sentence verdict that names SPECIFIC ideas from the "contradictions" list (said yes, didn't pay) to expose their hypocrisy, in the voice of their assigned tier.

HARD RULES:
- Only reference ideas present in the data given. NEVER invent an idea, number, or fact. If contradictions is empty, roast the overall pattern instead.
- <= 55 words total. No preamble, no advice, no questions.
- Match the tier tone (e.g. "pure-vapor" = withering; "wallet-matches-mouth" = grudging respect).
- Output strict JSON: { "headline": string (<= 6 words), "roast": string }.`;

type GroundingIdea = { title: string; category: string };

function cleanIdeas(value: unknown): GroundingIdea[] {
  if (!Array.isArray(value)) return [];
  const out: GroundingIdea[] = [];
  for (const raw of value.slice(0, 6)) {
    const obj = (raw ?? {}) as Record<string, unknown>;
    const title = sanitizeText(String(obj.title ?? ""), 120);
    if (!title) continue;
    out.push({ title, category: sanitizeText(String(obj.category ?? ""), 40) });
  }
  return out;
}

function intOr(value: unknown, fallback: number): number {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? n : fallback;
}

export async function POST(request: Request) {
  if (!allow(`verdict:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const grounding = {
    tier: sanitizeText(String(body.tier ?? "pure-vapor"), 40),
    saidYes: intOr(body.saidYes, 0),
    paid: intOr(body.paid, 0),
    bailed: intOr(body.bailed, 0),
    passed: intOr(body.passed, 0),
    personalGap: Math.max(0, Math.min(100, intOr(body.personalGap, 0))),
    contradictions: cleanIdeas(body.contradictions),
    honored: cleanIdeas(body.honored),
  };

  const cacheKey = hashKey("verdict-v1:" + JSON.stringify(grounding));
  const cached = cacheGet<{ headline: string; roast: string }>(cacheKey);
  if (cached) return NextResponse.json({ ok: true, ...cached });

  try {
    const out = await callMistral<{ headline?: unknown; roast?: unknown }>({
      system: SYSTEM,
      user: JSON.stringify(grounding),
    });
    const headline =
      typeof out.headline === "string" ? out.headline.slice(0, 80) : "";
    const roast = typeof out.roast === "string" ? out.roast.slice(0, 400) : "";
    if (!roast) throw new MistralUnavailable("empty");

    const result = { headline, roast };
    cacheSet(cacheKey, result);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
