import { NextResponse } from "next/server";
import { recordVote } from "@/lib/store";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { ideaId, sessionId, saidYes, didClick } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof ideaId !== "string" || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "ideaId and sessionId are required." },
      { status: 400 },
    );
  }

  const updated = await recordVote({
    ideaId,
    sessionId,
    saidYes: Boolean(saidYes),
    didClick: Boolean(didClick),
  });

  if (!updated) {
    return NextResponse.json({ error: "Idea not found." }, { status: 404 });
  }

  return NextResponse.json({ idea: updated });
}
