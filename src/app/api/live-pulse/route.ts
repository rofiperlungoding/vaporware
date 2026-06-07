import { NextResponse } from "next/server";
import { getLivePulse } from "@/lib/aggregates";
import { allow, clientKey } from "@/lib/ai-guards";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!allow(`pulse:${clientKey(request)}`)) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
  try {
    const pulse = await getLivePulse();
    return NextResponse.json({ ok: true, ...pulse });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
