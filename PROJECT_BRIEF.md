# Vaporware — Project Brief

*A briefing document for review/consultation. Last updated: June 7, 2026.*

> **One line:** A validation arcade where you swipe the product ideas you'd pay
> for — then we measure who *actually* clicks "pay". The gap between what people
> **say** and what they **do** is the whole point.

---

## 1. The hackathon (context)

- **Event:** Mind the Product — *World Product Day: "Everyone Ships Now"*
- **Host/Sponsor:** Mind the Product (Pendo) + Novus.ai
- **Platform:** Devpost — https://mindtheproduct.devpost.com/
- **Audience/judges:** product managers, designers, engineers (the world's
  largest product community)

### Key dates
| Milestone | Date |
|---|---|
| Submission deadline | **June 20, 2026, 5:00 PM BST** |
| Judging | June 24 – July 1, 2026 |
| Winners announced | ~July 6, 2026 |

> As of this brief there are roughly **two weeks** left.

### Hard requirements (to be eligible)
1. **New project**, started on/after May 20, 2026.
2. Built with any tool (we chose hand-rolled Next.js).
3. **Novus.ai must be installed before submission** — *projects without Novus
   are ineligible for prizes.* (Not done yet — see roadmap.)
4. A **public, deployed URL** a stranger can use right now.
5. A **2–3 minute demo video** (YouTube/Vimeo/Loom, public/unlisted).
6. A **screenshot of the Novus dashboard**.
7. A short written description (what, who for, tools, what we learned).

### Judging criteria (equally weighted, 25% each)
- **Product Thinking** — is the problem worth solving? Clear who it's for?
- **Craft & Execution** — does it work end-to-end? Considered UI/copy?
- **Originality & Ambition** — does it make judges sit up? Distinctly yours?
- **Shippedness** — can a stranger get value right now? Measurable (Novus)?

---

## 2. The concept

**Problem:** Stated intent is cheap and misleading. People happily say "I'd pay
for that" in surveys, interviews, and casual swipes — then never open their
wallet. Product teams burn months building things that validated well in
conversation and died in the market.

**Insight (the hook):** Vaporware makes that gap visible and playable. It
captures two different signals on every idea:
- **say-rate** — % of people who swipe "take my money"
- **do-rate** — % of those who then actually click *pay* at a (fake) checkout

The difference is the **say–do gap**. The product *is* the lesson it teaches.

**Why it fits this hackathon specifically:**
- It's a product *about* validating products, judged by the product community —
  the meta-narrative lands instantly.
- It's directly aligned with the sponsor (Novus measures real user behavior, not
  stated intent). The demo line writes itself: *"Everyone says they'd pay —
  here's who actually clicked. That's why you measure behavior, not opinions."*

---

## 3. Why this idea (the research behind it)

We deliberately steered away from the obvious choice. The first instinct was a
"roast my idea / PRD" tool, but research showed that space is heavily saturated
(roastmyidea.site, idearoast.ai, roastd, roastrocket, roastmystartup, plus
"roast my landing page/UI" tools and even prior hackathon entries). Originality
is 25% of the score, so a roast clone would have been penalised.

The say-do gap angle is grounded in real product practice:
- **Painted-door / fake-door testing** — a standard validation method. Realistic
  click-through is roughly **0.5%–8%** of people who see the door.
- **Intention–behavior gap** — well-documented in marketing/psychology
  literature; people who state an intention frequently fail to act on it.

This gives the playful arcade a serious, credible spine.

---

## 4. How it works (the loop)

1. Land on the URL — no sign-up needed. A full deck of idea cards is ready.
2. Swipe right ("take my money") or left ("nope") — drag or keyboard.
3. On "take my money", a **fake checkout** appears (the "moment of truth"). We
   record whether the person actually clicks *Confirm & pay* or bails.
4. A **reveal** shows that idea's say-rate vs do-rate with a stamped verdict
   ("All Talk", "Real Demand", "Lukewarm").
5. After the deck: a **scoreboard** — *Hall of Delusion* (loved, unpaid) and
   *Sleeper Hits* (quiet love, real follow-through).

---

## 5. Features built so far

- Tinder-style swipe deck with drag physics (Motion) + stacked cards
- Keyboard support (← pass, → pay, Enter to advance) and reduced-motion handling
- Fake "moment of truth" checkout that captures the do-rate
- Per-card say–do gap reveal with animated bars and a rubber-stamp verdict
- Scoreboard: Hall of Delusion + Sleeper Hits
- Submit-your-own-idea flow (persists, joins the deck)
- **Anonymous play** + a personal **"My Picks"** index (would-pay / all-talk /
  passed), saved on-device
- **Account nudge** after 5 picks ("save your progress") — local account for now
- **Share my verdict** (Web Share API + clipboard fallback)
- OpenGraph/Twitter metadata for clean link previews
- 40 seeded ideas with realistic baselines (see §7)
- An editorial / "receipt" visual identity (warm paper, serif display, hard
  offset shadows, stamp motifs) — a deliberate move away from generic
  "AI-generated" UI

---

## 6. Tech & architecture

- **Framework:** Next.js 16 (App Router) + React 19
- **Styling:** Tailwind CSS v4, custom editorial theme
- **Animation:** Motion (framer-motion successor)
- **Persistence:** **Supabase (Postgres)** — `ideas` + `votes` tables, RLS
  enabled, accessed only via a server-only secret key in `src/lib/store.ts`
- **Repo:** `github.com/rofiperlungoding/vaporware` (currently private)

**All data access is isolated:**
- `src/lib/store.ts` — server-side data layer (Supabase; same signatures as the
  old JSON version, swapped without touching any component)
