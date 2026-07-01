# Roadmap — Geotab MCP Simulator → "Try it for real" site

This is the working plan. It's written so workstreams can be **picked up
independently, deferred, or parallelized across agents**. Each workstream lists
its goal, files, dependencies, whether it can run in parallel, what live-MCP
grounding it needs, and acceptance criteria.

Status legend: ✅ done · 🟡 in progress · ⬜ not started · 🔬 needs grounding

---

## Vision

Two front doors, one connector:

1. **Try the experience now** — the zero-setup simulator (built). It should feel
   like a Geotab chatbot simulator without borrowing any one AI provider's brand.
2. **Try it for real** — get a free Geotab demo database, connect the Geotab MCP
   connector to your own AI client, with clear PII guidance.

Skills are the connective tissue: they **ground the language between Geotab and
what an AI assumes without context** (data quirks, terminology, no-PII rules), so
answers are correct and repeatable. Ace is a headline capability to show off.

---

## Current state (built, v1)

- ✅ Simulator engine + UI (`index.html`, `styles.css`, `app.js`)
- ✅ Conversation graph with 13 nodes / 6 episodes (`data/conversations.js`)
- ✅ In-app Story Map + Mermaid map (`docs/CONVERSATION-MAP.md`)
- ✅ README, disclaimer, `.gitignore` hygiene (`.scripts/` stays private)
- ✅ Verified live in-browser; grounded on demo_fh_vegas4 / demo_fh4 (18–19 Jun 2026)

## UI / brand guidance

- Keep the simulator provider-neutral: Claude can be recommended as the clearest
  starting MCP client, with Microsoft Copilot, ChatGPT, and other clients still
  visible as interoperable options. The app itself should not claim to be any AI provider.
- Avoid brand-confusion language, role names, iconography, palettes, type scales,
  and empty states that make the UI look like, sound like, or claim to be a
  specific chatbot brand.

---

## Stack decision (recommended)

**Keep vanilla static.** Move to **Astro** only if content outgrows it (trigger:
> ~8 content pages, or contributors wanting components/MDX). Do **not** adopt a
React SPA — build + router + Pages 404 hack with little upside for content pages.

Multi-page approach for vanilla (WS0): separate, indexable HTML files sharing a
small injected header/footer partial. Keeps zero-build + good SEO.

> **OPEN DECISION 1 — confirm stack:** vanilla (recommended) / Astro / React.

---

## ⚠️ Priority correctness item — speeding narrative

Live Ace result (`demo_fh_vegas4`, last 7 days, top vehicles by speeding events):
`Demo-01: 100 · Demo-15: 99 · Demo-16: 99 · Demo-08: 99 · Demo-04: 99`.

Speeding is **evenly spread across the fleet** (~99–100 each), *not* one outlier.
The earlier "Demo-01 is the clear outlier" came from a 200-row pagination cap.
Episodes 1 & 2 currently tell the wrong story.

This is a great Ace showcase (raw query misleads → Ace corrects), but the canned
content must be reconciled. See **WS6**.

> **OPEN DECISION 2 — narrative:** (a) re-ground Ep1/Ep2 to "fleet-wide speeding,
> no single outlier" (truthful), or (b) keep an "outlier" story but switch the
> grounding database/metric to one where it's actually true, or (c) lean into the
> "raw vs Ace" contrast as the teaching moment. Recommended: (a)+(c).

---

## Workstreams

### WS0 — Site shell & multi-page nav  ⬜  (gates WS1–WS5)
- **Goal:** turn the single page into a small multi-page site with shared chrome.
- **Approach:** add a `partials.js` (or build-free include) that injects a shared
  top nav (Home · Simulator · Try for real · Skills · Clients) + footer disclaimer
  into each page. Move the simulator to `simulator.html`; `index.html` becomes the
  landing page (WS1).
- **Files:** `partials.js`, `nav.css` (or extend `styles.css`), restructure pages.
- **Depends on:** stack decision (WS0 differs a lot under Astro).
- **Parallel:** blocks the content pages; do first.
- **Acceptance:** every page shares one header/footer; nav highlights current page;
  simulator still works; all links resolve.

