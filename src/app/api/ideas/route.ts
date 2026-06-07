import { NextResponse } from "next/server";
import { addUserIdea, getIdeasWithStats } from "@/lib/store";

export async function GET() {
  const ideas = await getIdeasWithStats();
  return NextResponse.json({ ideas });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { oneLiner, tagline, category, price } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof oneLiner !== "string" || oneLiner.trim().length < 8) {
    return NextResponse.json(
      { error: "Give your idea at least a real one-liner (8+ chars)." },
      { status: 400 },
    );
  }

  const idea = await addUserIdea({
    oneLiner: oneLiner.trim(),
    tagline: typeof tagline === "string" ? tagline.trim() : "",
    category: typeof category === "string" ? category.trim() : "",
    price: typeof price === "string" ? price.trim() : "",
  });

  return NextResponse.json({ idea }, { status: 201 });
}
