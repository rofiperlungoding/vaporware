import "server-only";
import { getSupabaseAdmin } from "./supabase";
import { getIdeaWithStats } from "./store";
import type { IdeaWithStats } from "./types";

function newToken(): string {
  const raw =
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return raw.replace(/-/g, "");
}

export async function createDoor(
  ideaId: string,
  sessionId: string,
): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const token = newToken();
  const { error } = await supabase
    .from("painted_doors")
    .insert({ token, idea_id: ideaId, session_id: sessionId || null });
  if (error) return null;
  return token;
}

export async function getDoorIdea(
  token: string,
): Promise<IdeaWithStats | null> {
  const supabase = getSupabaseAdmin();
  const res = await supabase
    .from("painted_doors")
    .select("idea_id")
    .eq("token", token)
    .maybeSingle();
  if (res.error || !res.data) return null;
  return getIdeaWithStats((res.data as { idea_id: string }).idea_id);
}