- `src/lib/supabase.ts` — lazy, server-only Supabase client
- `src/lib/profile.ts` — client profile/picks/account (local; swap for real auth)
- `src/lib/track.ts` — analytics shim (Novus events plug in here, one place)

```
src/
  app/            page (arcade), /leaderboard, /api/ideas, /api/vote
  components/     SwipeCard, CheckoutModal, Reveal, SubmitModal,
                  MyPicksModal, AccountModal, SignupNudge, LeaderboardClient
  lib/            ideas (seed), store, profile, config, track, share, session
```

---

## 7. Data honesty (important)

The seeded "crowd" numbers are **demo data**, not real live results. They're
modeled on real painted-door benchmarks and the intention–behavior gap:
- say-rate spread ~33–64% (no fantasy 90%s)
- do-rate: novelty ideas ~6–20%, genuinely painful problems ~45–60%

This is **disclosed in-product** (a note on the scoreboard) so we never claim
seeded numbers are real crowd behavior. Real votes accumulate on top. We believe
this intellectual honesty is itself a point in our favour with product judges.

---

## 8. Current status

- ✅ **Live in production:** https://vapor-wave.netlify.app (Netlify, auto-deploys
  from GitHub on every push)
- ✅ **Supabase (Postgres) live** — schema migrated + 40 ideas seeded; reads and
  writes verified end-to-end on the deployed site (swipe + checkout persist real rows)
- ✅ **Novus.ai (Pendo) installed** — agent loads + initializes an anonymous
  visitor (session id), and behavioral events fire through the single
  `src/lib/track.ts` shim
- ✅ Working end-to-end **locally** (`npm run dev`)
- ✅ Pushed to GitHub (auto-sync on every change-set)
- ⛔ Confirm events landing in the Novus dashboard, then screenshot for submission
- ⛔ No demo video / written submission yet
- ⚠️ Supabase key was shared in plaintext during setup — rotate before going public

---

## 9. Roadmap to submission

| # | Task | Needs | Blocker? |
|---|---|---|---|
| 1 | ~~Install **Novus.ai** snippet~~ | — | ✅ Done |
| 2 | ~~Move persistence to **Supabase**~~ | — | ✅ Done |
| 3 | ~~**Deploy** to a public URL~~ | — | ✅ Done (Netlify) |
| 4 | Verify events in Novus dashboard + screenshot | live deploy | Submission proof |
| 5 | Rotate the Supabase key shared in chat | — | Before public |
| 6 | Record **2–3 min demo video** | — | Required |
| 7 | Write submission description | — | Required |
| 8 | (Optional) build-in-public posts (#EveryoneShipsNow) | — | Bonus |
| 9 | (Optional) designed OG share image | — | Polish |

> All hard eligibility items are met: live public URL, Supabase persistence, and
> Novus installed with measurable say-do events. Remaining work is the demo video
> and written submission.

### Novus event taxonomy (the say-do gap, measurable)
`idea_viewed`, `said_yes`, `said_no`, `checkout_opened`, `paid`,
`checkout_abandoned`, `idea_submitted` — all fired through `src/lib/track.ts`.
**say-rate = said_yes / idea_viewed · do-rate = paid / checkout_opened.**

> Note: Novus also auto-generated two PRs. PR #1 (the Pendo loader + visitor
> init) was merged. PR #2 (duplicate track events on the old naming, missing
> `idea_viewed`/`checkout_opened`) was closed to avoid double-counting.

---

## 10. Self-assessment vs judging criteria

- **Product Thinking (25%)** — *Strong.* Sharp, specific problem; clear audience
  (anyone who's been burned by "users said they wanted it").
- **Craft & Execution (25%)** — *Good and improving.* Distinct visual identity,
  considered copy, works end-to-end, **live in production**. Risk: final polish.
- **Originality & Ambition (25%)** — *Strong.* The say-do gap twist is
  differentiated from the saturated "roast/validate" tools.
- **Shippedness (25%)** — *Strong.* Deployed and public on Netlify, backed by
  Supabase, with Novus installed and the say-do gap measurable via real
  behavioral events. All hard eligibility items met.

---

## 11. Open questions for the consultant

1. **Differentiation:** Is the "say-do gap" framing distinct enough from
   existing idea-validation tools, or does it read as "another idea validator"?
2. **The fake checkout:** It's a painted-door pattern (intentional light
   deception, immediately disclosed as "no card charged"). Is that an ethical or
   trust risk we should reframe — or is the honesty note enough?
3. **Post-hackathon viability:** Could this be a real micro-product? If so, what
   would the wedge be — a consumer toy, or a B2B tool teams embed to test their
   own ideas? Where's the willingness to pay (ironic, given the theme)?
4. **Cold start for real users:** Seeded data solves the demo, but a live product
   needs a steady flow of fresh ideas + voters. What's the lightest acquisition
   loop?
5. **Data/privacy:** When the backend lands we'll store emails (account) and
   behavioral votes. What's the minimum we should do for consent/GDPR now so we
   don't paint ourselves into a corner?
6. **Repo visibility:** Go public now for the build-in-public bonus, or stay
   private until after judging?
7. **Scope tradeoff with ~2 weeks left:** Where should the remaining effort go —
   deploy + Novus + polish (safe), or one more standout feature (risk)?

---

## 12. Links

- **Live site:** https://vapor-wave.netlify.app
- Hackathon: https://mindtheproduct.devpost.com/
- Novus / Pendo: https://novus.ai · https://www.pendo.io/pendo-blog/introducing-novus/
- Repo: https://github.com/rofiperlungoding/vaporware
- Background reading: painted-door testing, the intention–behavior gap
