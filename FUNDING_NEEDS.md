# Article One — Funding & Cost Tracker

A running list of what the Article One project costs (or will cost) to run. The
purpose of this file is to support a funding ask: it lets us pull a clear list
of paid dependencies and rough costs to show potential backers what needs
covering.

**Maintained by Claude across work sessions.** Whenever we add a feature that
needs a paid data source, API, or service, it gets logged here.

_Last updated: 2026-06-23_

---

## Summary (the ask)

| # | Item | What it pays for | Status | Rough cost |
|---|------|------------------|--------|-----------|
| 1 | **X (Twitter) API** | Members' post text + follower/tweet metrics for the Social Media section (word clouds, member directory) | **Will be needed** — account exists (`RiotWitch28`), pay-per-use, **$0 balance** | Pay-per-use credits; per-request rate shown in dev console. Higher fixed tiers exist (Basic historically ~$200/mo). **Confirm current rate before committing.** |
| 2 | Bright Data (alternative to #1) | Bulk collection of social post text without the X API | Optional alternative; **not set up** (no account/key/CLI installed) | Billed per record collected. Only relevant if we choose it over the X API. |
| 3 | LegiScan API | Bill pipeline + committee data (Report Card, Committees, House Overview) | **In use now** | Currently on the **free** bulk-dataset tier (CC BY 4.0). Paid tiers exist if usage grows. |
| 4 | DomeWatch API | Live "in session" status + floor calendar / voting-day stats | **In use now** | Cost not yet confirmed (a key is configured). **To verify.** |
| 5 | Hosting (GitHub Pages) | Serving the live dashboard | **In use now** | Free on current setup. |

---

## Detail & notes

### 1. X (Twitter) API — the main near-term cost
- **Why:** The Social Media section needs the *text* of members' recent posts to
  build the party-split word clouds, and (separately) follower/tweet counts for a
  member directory. The X API is the official source for both.
- **Current state:** Developer account `RiotWitch28` exists on the new
  "pay-per-use" credit model with a **$0.00 balance** and $0 free credits, so no
  data can be pulled until credits are loaded and a Bearer token is generated.
- **Free workaround we found and why it failed:** A free public archive of
  congressional tweets (`alexlitel/congresstweets`) exists but **stopped updating
  in July 2023** (when X ended free API access). It's ~3 years stale, so it can't
  show what Congress is talking about *now*. We can still use it as **free test
  data** to build and demo the word-cloud feature before paying for fresh data.
- **Cost lever:** We don't need all 442 members — a representative sample per
  party would sharply reduce whatever we pay for fresh pulls.
- **Action before paying:** Confirm the current per-request / credit price in the
  X developer console's "Buy Credits" screen and add the real number here.

### 2. Bright Data — only if chosen instead of #1
- A commercial service that pays X for access and returns post text in bulk from
  profile URLs (which we already have in the master list).
- Not currently installed or authenticated. Would be a *substitute* for the X
  API, not an addition. Billed per record.

### 3. LegiScan — currently free
- Source for the bill pipeline numbers and committee activity ratings.
- On the free bulk-dataset tier today. Logged here in case volume ever pushes us
  to a paid tier.

### 4. DomeWatch — verify cost
- Powers the live session indicator and floor-calendar voting-day stats.
- A key is configured; whether it's a paid service is **not yet confirmed.**

### 5. Hosting — currently free
- The dashboard is served via GitHub Pages at no cost on the current setup.

---

## How to read this for a funding conversation
- **Item #1 (X API) is the only thing actively blocking a feature right now.** It
  is the clearest, smallest concrete ask — a modest amount of API credit to turn
  on fresh social-media data.
- Items #3–#5 are currently free but are listed so backers see the *full*
  dependency picture and understand what could become a cost at scale.
