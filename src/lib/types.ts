// Core domain types for the validation arcade.

export type Idea = {
  id: string;
  oneLiner: string;
  tagline: string;
  category: string;
  price: string; // display string e.g. "$5/mo"
  source: "seed" | "user";
  // Pre-seeded "crowd" so the arcade is never empty and the gap is populated.
  baseSaidYes: number;
  baseSaidNo: number;
  baseDidClick: number; // subset of baseSaidYes who "opened their wallet"
};

export type IdeaStats = {
  saidYes: number;
  saidNo: number;
  didClick: number;
  totalVotes: number;
  sayRate: number; // % of all voters who swiped "take my money"
  doRate: number; // % of yes-sayers who actually clicked checkout
  delusionScore: number; // sayRate * (1 - doRate): loved in theory, ignored in practice
};

export type IdeaWithStats = Idea & { stats: IdeaStats };

export type VoteRecord = {
  ideaId: string;
  sessionId: string;
  saidYes: boolean;
  didClick: boolean;
  ts: number;
};