### WS1 — Landing page  🟡 (shipped as an overlay, not a dedicated page)
- **Goal:** explain the connector in 1 screen; two CTAs ("Try the simulator" /
  "Try it for real"); a strip of the six use cases; Claude-as-starting-point message
  with visible alternatives.
- **Shipped (19 Jun):** a `#landingOverlay` modal in `index.html`, shown on load,
  framed for the target persona (a fleet manager who already knows Geotab and
  may have used ChatGPT): 3 value-prop bullets (plain-English questions,
  Claude as a clear starting point plus Copilot/ChatGPT/etc. as alternatives on the same open MCP
  server, try-risk-free), two CTAs (`▶ Try the simulator` / `🔌 Ready to connect
  your real account?`). Verified via Playwright on desktop + mobile (390×844):
  loads with no JS errors, both CTAs route correctly, panel scrolls on short
  viewports so the CTAs stay reachable.
- **Not done:** the "strip of six use cases" and the full standalone page (still
  gated behind WS0's multi-page restructuring) — this is the single-page,
  zero-build version of the same content.
- **Files:** `index.html`, `styles.css` (`.landing-panel`, `.hero-*`, `.cta-*`), `app.js`.
- **Depends on:** WS0 for the *page* version.  **Parallel:** done without it for now.
- **Acceptance:** loads with no JS errors; both CTAs route correctly; mobile OK. ✅

### WS2 — "Try it for real" guide (+ PII warning)  🟡 (shipped as an overlay, not a dedicated page)
- **Goal:** step-by-step to (1) get a free Geotab demo database, (2) connect the
  Geotab MCP connector to an AI client, (3) understand PII obligations.
- **Shipped (19 Jun):** a `#tryRealOverlay` modal, reachable from the landing CTA
  and anytime from a header button (`🔌 Connect real account`):
  - Step 1 — Get access to a MyGeotab database. *(Deliberately did **not** invent
    a signup URL — points to "your Geotab account rep or fleet admin" instead,
    per this doc's own caution above. Still TODO if/when a verified public
    signup link exists.)*
  - Step 2 — Connect the connector to your assistant of choice — recommends Claude
    as the clearest starting point while naming Microsoft Copilot and ChatGPT as MCP clients
    (the "Copilot is a choice too" point folded in here, not deferred to WS5).
  - Step 3 — **PII warning**, styled as a prominent dashed amber box
    (`.pii-box`, mirrors the `media-disclosure` convention): DPA/GDPR review,
    vehicle/asset-level mitigation, demo DBs are anonymised, "not legal advice"
    line. Verified via Playwright screenshot — visually distinct, not buried.
- **Files:** `index.html`, `styles.css` (`.steps-list`, `.pii-box`), `app.js`.
- **Depends on:** WS0 for the *page* version; URL-verification still open.
- **Acceptance:** 3 clear steps; PII box visually prominent; links either
  verified or clearly marked "confirm before launch". ✅ (as an overlay)

### WS3 — Skills (page + publishable skill artifacts)  🟡 (WS3b artifact ✅; WS3a page ⬜)
- **Goal:** explain *why* skills matter (grounding Geotab↔AI language) and ship a
  real, readable example skill people can install.
- **Two parts:**
  1. **Explainer page** `skills.html`: without grounding, an AI guesses — and gets
     it wrong (e.g. the raw all-time Trip counter; HOS is per-driver; "clean week"
     is a finding; **the speeding "outlier" mirage from WS6**). A skill codifies
     these rules + a no-PII default so answers are correct and repeatable across a
     team. Show anatomy of a skill + install steps.
  2. **Artifact(s)** `skills/geotab-weekly-review/SKILL.md`: a clean, public,
     readable version of the weekly-review skill (the `.scripts/` copy is a binary
     zip and stays private). Encodes: six-section review, per-driver HOS,
     summarize-don't-dump trips, no-PII, written brief default.
- **Files:** `skills.html`, `skills/geotab-weekly-review/SKILL.md` (+ more later:
  a no-PII guardrail skill, an Ace-question skill).
- **Depends on:** WS0 (page); artifact authoring is independent.
- **Parallel:** **yes — artifact authoring can start immediately, no WS0 needed.**
- **Acceptance:** SKILL.md is self-contained + reflects verified data quirks; page
  explains the value with a concrete before/after.

### WS4 — Ace API demo  ✅ (episode shipped; grounding ✅)
- **Goal:** show off Geotab Ace (natural language → SQL/insight + chart + reasoning).
- **Grounded:** `GetAceResults` works on demo_fh_vegas4. Example captured:
  top-5 speeding → `Demo-01:100, 15:99, 16:99, 08:99, 04:99`, returns a bar-chart
  reference + a reasoning trace (Outcome / Understanding / Process).
- **Build:** new simulator episode `ep7-ace` (hub choice "🤖 Ask Ace a question"):
  tool card `geotab · GetAceResults`, then an answer that includes the ranked list,
  a note that Ace returns a **chart + reasoning**, and the teaching beat: *this is
  the accurate fleet-wide picture* (ties into WS6). Optionally a short Ace
  explainer block on the landing/simulator.
- **Files:** add node(s) to `data/conversations.js`; optional `ace` mention on pages.
- **Depends on:** nothing (simulator already supports tool+assistant events). A chart
  visual is a nice-to-have (render a tiny inline bar chart in a new event type).
- **Parallel:** **yes — fully independent of WS0–WS3.**
- **Acceptance:** Ace episode plays; numbers match the live capture; story is
  consistent with WS6.
- **Note:** Ace may need extra permissions on some databases — page should say
  "if Ace isn't enabled on your DB, ask your admin."

### WS5 — MCP clients page (+ GitHub issue template)  🟡 (WS5b done; WS5a page ⬜)
- **Goal:** recommend Claude as the clearest starting point while showing **Microsoft Copilot,
  ChatGPT, Block Goose, Cursor, Windsurf, or any MCP client** as alternatives. Instructions "coming soon"; let
  people **request a client via GitHub issue.**
- **Content:** a grid of clients (status: "guide coming soon" / "supported"), one
  generic "how MCP connection works" blurb, and a CTA button → prefilled GitHub
  issue ("Request setup instructions for <client>").
- **Files:** `clients.html`, `.github/ISSUE_TEMPLATE/client-request.md`.
- **Also:** update end-card copy in `data/conversations.js` to add **Goose** to the
  "same connector also works in…" line.
- **Depends on:** WS0 (page); end-card tweak + issue template are independent.
- **Parallel:** **yes.** Acceptance: page lists clients with honest status; issue
  CTA opens a prefilled GitHub issue; end cards mention Goose.

### WS6 — Reconcile speeding narrative (accuracy)  ✅ (done; grounding ✅)
- **Goal:** make Ep1/Ep2 truthful per Ace. Replace "Demo-01 is the clear outlier /
  it's basically one van" with the real finding: **fleet-wide speeding, top
  vehicles within ~1 event of each other (~99–100 in 7 days).** Use it to set up
  the Ace episode (WS4) and the skills argument (WS3).
- **Files:** `data/conversations.js` (ep1-answer, ep2-answer, ep2-action labels).
- **Depends on:** OPEN DECISION 2.  **Parallel:** yes (small, isolated edit).
- **Acceptance:** no claim in the simulator contradicts the live Ace aggregate.

### WS8 — "Create a dashboard" capability  ⬜ (grounding ✅)
- **Goal:** feature an **assistant artifact/canvas** capability — the assistant builds an interactive
  dashboard from data it pulled via the connector. *(This is a client-side assistant
  feature, not a Geotab MCP feature — say so.)*
- **Build:** new simulator episode `ep8-dashboard` (hub: "📊 Build a fleet
  dashboard"): Geotab read tool cards → a rendered **dashboard artifact** inline
  (stat tiles + the existing bar `chart` event). Add a `dashboard` event type
  (tiles) — reuses the chart renderer from WS4.
- **Files:** `data/conversations.js` (+ small `dashboard` renderer in `app.js`/CSS).
- **Depends on:** nothing. **Parallel:** yes. **Effort:** low (chart already exists).
- **Acceptance:** dashboard artifact renders; copy makes clear it's assistant-built,
  grounded in connector data; no live embeds.

### WS9 — "Create a map" capability  ⬜ (grounding ✅: positions captured)
- **Goal:** feature an assistant rendering a **map artifact** from live device positions
  (e.g. "map my fleet" / "show Valencia exposure"). Per brand guidance: a
  **prepared/stylized** map (SVG points over a simple backdrop), **no live tiles**.
- **Build:** new episode `ep9-map`: `Get DeviceStatusInfo` (have real lat/long for
  demo_fh4 — Galicia cluster ~42°N + Valencia Demo-23/Demo-31 ~39.4°N) → a `map`
  event that projects lat/long to x/y and plots dots, highlighting the Valencia ZBE
  ones. Ties nicely to Ep3.
- **Files:** `data/conversations.js` (+ `map` SVG renderer in `app.js`/CSS).
- **Depends on:** nothing. **Parallel:** yes. **Effort:** medium (SVG projection).
- **Acceptance:** map artifact plots the real positions; Valencia vehicles stand
  out; labeled "illustrative — assistant-rendered, not a live map".

### WS7 — Polish (later)  ⬜
- Responsive/a11y pass across new pages; meta/OG tags for sharing; optional
  privacy-respecting analytics; favicon/og image; "copy link to this episode".
- **Parallel:** last. Acceptance: Lighthouse pass; shares render a card.

### WS10 — Code review follow-ups (engine hardening)  ✅
- **Goal:** track every finding from the 19 Jun code review of `app.js` as a
  discrete to-do (none blocking; this repo had no open PR to review, so the
  review covered the current `app.js`/`data/conversations.js` on `main`).
- **To-dos:**
  - [x] **Security — href attribute-breakout.** `escapeHtml()` now also
    escapes `"` → `&quot;` and `'` → `&#39;` (it runs over the full raw
    markdown before `inline()`'s link regex ever sees it, so the breakout is
    closed at the source). Added a second line of defense, `safeHref(url)`,
    which restricts `[text](url)` hrefs to `http(s)://` and falls back to `#`
    otherwise — closes the `javascript:`/`data:` URI vector that quote-escaping
    alone doesn't touch. Verified via Playwright: existing apostrophes in
    prose (`isn't`, `it's`) still render as literal glyphs, no double-escaping
    artifacts.
  - [x] **CI — silent broken links.** Added `scripts/check-graph.js`: loads
    `data/conversations.js` headlessly (`global.window = {}` + `require`),
    checks every `next`/`choices[].next` resolves *and* every node is
    reachable via BFS from `start`, exits non-zero on any problem. Verified it
    fails (exit 1, 18 problems) against a deliberately-broken copy and passes
    (exit 0) against the real graph (19 nodes).
  - [x] **Test coverage.** Folded into `scripts/check-graph.js` above — the
    reachability check wasn't part of `app.js`'s `checkGraph()` at all, so
    this is strictly more coverage than existed before, with no new test
    framework (keeps the zero-dependency philosophy).
  - [x] **Cleanup — duplicate bubble renderers.** user/assistant prose renderers
    collapsed into one `addBubble(role, text)`; both call
    sites (`playNode()`'s assistant branch, `onChoice()`) updated. Verified
    via Playwright: assistant and user rows both render with correct
    classes/avatars.
  - [x] **Cleanup — overcomplicated `wait()`.** Simplified to a single
    `setInterval` poll loop (dropped the redundant `setTimeout`). Verified
    click-to-skip still fast-forwards mid-wait (tray choices appeared in
    ~240ms vs. the un-skipped multi-second duration).
- **Files:** `app.js`; `scripts/check-graph.js` (new).
- **Depends on:** nothing. **Parallel:** yes, each to-do is isolated.
- **Acceptance:** quote-breakout fixed; CI fails on a broken graph link; no
  behavior change to playback. All four verified live via Playwright against
  a local static server, not just `node --check`.

---

## WS11 — New episode backlog (personas × real tools)  🟢 (6 shipped, grounded live)

> **Grounding pass done 19 Jun 2026** against the live MCP. Verdicts below are
> from real calls, not guesses. **Shipped & grounded:** Maintenance triage (Ep8),
> Fleet composition (Ep9), Posted-speed check (Ep10), Dispatch, Exec snapshot,
> and Dashcam (illustrative) — all now live in `data/conversations.js`.
> **Dead end (as a live-data episode):** Emissions
> (`GetEmissionComplianceDeadline` → "Device not registered for emission
> reporting" — no enrolled devices). Captured facts:
> - `FaultData` 7d: **demo_fh4 = 599**, **demo_fh_vegas4 = 0**.
> - Ace fault breakdown (demo_fh4): **Demo-08 = 112**, then Demo-22/26/21 = 7, Demo-27 = 4 → one clear outlier.
> - `DecodeVins` (demo_fh4): 10 distinct VINs → 25 MAN Lion's Intercity coaches,
>   10 Mercedes Actros trucks, 5 Renault T tractors (Euro 6), 5 Mercedes Intouro
>   coaches, 5 Mercedes Sprinter vans (Demo-06…10, incl. fault hot-spot Demo-08).
> - `GetPostedRoadSpeedsForDevice` (Demo-01, 18 Jun): per-segment limits 10–65 mph
>   (clean mph values; `-1` = no posted limit on file; some `isEstimate`).
> - demo_fh_vegas4 VINs are all the placeholder `1N4AL3AP0HN000000` → composition
>   story must use demo_fh4.
> - `DeviceStatusInfo` live positions (19 Jun ~04:10 UTC): Vegas 21/50 driving
>   (42%), Spain 10/50 (20%); closest *available* (`isDriving:false`) vehicle to
>   a downtown-Vegas job is **Demo - 45**, ~1.0 mi away.
> - `ExceptionEvent` 7d: **demo_fh_vegas4 = 4,933**, **demo_fh4 = 1,347**.
> - `SearchMedia` (demo_fh_vegas4, Demo-01, full day): real call, empty result —
>   no camera media enrolled on the demo DB. Confirmed dead end for *live*
>   footage; revived as an **illustrative** episode instead (see Ep-Dashcam below).



**Goal:** broaden the simulator beyond the fleet-manager lens. The original six
episodes were mostly "the manager's Monday." Real fleets have **distinct roles
with distinct needs** (the vibe-guide's four pillars — *productivity, safety,
compliance, sustainability* — plus dispatch/maintenance), and the live MCP
exposes **several real tools the simulator didn't use.** Each story below names
the persona, the question, the candidate **real** MCP tools, and the teaching
beat. Items marked SHIPPED were grounded against the live MCP and built into
`data/conversations.js`; the rest stay 🔬 until a live capture confirms them.
**Never fabricate tool results** (same bar as the existing episodes).

> Source inspiration: `github.com/fhoffa/geotab-vibe-guide` (pillars, agentic
> monitoring, safety coaching, maintenance tickets) mapped onto unused tools in
> the live Geotab MCP: `SearchMedia`, `GetMediaUrl`, `DownloadMediaFile`,
> `GetEmissionComplianceDeadline`, `EmissionEnrollDevices`,
> `GetPostedRoadSpeedsForDevice`, `SendReportProcessingRequest`, `DecodeVins`,
> `GetDevicesInformation`, plus `Set`/`Remove` (only `Add` is used so far).

### Backlog (each = one new hub choice + answer node, optional action node)

- [x] **Ep8 · Maintenance — "Triage the whole shop's worklist" (Maintenance manager)** ✅ SHIPPED
  - *Ask:* "Across the fleet, which vehicles have active faults — give me a
    prioritized worklist for the shop."
  - *Tools:* `GetCountOf`(FaultData) + `GetAceResults` on `demo_fh4`.
  - *Grounded:* **599 faults / 7d**; Ace breakdown → **Demo-08 = 112** (one clear
    outlier, ~1 in 5), then 7/7/7/4. Vegas = **0** for contrast.
  - *Teaching beat (live):* 599 looks like chaos but it's basically one vehicle —
    the *opposite* shape from the fleet-wide speeding story; aggregation tells you
    which shape you're in. Cross-links to Ep9 ("what is Demo-08?").

- [x] **Ep9 · Fleet composition — "What's actually in my fleet?" (Sustainability / planning)** ✅ SHIPPED
  - *Ask:* "Decode my fleet from the VINs — what am I running, and which are
    realistic EV-conversion candidates?"
  - *Tools:* `Get`(Device, VINs) + `DecodeVins` on `demo_fh4`.
  - *Grounded:* 25 MAN Lion's Intercity coaches, 10 Mercedes Actros trucks, 5
    Renault T tractors (Euro 6), 5 Mercedes Intouro coaches, 5 Mercedes Sprinter
    vans. EV candidates = the 5 Sprinter vans.
  - *Teaching beat (live):* it's a **passenger-transport operation**, not parcel
    vans — the real VINs change the plan. Gives `DecodeVins` the narrative the
    dropped VIN episode lacked.

- [x] **Ep10 · Posted-speed — "Was the limit really what we think?" (Supervisor / dispute)** ✅ SHIPPED
  - *Ask:* "Demo-01 disputes a speeding flag — pull the posted road speed along
    its actual route."
  - *Tools:* `GetPostedRoadSpeedsForDevice` on `demo_fh_vegas4`.
  - *Grounded:* per-segment limits **10–65 mph** for Demo-01 on 18 Jun; `-1` = no
    posted limit on file; some `isEstimate`.
  - *Teaching beat (live):* coach on the road, not a hunch; closes the loop on the
    fleet-wide speeding finding. Cross-links to the Ep2 speed-alert action.

- [x] **Ep-Dispatch — "Who's closest and free right now?" (Dispatcher / operations)** ✅ SHIPPED
  - *Ask:* "A job just came in near downtown — which vehicle is closest and
    available right now?"
  - *Tools:* `Get`(DeviceStatusInfo) for live positions — real Vegas lat/long +
    `isDriving` + speed (note: `GetDevicesInformation` is Go-Focus *camera*
    health only, NOT general positions — use DeviceStatusInfo).
  - *Grounded:* live snapshot, 19 Jun ~04:10 UTC — **Demo - 45** closest *and*
    available (parked) at ~1.0 mi from a downtown-Vegas job; **Demo - 01** is
    nearer-ish but driving 59 mph, so it's excluded as busy.
  - *Teaching beat (live):* real-time operational decisioning (productivity
    pillar); `isDriving:false` ≈ "available," and closest-by-distance alone
    would have picked the wrong vehicle. Natural home for a future WS9 map artifact.

- [x] **Ep-Exec — "Board snapshot across both regions" (Executive / fleet director)** ✅ SHIPPED
  - *Ask:* "Give me a board-level snapshot across both fleets — safety,
    compliance, sustainability, utilization — in five numbers."
  - *Tools:* `Get`(DeviceStatusInfo) + `GetCountOf`(ExceptionEvent) across
    **both** `demo_fh_vegas4` *and* `demo_fh4`, plus prior Ep8/Ep9 facts.
  - *Grounded:* utilization 21/50 (Vegas) vs 10/50 (Spain) driving right now;
    exceptions 7d 4,933 (Vegas) vs 1,347 (Spain); faults 7d 0 (Vegas) vs 599
    (Spain); Spain's VINs decode into a real fleet (EV candidates exist), Vegas's
    don't (placeholder VINs — its own action item).
  - *Teaching beat (live):* the four pillars in one ask, **spanning two
    databases** — and the two fleets fail in *opposite* ways (behavioral vs
    mechanical risk), so one board slide doesn't fit both.

- [x] **Ep-Dashcam — "Pull the clip" (Safety / risk officer)** ✅ SHIPPED (illustrative)
  - *Ask:* "Pull the dashcam clip for that speeding/braking moment."
  - *Tools:* `SearchMedia` — **real call, confirmed empty** on demo_fh_vegas4 (no
    camera media enrolled); the episode shows that honest empty result, then
    plays a clearly-disclosed **illustrative** clip (not a real MCP capture) —
    see `media/README.md` for the generation prompt and `app.js`'s
    `media-disclosure` banner for the in-app label.
  - *Teaching beat:* the tool is real even when the demo data isn't — and the
    simulator says so instead of faking a result. Cross-links from Ep10
    (posted-speed dispute) since it's the same vehicle, Demo - 01.
- [ ] ~~**Ep-Emissions** (Compliance)~~ ❌ NOT VIABLE as-is —
  `GetEmissionComplianceDeadline` returns "Device not registered for emission
  reporting"; no enrolled devices on the demo DBs. Would require enrolling first
  (and `EmissionEnrollDevices` mutates the fleet).
- [ ] **Ep-Report** (Operations / finance admin) 🔬 — `SendReportProcessingRequest`
  not yet probed; viability unknown. Lower priority.

- **Files:** `data/conversations.js` (one node per answer, optional action node +
  hub choice); new `media` event type (`app.js`/`styles.css`) for the illustrative
  Dashcam clip; `media/README.md` holds the generation prompt.
- **Depends on:** nothing structurally; **each is gated on a live MCP capture**
  (that's the 🔬) — except Dashcam, which is gated on a *generated* clip (see
  `media/README.md`); the episode works either way (styled fallback if the file
  isn't there yet).
- **Parallel:** yes — each episode is an isolated graph addition.
- **Acceptance (per episode):** numbers match a live capture; tool names/args are
  real; no claim contradicts the live aggregate; persona + teaching beat are clear.
  For Dashcam specifically: the tool call shown is real and honestly empty: only
  the clip itself is illustrative, and it's labeled as such in-app.

> **OPEN DECISION 3 — resolved.** Dispatch, Exec, and Dashcam are now shipped
> alongside Maintenance/Fleet/PostedSpeed. Only **Emissions** (needs device
> enrollment first — a write action) and **Ep-Report** (unprobed) remain open.

---

## Dependency / parallelization graph

```
WS0 (shell) ──┬─> WS1 (landing)
              ├─> WS2 (try-real page)      [URL verify can run in parallel]
              ├─> WS3a (skills page)
              └─> WS5a (clients page)

Independent of WS0 (can start now, in parallel, by separate agents):
  WS3b  publishable SKILL.md artifact(s)
  WS4   Ace episode (grounded)
  WS5b  end-card Goose tweak + GitHub issue template
  WS6   speeding-narrative fix (grounded)  [needs DECISION 2]
```

Suggested first wave (parallel, low-risk, no WS0 needed): **WS6 + WS4 + WS3b +
WS5b.** Then **WS0**, then the content pages (WS1/WS2/WS3a/WS5a) in parallel.

---

## Decisions (resolved)

1. **Stack:** ✅ **Vanilla** (separate HTML pages + shared partial). Astro only if
   it grows past ~8 pages; no React SPA.
2. **Speeding narrative:** ✅ **Re-ground to truth + raw-vs-Ace contrast (a+c).**
   Done in WS6/WS4.
3. **"Try it for real" URLs:** Geotab free demo registration =
   **https://my.geotab.com/registration.html** (provided). Still to confirm: the
   exact **Geotab MCP connector setup** link per client — I'll web-search & draft,
   you verify before launch.
4. **First wave (done now):** WS6, WS4, WS3b, WS5b. Remaining: WS0 shell, then
   content pages (WS1/WS2/WS3a/WS5a), then WS7 polish.

> **Still open:** scope of the first public release (which pages ship in v1 vs
> later) — propose at WS0 kickoff.

---

## Assets needed from you (screenshots / brand)

To make the "real" path and the connect beat authentic, these would help:

1. **Claude connector setup** — ✅ *partial: `assets/mcp-claude-add-connector.png`
   received* (the "Add custom connector" dialog; confirms the connector URL
   **`https://mcp.geotab.com/mygeotab`**). Still want the **auth/OAuth** screen and
   the **"connected"** state. Used on the **Try-it-for-real** page (WS2) and
   optionally to make the simulator's `connect`/`authorize` beat look real.
2. **MyGeotab** — a screenshot of the **demo registration** page
   (https://my.geotab.com/registration.html) and, if you have it, a clean shot of a
   MyGeotab map/zone screen we can use as a *static* graphic (WS9, WS3-zone).
3. **Geotab Ace** — a screenshot of an Ace answer with its chart + reasoning, to
   anchor the Ace page/episode (WS4) visually.
4. **Branding** — logo/wordmark + approved color, and confirmation that the
   simulator skin remains provider-neutral enough for legal/brand review.

Drop them in `assets/` (or share and I'll place them). PNG/SVG; please scrub any
real PII before sending.

## Findings log (verified live)

- **Conversation-path review (1 Jul 2026).** Full read-through plus graph metrics
  across all 78 nodes: flagship beats (weekly review, agentic safety, ROI,
  warehouse) are strong — teaching beats land, choices read like real follow-ups,
  honest caveats survive. Structurally: only two nodes end with hub/restart alone
  (both dispatch write-conclusions, both carry endcards); non-hub trays cap at 6
  choices; single-parent nodes are all mid-chain steps, not orphans. Corrected a
  framing slip introduced during review: `skills/geotab-weekly-review/SKILL.md`
  is a **teaching example** (the lesson: conversations first, then build skills
  relevant to your own fleet), never an official installable — ready-to-follow
  shared skills live in `geotab-vibe-guide`. Hub intro now tells first-timers the
  paths cross-link, so the 27-chip tray doesn't read as a commitment.

- **VIN episode (Ep6) was scrapped** — too thin a story to feature. Underlying
  facts: you cannot create a vehicle from a VIN (`Add Device` needs a valid,
  registered GO **serialNumber**; a test serial returned `"Invalid serial
  number"`), and the demo fleets don't help — `demo_fh_vegas4` VINs are all the
  same placeholder, and while `demo_fh4` has real varied VINs (MAN, Mercedes,
  Renault), `DecodeVins` is a utility, not a narrative. Dropped from the simulator.
- **The "Demo-01 outlier" was a pagination mistake, not a Geotab limit.** The 7-day
  window holds **5,645** `ExceptionEvent`s; the earlier raw pull saw 200 (~3.5%).
  Per-vehicle `GetCountOf`+`deviceSearch`: Demo-01 **114**, Demo-15 **113**,
  Demo-08 **114**, Demo-02 **114** — even spread. The **plain API can rank
  correctly** (per-device count or full pagination); **Ace** is a one-step
  aggregation shortcut; a **skill** enforces "don't trust one page." Ep2 now says
  this explicitly.

- **Ep3 Valencia ZBE facts were stale/wrong (fixed).** Script-sourced facts said
  "€200 enforced 24/7, label-B tightening late 2026." Live web search (Jun 2026)
  confirms 27.8 km² + **278 cameras** + €200 statutory fine, **but** the ordinance
  was **rejected 22 Dec 2025** — cameras monitor, don't fine; restrictions are
  phased **2026→2028** (label-A first), and enforcement is politically contested.
  Ep3 rewritten to surface the live, in-flux reality (a stronger demo).
- **Ep1 HOS / DVIR checked.** `DVIRLog` (7d) = **0** (claim verified).
  `DutyStatusViolation` *requires* a `UserSearch` (errors otherwise) — confirms HOS
  is per-driver; Ep1 wording softened from "clean where checked" to a stated
  spot-check, since no per-driver query was actually run.
- **Still scripted, not executed (inherent to a simulator, disclosed):** all
  write-actions (Add Zone/Rule/Notification, DismissFaults, Set) and the Ep5
  Gmail/Calendar legs are realistic but not run live. They map to real tools;
  Demo-06's fault (Ep5) and Demo-23/31 positions (Ep3) are real.

## Grounding appendix (verified live, 18–19 Jun 2026)

- demo_fh_vegas4: 50 devices; 0 active faults (7d); HOS rulesets incl. "USA
  Property 60-hour/7-day"; **Ace top-5 speeding ~99–100 each (even spread).**
- demo_fh4: Valencia-area vehicles **Demo-23** (b17) & **Demo-31** (b1F) at ~39.4°N;
  593 faults (7d); **Demo-06** active faults (device unplugged / GPS antenna, 18 Jun).
- Ace: `GetAceResults` returns answer + chart reference + reasoning trace; works on
  demo_fh_vegas4 (confirm per-DB enablement before relying on it).
