import { NextResponse } from "next/server";
import { getCategoryStats } from "@/lib/aggregates";

export const runtime = "nodejs";

export async function GET() {
  try {
    const categories = await getCategoryStats();
    return NextResponse.json({ ok: true, categories });
  } catch {
    return NextResponse.json({ ok: false, categories: [] }, { status: 200 });
  }
}
