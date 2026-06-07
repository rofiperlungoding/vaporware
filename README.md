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
- Submit your own idea into the arena
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

## Analytics (the say-do gap, measurable)

Events fire through the single `src/lib/track.ts` adapter:
`idea_viewed`, `said_yes`, `said_no`, `checkout_opened`, `paid`,
`checkout_abandoned`, `idea_submitted`.

- **say-rate** = `said_yes / idea_viewed`
- **do-rate** = `paid / checkout_opened`

Set `NEXT_PUBLIC_NOVUS_PROJECT_ID` (public client key) to enable the agent; if
unset, tracking no-ops safely.

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
- `votes` — `idea_id` (fk), `said_yes`, `did_pay` (null if bailed/never reached),
  `session_id`, `created_at`
- say-rate / do-rate are computed by combining each idea's baseline with live
  vote rows. Both tables have RLS enabled; only the server's secret key (which
  bypasses RLS) accesses them.

## Project structure

```
src/
  app/
    page.tsx              # arcade (home)
    leaderboard/          # the scoreboard
    api/ideas/route.ts    # list + create ideas
    api/vote/route.ts     # record a swipe / checkout decision
  components/             # SwipeCard, CheckoutModal, Reveal, SubmitModal,
                          # MyPicksModal, AccountModal, SignupNudge, Leaderboard,
                          # PendoInit (Novus visitor init)
  lib/
    ideas.ts              # seeded ideas (realistic baselines)
    store.ts              # persistence layer (Supabase)
    supabase.ts           # server-only Supabase client (lazy)
    profile.ts            # client picks + local account
    config.ts             # brand name, copy, thresholds
    track.ts              # analytics adapter (single Novus integration point)
    share.ts              # share helper (Web Share + clipboard)
    session.ts            # anonymous session id
  global.d.ts             # pendo global type
supabase/
  migrations/0001_init.sql
scripts/
  seed.ts                 # idempotent seed (npm run db:seed)
```
