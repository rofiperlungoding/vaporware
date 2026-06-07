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
  {
    id: "seed-chat-summary",
    oneLiner: "AI that summarizes the group chat you ignored for three days",
    tagline: "300 messages in, two of them mattered. Here they are.",
    category: "Productivity",
    price: "$4/mo",
    source: "seed",
    baseSaidYes: 144, baseSaidNo: 144, baseDidClick: 30, // 50% say · 21% do
  },
  {
    id: "seed-second-brain",
    oneLiner: "Turns your messy bookmarks into a searchable second brain",
    tagline: "Everything you saved and forgot, finally findable.",
    category: "Productivity",
    price: "$6/mo",
    source: "seed",
    baseSaidYes: 109, baseSaidNo: 138, baseDidClick: 28, // 44% say · 26% do
  },
  {
    id: "seed-bill-negotiator",
    oneLiner: "Negotiates your bills with providers so you never call again",
    tagline: "It sits on hold, you keep the savings.",
    category: "Fintech",
    price: "$9/mo",
    source: "seed",
    baseSaidYes: 195, baseSaidNo: 136, baseDidClick: 64, // 59% say · 33% do
  },
  {
    id: "seed-text-mad",
    oneLiner: "Tells you if that text means they're actually mad at you",
    tagline: "Decode the 'k.' before you spiral for an hour.",
    category: "Consumer",
    price: "$3/mo",
    source: "seed",
    baseSaidYes: 144, baseSaidNo: 132, baseDidClick: 16, // 52% say · 11% do
  },
  {
    id: "seed-auto-tests",
    oneLiner: "Auto-generates unit tests from your messy untested code",
    tagline: "Coverage goes up while you do literally nothing.",
    category: "Dev",
    price: "$12/mo",
    source: "seed",
    baseSaidYes: 163, baseSaidNo: 139, baseDidClick: 62, // 54% say · 38% do
  },
  {
    id: "seed-fake-emergency",
    oneLiner: "Panic button that calls you with a fake emergency to escape bad dates",
    tagline: "Your 'sick aunt' rings right on schedule.",
    category: "Consumer",
    price: "$2/mo",
    source: "seed",
    baseSaidYes: 150, baseSaidNo: 113, baseDidClick: 14, // 57% say · 9% do
  },
  {
    id: "seed-later-roast",
    oneLiner: "Tracks every 'I'll do it later' and roasts you for it weekly",
    tagline: "A receipt of your own procrastination, delivered Sundays.",
    category: "Productivity",
    price: "$4/mo",
    source: "seed",
    baseSaidYes: 90, baseSaidNo: 129, baseDidClick: 11, // 41% say · 12% do
  },
  {
    id: "seed-trip-split",
    oneLiner: "Splits group trip expenses without the awkward spreadsheet",
    tagline: "Who paid for what, settled before you land home.",
    category: "Fintech",
    price: "$3/mo",
    source: "seed",
    baseSaidYes: 141, baseSaidNo: 153, baseDidClick: 62, // 48% say · 44% do
  },
  {
    id: "seed-sous-chef",
    oneLiner: "AI sous-chef that adjusts the recipe as you improvise",
    tagline: "Out of an ingredient? It re-plans on the fly.",
    category: "Consumer",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 81, baseSaidNo: 127, baseDidClick: 12, // 39% say · 15% do
  },
  {
    id: "seed-highlight-digest",
    oneLiner: "Turns your reading highlights into a weekly insight email",
    tagline: "The best lines you saved, resurfaced before you forget them.",
    category: "Productivity",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 101, baseSaidNo: 135, baseDidClick: 29, // 43% say · 29% do
  },
  {
    id: "seed-burnout-detect",
    oneLiner: "Detects burnout from your calendar and forces a day off",
    tagline: "When the meetings cross the line, it blocks the day for you.",
    category: "HR",
    price: "$8/mo",
    source: "seed",
    baseSaidYes: 165, baseSaidNo: 147, baseDidClick: 21, // 53% say · 13% do
  },
  {
    id: "seed-flight-combo",
    oneLiner: "Books the cheapest flight combo while you sleep",
    tagline: "You set the trip, it hunts the fares overnight.",
    category: "Travel",
    price: "$7/mo",
    source: "seed",
    baseSaidYes: 218, baseSaidNo: 140, baseDidClick: 89, // 61% say · 41% do
  },
  {
    id: "seed-review-replies",
    oneLiner: "AI that drafts replies to your one-star reviews",
    tagline: "Stay classy when you really want to type in all caps.",
    category: "SMB",
    price: "$10/mo",
    source: "seed",
    baseSaidYes: 71, baseSaidNo: 120, baseDidClick: 35, // 37% say · 49% do
  },
  {
    id: "seed-startup-namer",
    oneLiner: "Names your startup and checks the domain in one go",
    tagline: "Stop falling in love with names that are already taken.",
    category: "Product",
    price: "$6/mo",
    source: "seed",
    baseSaidYes: 111, baseSaidNo: 131, baseDidClick: 19, // 46% say · 17% do
  },
  {
    id: "seed-who-is-this",
    oneLiner: "Reminds you who someone is right before you meet them",
    tagline: "A two-line dossier so you never blank on a name again.",
    category: "Consumer",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 136, baseSaidNo: 135, baseDidClick: 30, // 50% say · 22% do
  },
  {
    id: "seed-whiteboard-diagram",
    oneLiner: "Turns whiteboard photos into editable diagrams",
    tagline: "Snap the meeting scrawl, get a real flowchart.",
    category: "Product",
    price: "$9/mo",
    source: "seed",
    baseSaidYes: 121, baseSaidNo: 137, baseDidClick: 44, // 47% say · 36% do
  },
  {
    id: "seed-spam-shield",
    oneLiner: "A second phone number that fields spam calls for you",
    tagline: "Robocallers argue with a bot instead of you.",
    category: "Consumer",
    price: "$4/mo",
    source: "seed",
    baseSaidYes: 158, baseSaidNo: 129, baseDidClick: 74, // 55% say · 47% do
  },
  {
    id: "seed-resume-grader",
    oneLiner: "Grades your resume like a ruthless recruiter",
    tagline: "The brutal six-second skim, before a human gives it.",
    category: "Career",
    price: "$5/mo",
    source: "seed",
    baseSaidYes: 129, baseSaidNo: 134, baseDidClick: 25, // 49% say · 19% do
  },
  {
    id: "seed-energy-week",
    oneLiner: "Plans your week around your actual energy levels, not the clock",
    tagline: "Deep work when you're sharp, busywork when you're toast.",
    category: "Productivity",
    price: "$6/mo",
    source: "seed",
    baseSaidYes: 152, baseSaidNo: 146, baseDidClick: 21, // 51% say · 14% do
  },
  {
    id: "seed-trial-canceler",
    oneLiner: "Watches your free trials and cancels them before they bill",
    tagline: "Never get charged for the thing you forgot to quit.",
    category: "Fintech",
    price: "$3/mo",
    source: "seed",
    baseSaidYes: 198, baseSaidNo: 143, baseDidClick: 101, // 58% say · 51% do
  },
];
