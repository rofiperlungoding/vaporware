import { createClient } from "@supabase/supabase-js";
import { SEED_IDEAS } from "../src/lib/ideas.ts";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Pass them via --env-file=.env.local.",
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const rows = SEED_IDEAS.map((idea) => ({
  id: idea.id,
  one_liner: idea.oneLiner,
  tagline: idea.tagline,
  category: idea.category,
  price: idea.price,
  source: idea.source,
  base_said_yes: idea.baseSaidYes,
  base_said_no: idea.baseSaidNo,
  base_did_click: idea.baseDidClick,
  is_seed: true,
}));

const { error } = await supabase.from("ideas").upsert(rows, { onConflict: "id" });

if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} ideas.`);
