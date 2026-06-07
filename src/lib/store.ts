// Local persistence layer. Reads/writes JSON files under .data/.
// This is the ONLY module that knows where data lives — swap the bodies of these
// functions for Supabase calls later and nothing else has to change.
import { promises as fs } from "node:fs";
import path from "node:path";
import { SEED_IDEAS } from "./ideas";
import type { Idea, IdeaStats, IdeaWithStats, VoteRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const VOTES_FILE = path.join(DATA_DIR, "votes.json");
const USER_IDEAS_FILE = path.join(DATA_DIR, "user-ideas.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
}

async function getUserIdeas(): Promise<Idea[]> {
  return readJson<Idea[]>(USER_IDEAS_FILE, []);
}

async function getVotes(): Promise<VoteRecord[]> {
  return readJson<VoteRecord[]>(VOTES_FILE, []);
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
  const [userIdeas, votes] = await Promise.all([getUserIdeas(), getVotes()]);
  const all = [...SEED_IDEAS, ...userIdeas];
  return all.map((idea) => ({ ...idea, stats: computeStats(idea, votes) }));
}

export async function getIdeaWithStats(
  ideaId: string,
): Promise<IdeaWithStats | null> {
  const [userIdeas, votes] = await Promise.all([getUserIdeas(), getVotes()]);
  const idea = [...SEED_IDEAS, ...userIdeas].find((i) => i.id === ideaId);
  if (!idea) return null;
  return { ...idea, stats: computeStats(idea, votes) };
}

export async function recordVote(input: {
  ideaId: string;
  sessionId: string;
  saidYes: boolean;
  didClick: boolean;
}): Promise<IdeaWithStats | null> {
  const votes = await getVotes();
  votes.push({
    ideaId: input.ideaId,
    sessionId: input.sessionId,
    saidYes: input.saidYes,
    didClick: input.didClick,
    ts: Date.now(),
  });
  await writeJson(VOTES_FILE, votes);
  return getIdeaWithStats(input.ideaId);
}

export async function addUserIdea(input: {
  oneLiner: string;
  tagline: string;
  category: string;
  price: string;
}): Promise<IdeaWithStats> {
  const userIdeas = await getUserIdeas();
  const idea: Idea = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    oneLiner: input.oneLiner.slice(0, 120),
    tagline: input.tagline.slice(0, 160),
    category: input.category.slice(0, 40) || "Wildcard",
    price: input.price.slice(0, 20) || "$5/mo",
    source: "user",
    // New ideas start from a clean slate — their gap is earned live.
    baseSaidYes: 0,
    baseSaidNo: 0,
    baseDidClick: 0,
  };
  userIdeas.push(idea);
  await writeJson(USER_IDEAS_FILE, userIdeas);
  const votes = await getVotes();
  return { ...idea, stats: computeStats(idea, votes) };
}
