import { getSupabaseAdmin } from "./supabase";
import type { Idea, IdeaStats, IdeaWithStats, VoteRecord } from "./types";

type IdeaRow = {
  id: string;
  one_liner: string;
  tagline: string;
  category: string;
  price: string;
  source: "seed" | "user";
  base_said_yes: number;
  base_said_no: number;
  base_did_click: number;
};

type VoteRow = {
  idea_id: string;
  said_yes: boolean;
  did_pay: boolean | null;
  session_id: string | null;
  created_at: string;
};

const IDEA_COLUMNS =
  "id, one_liner, tagline, category, price, source, base_said_yes, base_said_no, base_did_click";

function toIdea(row: IdeaRow): Idea {
  return {
    id: row.id,
    oneLiner: row.one_liner,
    tagline: row.tagline,
    category: row.category,
    price: row.price,
    source: row.source,
    baseSaidYes: row.base_said_yes,
    baseSaidNo: row.base_said_no,
    baseDidClick: row.base_did_click,
  };
}

function toVoteRecord(row: VoteRow): VoteRecord {
  return {
    ideaId: row.idea_id,
    sessionId: row.session_id ?? "",
    saidYes: row.said_yes,
    didClick: row.did_pay === true,
    ts: new Date(row.created_at).getTime(),
  };
}

function computeStats(idea: Idea, votes: VoteRecord[]): IdeaStats {
  const mine = votes.filter((v) => v.ideaId === idea.id);
  const saidYes = idea.baseSaidYes + mine.filter((v) => v.saidYes).length;
  const saidNo = idea.baseSaidNo + mine.filter((v) => !v.saidYes).length;
  const didClick = idea.baseDidClick + mine.filter((v) => v.didClick).length;
  const totalVotes = saidYes + saidNo;

  const sayRate = totalVotes > 0 ? saidYes / totalVotes : 0;
  const doRate = saidYes > 0 ? didClick / saidYes : 0;
  const delusionScore = sayRate * (1 - doRate);

  return {
    saidYes,
    saidNo,
    didClick,
    totalVotes,
    sayRate: Math.round(sayRate * 100),
    doRate: Math.round(doRate * 100),
    delusionScore: Math.round(delusionScore * 100),
  };
}

export async function getIdeasWithStats(): Promise<IdeaWithStats[]> {
  const supabase = getSupabaseAdmin();

  const [ideasResult, votesResult] = await Promise.all([
    supabase
      .from("ideas")
      .select(IDEA_COLUMNS)
      .order("is_seed", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase.from("votes").select("idea_id, said_yes, did_pay, session_id, created_at"),
  ]);

  if (ideasResult.error) throw ideasResult.error;
  if (votesResult.error) throw votesResult.error;

  const votes = (votesResult.data as VoteRow[]).map(toVoteRecord);

  return (ideasResult.data as IdeaRow[]).map((row) => {
    const idea = toIdea(row);
    return { ...idea, stats: computeStats(idea, votes) };
  });
}

export async function getIdeaWithStats(
  ideaId: string,
): Promise<IdeaWithStats | null> {
  const supabase = getSupabaseAdmin();

  const ideaResult = await supabase
    .from("ideas")
    .select(IDEA_COLUMNS)
    .eq("id", ideaId)
    .maybeSingle();

  if (ideaResult.error) throw ideaResult.error;
  if (!ideaResult.data) return null;

  const votesResult = await supabase
    .from("votes")
    .select("idea_id, said_yes, did_pay, session_id, created_at")
    .eq("idea_id", ideaId);

  if (votesResult.error) throw votesResult.error;

  const idea = toIdea(ideaResult.data as IdeaRow);
  const votes = (votesResult.data as VoteRow[]).map(toVoteRecord);
  return { ...idea, stats: computeStats(idea, votes) };
}

export async function recordVote(input: {
  ideaId: string;
  sessionId: string;
  saidYes: boolean;
  didClick: boolean;
}): Promise<IdeaWithStats | null> {
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("votes").insert({
    idea_id: input.ideaId,
    said_yes: input.saidYes,
    did_pay: input.didClick ? true : null,
    session_id: input.sessionId,
  });

  if (error) return null;

  return getIdeaWithStats(input.ideaId);
}

export async function addUserIdea(input: {
  oneLiner: string;
  tagline: string;
  category: string;
  price: string;
}): Promise<IdeaWithStats> {
  const supabase = getSupabaseAdmin();

  const idea: Idea = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    oneLiner: input.oneLiner.slice(0, 120),
    tagline: input.tagline.slice(0, 160),
    category: input.category.slice(0, 40) || "Wildcard",
    price: input.price.slice(0, 20) || "$5/mo",
    source: "user",
    baseSaidYes: 0,
    baseSaidNo: 0,
    baseDidClick: 0,
  };

  const { error } = await supabase.from("ideas").insert({
    id: idea.id,
    one_liner: idea.oneLiner,
    tagline: idea.tagline,
    category: idea.category,
    price: idea.price,
    source: idea.source,
    base_said_yes: idea.baseSaidYes,
    base_said_no: idea.baseSaidNo,
    base_did_click: idea.baseDidClick,
    is_seed: false,
  });

  if (error) throw error;

  return { ...idea, stats: computeStats(idea, []) };
}
