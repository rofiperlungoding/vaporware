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

const SYSTEM = `You are a product validation analyst grounded in painted-door / fake-door testing and the intention-behavior gap. Given a single product idea, predict how it will behave on the say-do gap: will it get high "say" but low "do", or genuine demand? Name the TRAP it is most likely to fall into.

HARD RULES:
- This is an informed HUNCH, not real data. Do not state fake user counts or percentages as facts; if you give a rough range, prefix "likely ~".
- Ground reasoning in the painted-door framework (novelty vs. recurring pain, convenience vs. willingness to pay).
- <= 60 words. Dry, specific, useful. No hype, no flattery.
- Output strict JSON: { "predictedPattern": string, "trap": string, "oneLiner": string }.`;

export async function POST(request: Request) {
  if (!allow(`door:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const title = sanitizeText(String(body.title ?? ""), 120);
  const description = sanitizeText(String(body.description ?? ""), 200);
  if (title.length < 3) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const cacheKey = hashKey("door-v1:" + title + "|" + description);
  const cached = cacheGet<{
    predictedPattern: string;
    trap: string;
    oneLiner: string;
  }>(cacheKey);
  if (cached) return NextResponse.json({ ok: true, ...cached });

  try {
    const out = await callMistral<{
      predictedPattern?: unknown;
      trap?: unknown;
      oneLiner?: unknown;
    }>({
      system: SYSTEM,
      user: JSON.stringify({ title, description }),
    });

    const predictedPattern =
      typeof out.predictedPattern === "string"
        ? out.predictedPattern.slice(0, 240)
        : "";
    const trap = typeof out.trap === "string" ? out.trap.slice(0, 240) : "";
    const oneLiner =
      typeof out.oneLiner === "string" ? out.oneLiner.slice(0, 240) : "";
    if (!predictedPattern && !oneLiner) throw new MistralUnavailable("empty");

    const result = { predictedPattern, trap, oneLiner };
    cacheSet(cacheKey, result);
    return NextResponse.json({ ok: true, ...result });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
