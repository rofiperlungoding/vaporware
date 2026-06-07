import { NextResponse } from "next/server";
import { createDoor } from "@/lib/painted-door";
import { allow, clientKey, sanitizeText } from "@/lib/ai-guards";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!allow(`door-create:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const ideaId = sanitizeText(String(body.ideaId ?? ""), 80);
  if (!ideaId) return NextResponse.json({ ok: false }, { status: 200 });
  const sessionId = sanitizeText(String(body.sessionId ?? ""), 80);

  const token = await createDoor(ideaId, sessionId);
  if (!token) return NextResponse.json({ ok: false }, { status: 200 });

  return NextResponse.json({ ok: true, token });
}
