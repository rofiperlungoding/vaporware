import type { Idea } from "./types";

// Seed "crowd" so a stranger landing cold still sees a full arcade with
// believable say-do gaps. Baselines are tuned to real-world ranges:
//   - say-rate (swipe "take my money"): mostly 33–64%. No fantasy 90%s.
//   - do-rate (yes-sayers who actually click pay): grounded in painted-door
//     reality + the intention–behavior gap — novelty ideas 6–20%, genuinely
//     painful problems 45–60%. Rarely above 65%.
// This makes the gap land as insight, not as a rigged stat.
export const SEED_IDEAS: Idea[] = [
  {
    id: "seed-ai-fridge",
    oneLiner: "AI that tells you what to cook from a photo of your fridge",
    tagline: "Snap the shelf, get three recipes you can actually make tonight.",
    category: "Consumer",
    price: "$4/mo",
    source: "seed",
    baseSaidYes: 164, baseSaidNo: 178, baseDidClick: 36, // 48% say · 22% do
  },
  {
    id: "seed-meeting-killer",
    oneLiner: "A bot that auto-declines meetings that could've been an email",
    tagline: "It reads the invite, judges it, and sends your regrets for you.",
    category: "Productivity",
    price: "$7/mo",
    source: "seed",
    baseSaidYes: 332, baseSaidNo: 186, baseDidClick: 46, // 64% say · 14% do
  },
  {
    id: "seed-sub-graveyard",
    oneLiner: "Subscription graveyard that shames your unused $9.99 charges",
    tagline: "A monthly funeral for the apps you swore you'd use.",
    category: "Fintech",
    price: "$3/mo",
    source: "seed",
    baseSaidYes: 97, baseSaidNo: 140, baseDidClick: 37, // 41% say · 38% do
  },
  {
    id: "seed-prd-roast",
    oneLiner: "Brutally honest AI that roasts your product spec before your boss does",
    tagline: "Find the holes in your PRD while it's still cheap to fix them.",
    category: "Product",
    price: "$10/mo",
    source: "seed",
    baseSaidYes: 213, baseSaidNo: 196, baseDidClick: 23, // 52% say · 11% do
  },
  {
    id: "seed-plant-text",
    oneLiner: "Your houseplants text you when they're actually thirsty",
    tagline: "A cheap sensor and a guilt trip, delivered by SMS.",
    category: "Hardware",
    price: "$6/mo",
    source: "seed",
    baseSaidYes: 62, baseSaidNo: 126, baseDidClick: 6, // 33% say · 10% do
  },
  {
    id: "seed-awkward-rewrite",
    oneLiner: "Rewrites your awkward Slack message into something not unhinged",
    tagline: "Paste the panic, get back a calm professional human.",
    category: "Productivity",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 127, baseSaidNo: 149, baseDidClick: 39, // 46% say · 31% do
  },
  {
    id: "seed-standup-skip",
    oneLiner: "Async standup tool that lets engineers never speak out loud again",
    tagline: "One message, no camera, no 'can everyone see my screen'.",
    category: "Product",
    price: "$8/mo",
    source: "seed",
    baseSaidYes: 211, baseSaidNo: 152, baseDidClick: 93, // 58% say · 44% do
  },
  {
    id: "seed-gym-guilt",
    oneLiner: "Charges your friend $10 every time you skip the gym",
    tagline: "Accountability with real financial consequences for someone you love.",
    category: "Consumer",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 232, baseSaidNo: 189, baseDidClick: 16, // 55% say · 7% do
  },
  {
    id: "seed-invoice-chase",
    oneLiner: "Politely terrifying bot that chases late-paying clients for freelancers",
    tagline: "Escalating emails, from 'just checking in' to 'my lawyer cousin'.",
    category: "Fintech",
    price: "$12/mo",
    source: "seed",
    baseSaidYes: 81, baseSaidNo: 133, baseDidClick: 46, // 38% say · 57% do
  },
  {
    id: "seed-tab-hoarder",
    oneLiner: "Saves your 87 open browser tabs and admits you'll never read them",
    tagline: "A dignified hospice for tabs you've been 'getting to'.",
    category: "Productivity",
    price: "$3/mo",
    source: "seed",
    baseSaidYes: 131, baseSaidNo: 167, baseDidClick: 16, // 44% say · 12% do
  },
  {
    id: "seed-dream-journal",
    oneLiner: "Voice-note dream journal that turns last night into weird art",
    tagline: "Mumble it at 3am, wake up to a surrealist painting.",
    category: "Consumer",
    price: "$6/mo",
    source: "seed",
    baseSaidYes: 65, baseSaidNo: 111, baseDidClick: 8, // 37% say · 13% do
  },
  {
    id: "seed-changelog",
    oneLiner: "Turns your git commits into a changelog humans actually want to read",
    tagline: "Ship notes that sound like a person, generated while you sleep.",
    category: "Product",
    price: "$9/mo",
    source: "seed",
    baseSaidYes: 101, baseSaidNo: 151, baseDidClick: 41, // 40% say · 41% do
  },
  {
    id: "seed-okr-detector",
    oneLiner: "Detects which of your OKRs are just tasks wearing a costume",
    tagline: "Paste your goals, find out which ones are vanity in disguise.",
    category: "Product",
    price: "$10/mo",
    source: "seed",
    baseSaidYes: 110, baseSaidNo: 123, baseDidClick: 18, // 47% say · 16% do
  },
  {
    id: "seed-pet-translate",
    oneLiner: "Translates your cat's meow into passive-aggressive English",
    tagline: "Finally understand exactly how disappointed they are in you.",
    category: "Consumer",
    price: "$4/mo",
    source: "seed",
    baseSaidYes: 297, baseSaidNo: 190, baseDidClick: 18, // 61% say · 6% do
  },
  {
    id: "seed-cold-email",
    oneLiner: "Writes cold emails that don't sound like a cold email",
    tagline: "Less 'hope this finds you well', more 'they actually replied'.",
    category: "Sales",
    price: "$15/mo",
    source: "seed",
    baseSaidYes: 69, baseSaidNo: 129, baseDidClick: 33, // 35% say · 48% do
  },
  {
    id: "seed-baby-name",
    oneLiner: "A/B tests baby names against strangers before you commit for life",
    tagline: "Crowdsource the most permanent product decision you'll ever make.",
    category: "Consumer",
    price: "$8 once",
    source: "seed",
    baseSaidYes: 112, baseSaidNo: 149, baseDidClick: 11, // 43% say · 10% do
  },
  {
    id: "seed-receipt-tax",
    oneLiner: "Snap a receipt, it files the expense before you forget",
    tagline: "The 4-second gap between lunch and an approved expense report.",
    category: "Fintech",
    price: "$7/mo",
    source: "seed",
    baseSaidYes: 80, baseSaidNo: 143, baseDidClick: 42, // 36% say · 52% do
  },
  {
    id: "seed-focus-jail",
    oneLiner: "Locks your phone in a timed app-jail you genuinely can't escape",
    tagline: "No 'just five minutes'. The door is locked and so is Instagram.",
    category: "Productivity",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 222, baseSaidNo: 167, baseDidClick: 42, // 57% say · 19% do
  },
  {
    id: "seed-pitch-deck",
    oneLiner: "Turns a voice memo of your idea into a real pitch deck",
    tagline: "Ramble for two minutes, get ten slides that almost make sense.",
    category: "Product",
    price: "$19/mo",
    source: "seed",
    baseSaidYes: 101, baseSaidNo: 106, baseDidClick: 24, // 49% say · 24% do
  },
  {
    id: "seed-leftover-swap",
    oneLiner: "Neighborhood app to swap leftovers instead of binning them",
    tagline: "Your extra lasagna for their banana bread. No money, just food.",
    category: "Consumer",
    price: "Free + $3 tip",
    source: "seed",
    baseSaidYes: 161, baseSaidNo: 155, baseDidClick: 13, // 51% say · 8% do
  },
];
