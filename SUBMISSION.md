# Vaporware — Submission Kit

*Deliverable scaffolding for the Mind the Product "World Product Day: Everyone Ships Now" hackathon. Text only — no product surfaces.*

- **Live:** https://vapor-wave.netlify.app
- **Repo:** https://github.com/rofiperlungoding/vaporware
- **Demo mode (private, not linked in UI):** https://vapor-wave.netlify.app/?demo=1

---

## 1. Demo video — shot list + VO script (~2:30)

> Tip: open `?demo=1` before recording. It resets your local session, stages 4 bailed + 1 paid picks, and selects the AI Startups deck so the Receipt reliably lands on **Pure Vapor**. It never touches crowd data.

| # | Time | On screen | Voiceover |
|---|---|---|---|
| 1 | 0:00–0:12 | Landing page, warm-paper deck, "AI Startups 2026" deck selected | "Everyone says they'd pay for your idea. This is a tiny arcade that measures who actually clicks pay." |
| 2 | 0:12–0:30 | Swipe right on a sharp idea → fake checkout opens | "Swipe right means take my money. So we call the bluff — here's the checkout." |
| 3 | 0:30–0:45 | Click **Confirm & pay** → reveal: say-rate vs do-rate bars + stamp | "Pay, and you see this idea's say-rate against its do-rate. The gap is the whole story." |
| 4 | 0:45–1:05 | Next card, swipe right, then click **never mind** → "Caught you" stamp | "Swipe right again… then bail. That's the say-do gap, live, on me. No judgment — that gap is the product." |
| 5 | 1:05–1:25 | Finish the deck → **The Receipt** animates in, verdict stamp "Pure Vapor" | "At the end you get a receipt of your own behavior. I said I'd pay for five. I paid for one. Verdict: Pure Vapor." |
| 6 | 1:25–1:45 | AI roast text appears under the verdict (🤖 label) | "An AI reads only my real session and names the exact ideas I talked big on and bailed. Grounded — it never invents a number." |
| 7 | 1:45–2:05 | Scoreboard: live ticker + say-do by category | "Real votes accumulate live. Here's demand by category — said versus did, not opinions." |
| 8 | 2:05–2:20 | Provenance tags (demo data / live / 🤖 AI read) in frame | "Every number is labeled: seeded demo, live, or AI read. We never pass seeded data off as a real crowd." |
| 9 | 2:20–2:30 | Back to one-liner / logo | "Everyone says they'd pay. Few actually click. Measure behavior, not opinions." |

---

## 2. Submission description (first draft, English)

**What it is.** Vaporware is a validation arcade about the *say-do gap*. You swipe the product ideas you'd pay for; when you swipe "take my money," a painted-door checkout appears and we measure whether you actually click pay. say-rate is who said yes, do-rate is who followed through, and the difference is the lesson the product teaches about itself.

**Who it's for.** Product people who've been burned by "users said they wanted it" — PMs, founders, and designers who know stated intent is cheap and want a sharp, playable reminder to measure behavior instead.

**How it works.** A Tinder-style deck (drag + full keyboard) feeds a fake checkout that captures the do-rate. Each card reveals its say-vs-do gap with a stamped verdict, and the end-of-deck **Receipt** scores *your* personal gap with a verdict tier. A grounded AI (Mistral), fed only your real session, names the specific ideas you talked big on and then bailed — it never fabricates numbers, and it degrades to static copy if AI is off.

**Tools.** Next.js 16 (App Router) + React 19, Tailwind v4, Motion, Supabase (Postgres) for persistence, Mistral for the grounded AI read, Netlify for hosting, and **Novus.ai** for behavioral analytics — every say-do event (idea_viewed → said_yes → checkout_opened → paid / abandoned) flows through a single tracking shim.

**What we learned.** The painted-door pattern is uncomfortable in the best way: building the "caught you" moment forced us to be honest about deception, so every numeric surface carries a provenance tag (demo data / live / 🤖 AI read) and the checkout says "no card charged" up front. The hardest design call wasn't the swipe physics — it was earning trust while running a bluff.

### Why this isn't AI slop

We deliberately skipped the saturated "roast my idea" lane and built around a real, documented behavior (the intention–behavior gap, and painted-door click-through of roughly 0.5–8%). The AI is grounded: it only ever sees your own real session and is structurally barred from inventing numbers, with a deterministic static fallback. The interface is a hand-built editorial/receipt identity — warm paper, a serif display face, hard offset shadows, rubber-stamp motifs — chosen specifically to look like a considered object rather than a generic generated dashboard. The honesty layer (labeled provenance, "no card charged," clear-my-data) is the opposite of slop: it's the part most demos hide, and we made it the point.

---

## 3. Pre-submission ops checklist (outside code)

- [ ] Rotate the Supabase service-role key and Mistral key shared in chat (site is public; exposure window is open).
- [ ] Run the event checklist once on the live site and screenshot the Novus dashboard.
- [ ] Record the 2:30 demo using `?demo=1`.
- [ ] Verify the live URL in an incognito window (a stranger's true first run).
