# Vaporware

**Everyone says they'd pay. Few actually click.**

A validation arcade for product ideas. Swipe what you'd pay for — then the app
shows you who *actually* pulled out their wallet. The gap between what people
**say** and what they **do** is the whole point.

Built for the [Mind the Product — World Product Day "Everyone Ships Now"](https://mindtheproduct.devpost.com/)
hackathon.

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
- Submit your own idea into the arena
- Accessible: keyboard support + reduced-motion handling

## Tech

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- [Motion](https://motion.dev/) for swipe physics & animation
- Tailwind CSS v4
- Local JSON persistence (data layer isolated in `src/lib/store.ts`, ready to
  swap for a hosted database later)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    page.tsx              # arcade (home)
    leaderboard/          # the scoreboard
    api/ideas/route.ts    # list + create ideas
    api/vote/route.ts     # record a swipe / checkout decision
  components/             # SwipeCard, CheckoutModal, Reveal, SubmitModal, ...
  lib/
    ideas.ts              # seeded ideas (realistic baselines)
    store.ts              # persistence layer (swap target for a DB)
    config.ts             # brand name, copy, thresholds
    track.ts              # analytics shim (Novus hooks plug in here)
```
