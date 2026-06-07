# Vaporware

**Everyone says they'd pay. Few actually click.**

A validation arcade for product ideas. Swipe what you'd pay for — then the app
shows you who *actually* pulled out their wallet. The gap between what people
**say** and what they **do** is the whole point.

Built for the [Mind the Product — World Product Day "Everyone Ships Now"](https://mindtheproduct.devpost.com/)
hackathon.

**Live:** https://vapor-wave.netlify.app

## The idea

Stated intent is cheap. On a swipe, lots of people happily say "take my money".
But a real checkout button is where intent meets friction. Vaporware measures
both:

- **say-rate** — % who swipe "take my money"
- **do-rate** — % of those who then actually click *pay* at a (fake) checkout

The difference is the **say–do gap** — the same lesson the
[intention–behavior gap](https://link.springer.com/doi/10.1007/s11747-020-00764-w)
and [painted-door tests](https://www.ideaplan.io/qa/what-is-a-painted-door-test)
teach product teams: don't trust what users say, measure what they do.

> Seeded baseline numbers are demo data modeled on real painted-door benchmarks
> (typical click-through 0.5–8%) and the documented intention–behavior gap.
> Real votes accumulate on top.

## Features

- Tinder-style swipe deck (drag or keyboard: `←` pass, `→` pay, `Enter` next)
- A "moment of truth" fake checkout that captures the do-rate
- Per-card reveal of the say–do gap with a rubber-stamp verdict
- **Scoreboard**: *Hall of Delusion* (loved, unpaid) and *Sleeper Hits*
- **Play anonymously** — no sign-up needed; your picks are saved on-device
- **My Picks** — your personal index (would-pay / all-talk / passed)
- Gentle **account nudge** after a few picks (save your progress)
- **Share your verdict** (Web Share API + clipboard fallback)
- **The Receipt** — end-of-deck climax: your personal say-do gap + verdict stamp
- **Grounded AI (Mistral)** — an AI roast on your Receipt that names the specific
  ideas you said yes to but bailed on, plus an AI "painted-door read" on ideas
  you submit. Honestly labeled, degrades to static text if AI is off.
- **Themed decks** — "All" or "AI Startups 2026" (id-prefixed seed ideas, single
  source theme map in `themes.ts`); choice persists locally
- **Scoreboard insights** — a live behavioral ticker, say-do **by category**, and
  an AI **Editor's Note** (deterministic static fallback)
- **Trust layer** — painted-door disclosure, consent before email capture, and a
  "clear my data" control
- **Painted-door share link** — submit an idea, get an unguessable link that
  collects that idea's *own* say-do data ("early · low sample")
- Submit your own idea into the arena
- Every new surface is **feature-flagged** and degrades to a clean static fallback
- Provenance is always labeled: `demo data` / `live` / `🤖 AI read`
- Accessible: keyboard support + reduced-motion handling

## Tech

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- [Motion](https://motion.dev/) for swipe physics & animation
- Tailwind CSS v4
- **Supabase (Postgres)** for ideas + votes — all access isolated in
  `src/lib/store.ts`; the browser never talks to Supabase directly
- **Deployed on Netlify** (auto-deploys from GitHub); config in `netlify.toml`
- **Novus.ai (Pendo)** behavioral analytics — loaded once in `layout.tsx`, all
  events funnel through `src/lib/track.ts`
- **Mistral AI** (`mistral-small-latest`) — server-only, grounded enhancement
  layer; all calls in route handlers via `src/lib/mistral.ts`, never the browser

## AI (grounded, not generated)

Two AI surfaces, both fed **only the player's real session data** and labeled as AI:

- **Verdict Narrator** (`/api/verdict-narration`) — on the Receipt, names the
  specific ideas you said yes to but didn't pay for.
- **Painted-door Read** (`/api/painted-door-read`) — on idea submit, predicts the
  idea's say-do trap, grounded in the painted-door / intention-behavior framework.

Hardened: server-only key, 4s timeout + 1 retry, JSON-validated, per-IP throttle,
short-TTL cache, sanitized inputs (no PII). **If `MISTRAL_API_KEY` is unset or the
call fails, every surface falls back to static text** — the app stays fully usable.

## Analytics (the say-do gap, measurable)

Events fire through the single `src/lib/track.ts` adapter:
`idea_viewed`, `said_yes`, `said_no`, `checkout_opened`, `paid`,
`checkout_abandoned`, `idea_submitted`.

- **say-rate** = `said_yes / idea_viewed`
- **do-rate** = `paid / checkout_opened`

Set `NEXT_PUBLIC_NOVUS_PROJECT_ID` (public client key) to enable the agent; if
unset, tracking no-ops safely. Set `MISTRAL_API_KEY` (server-only) to enable the
AI surfaces; if unset, they fall back to static text.

### Campaign events

`deck_theme_selected`, `crowd_segment_viewed`, `crowd_note_shown {grounded}`,
`live_pulse_viewed {transport}`, `trust_disclosure_shown`, `trust_consent_given`,
`ai_verdict_shown {tier,grounded}`, `ai_read_requested`, `ai_read_shown {grounded}`,
`painted_door_link_created`, `painted_door_vote {token_hash}`.

### Feature flags (`FEATURES` in `config.ts`)

Client-safe booleans, override via `NEXT_PUBLIC_FEATURE_*`: `THEMED_DECKS`,
`SEGMENTED_GAP`, `LIVE_TICKER`, `TRUST_LAYER`, `PAINTED_DOOR_LINK` — all default
ON. Flip any to `false` to cleanly remove that surface.

## Setup

The hosted Supabase project is already provisioned, migrated, and seeded. To run
locally you only need its credentials.

1. Copy the env template and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` — Project Settings → API → Project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — Project Settings → API → `service_role` /
     `sb_secret_…` (server-only, never exposed to the browser)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Recreating the database from scratch

Only needed for a fresh Supabase project (the existing one is already set up):

1. Run the schema migration in `supabase/migrations/0001_init.sql` (SQL Editor
   or `supabase db push`).
2. Seed the 40 starter ideas (idempotent):
   ```bash
   npm run db:seed
   ```

## Data model

- `ideas` — id, copy, price, `source` (`seed`/`user`), baseline counts
  (`base_said_yes` / `base_said_no` / `base_did_click`), `is_seed`, `created_at`
  (54 seeded: classic + 14 `seed-ai2026-*`)
- `votes` — `idea_id` (fk), `said_yes`, `did_pay` (null if bailed/never reached),
  `session_id`, `created_at`
- `painted_doors` — `token` (pk), `idea_id` (fk), `session_id`, `created_at` —
  maps a share link to one idea
- say-rate / do-rate are computed by combining each idea's baseline with live
  vote rows. All tables have RLS enabled; only the server's secret key (which
  bypasses RLS) accesses them.

## Project structure

```
src/
  app/
    page.tsx                         # arcade (home)
    leaderboard/                     # scoreboard (ticker + segmented gap)
    d/[token]/                       # public painted-door share page
    api/ideas · api/vote
    api/receipt-image                # shareable OG receipt (next/og)
    api/verdict-narration            # grounded AI roast (Mistral)
    api/painted-door-read            # AI say-do prediction (Mistral)
    api/crowd-stats · api/crowd-note # segmented gap + AI Editor's Note
    api/live-pulse                   # live behavioral ticker source
    api/painted-door/create          # mint a share token
  components/   SwipeCard, CheckoutModal, Reveal, SubmitModal, MyPicksModal,
                AccountModal, SignupNudge, LeaderboardClient, Receipt, PendoInit,
                ProvenanceTag, LiveTicker, TrustDisclosure, PaintedDoorClient
  lib/          ideas, store, supabase, profile, verdict, ai-context, mistral,
                ai-guards, moments, aggregates, themes, deck-pref, trust,
                painted-door, safe-fetch, config, track, share, session
  global.d.ts   pendo global type
supabase/       migrations/0001_init.sql, migrations/0002_painted_doors.sql
scripts/        seed.ts (npm run db:seed)
```
