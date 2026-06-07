import "server-only";
import { getSupabaseAdmin } from "./supabase";

type IdeaRow = {
  id: string;
  category: string;
  base_said_yes: number;
  base_said_no: number;
  base_did_click: number;
};

type VoteRow = {
  idea_id: string;
  said_yes: boolean;
  did_pay: boolean | null;
  created_at: string;
};

export type CategoryStat = {
  category: string;
  sayRate: number;
  doRate: number;
  saidYes: number;
  ideaCount: number;
  hasLive: boolean;
};

export type LivePulse = {
  windowMinutes: number;
  saidYesRecent: number;
  paidRecent: number;
  seededSayRate: number;
  seededDoRate: number;
};

const CAT_TTL = 30000;
const PULSE_TTL = 10000;
const PULSE_WINDOW_MIN = 1440;

let catCache: { value: CategoryStat[]; exp: number } | null = null;
let pulseCache: { value: LivePulse; exp: number } | null = null;

export async function getCategoryStats(): Promise<CategoryStat[]> {
  if (catCache && Date.now() < catCache.exp) return catCache.value;

  const supabase = getSupabaseAdmin();
  const [ideasRes, votesRes] = await Promise.all([
    supabase
      .from("ideas")
      .select("id, category, base_said_yes, base_said_no, base_did_click"),
    supabase.from("votes").select("idea_id, said_yes, did_pay, created_at"),
  ]);
  if (ideasRes.error) throw ideasRes.error;
  if (votesRes.error) throw votesRes.error;

  const ideas = ideasRes.data as IdeaRow[];
  const votes = votesRes.data as VoteRow[];

  const liveByIdea = new Map<
    string,
    { yes: number; no: number; click: number }
  >();
  for (const v of votes) {
    const e = liveByIdea.get(v.idea_id) ?? { yes: 0, no: 0, click: 0 };
    if (v.said_yes) e.yes += 1;
    else e.no += 1;
    if (v.did_pay === true) e.click += 1;
    liveByIdea.set(v.idea_id, e);
  }

  const byCat = new Map<
    string,
    { yes: number; no: number; click: number; count: number; live: boolean }
  >();
  for (const idea of ideas) {
    const live = liveByIdea.get(idea.id);
    const cat = idea.category || "Other";
    const e = byCat.get(cat) ?? {
      yes: 0,
      no: 0,
      click: 0,
      count: 0,
      live: false,
    };
    e.yes += idea.base_said_yes + (live?.yes ?? 0);
    e.no += idea.base_said_no + (live?.no ?? 0);
    e.click += idea.base_did_click + (live?.click ?? 0);
    e.count += 1;
    if (live && live.yes + live.no > 0) e.live = true;
    byCat.set(cat, e);
  }

  const stats: CategoryStat[] = [];
  for (const [category, e] of byCat) {
    const total = e.yes + e.no;
    if (e.yes < 30) continue;
    stats.push({
      category,
      sayRate: total > 0 ? Math.round((e.yes / total) * 100) : 0,
      doRate: e.yes > 0 ? Math.round((e.click / e.yes) * 100) : 0,
      saidYes: e.yes,
      ideaCount: e.count,
      hasLive: e.live,
    });
  }
  stats.sort((a, b) => b.doRate - a.doRate);

  catCache = { value: stats, exp: Date.now() + CAT_TTL };
  return stats;
}

export async function getLivePulse(): Promise<LivePulse> {
  if (pulseCache && Date.now() < pulseCache.exp) return pulseCache.value;

  const supabase = getSupabaseAdmin();
  const since = new Date(Date.now() - PULSE_WINDOW_MIN * 60000).toISOString();

  const [recentRes, ideasRes] = await Promise.all([
    supabase.from("votes").select("said_yes, did_pay").gte("created_at", since),
    supabase.from("ideas").select("base_said_yes, base_said_no, base_did_click"),
  ]);
  if (recentRes.error) throw recentRes.error;
  if (ideasRes.error) throw ideasRes.error;

  const recent = recentRes.data as { said_yes: boolean; did_pay: boolean | null }[];
  const saidYesRecent = recent.filter((v) => v.said_yes).length;
  const paidRecent = recent.filter((v) => v.did_pay === true).length;

  const ideas = ideasRes.data as IdeaRow[];
  let by = 0;
  let bn = 0;
  let bc = 0;
  for (const i of ideas) {
    by += i.base_said_yes;
    bn += i.base_said_no;
    bc += i.base_did_click;
  }
  const seededTotal = by + bn;

  const value: LivePulse = {
    windowMinutes: PULSE_WINDOW_MIN,
    saidYesRecent,
    paidRecent,
    seededSayRate: seededTotal > 0 ? Math.round((by / seededTotal) * 100) : 0,
    seededDoRate: by > 0 ? Math.round((bc / by) * 100) : 0,
  };

  pulseCache = { value, exp: Date.now() + PULSE_TTL };
  return value;
}
