# Roadmap — Geotab MCP Simulator → "Try it for real" site

This is the working plan. It's written so workstreams can be **picked up
independently, deferred, or parallelized across agents**. Each workstream lists
its goal, files, dependencies, whether it can run in parallel, what live-MCP
grounding it needs, and acceptance criteria.

Status legend: ✅ done · 🟡 in progress · ⬜ not started · 🔬 needs grounding

---

## Vision

Two front doors, one connector:

1. **Try the experience now** — the zero-setup simulator (built). Default client
   is Claude; we explicitly invite other MCP clients.
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

### WS1 — Landing page  ⬜
- **Goal:** explain the connector in 1 screen; two CTAs ("Try the simulator" /
  "Try it for real"); a strip of the six use cases; client-agnostic message.
- **Files:** `index.html` content.
- **Depends on:** WS0.  **Parallel:** yes, after WS0.
- **Acceptance:** loads with no JS errors; both CTAs route correctly; mobile OK.

### WS2 — "Try it for real" page (+ PII warning)  ⬜ 🔬(URLs)
- **Goal:** step-by-step to (1) get a free Geotab demo database, (2) connect the
  Geotab MCP connector to an AI client, (3) understand PII obligations.
- **Content:**
  - Step 1 — Get a free Geotab demo database. *(VERIFY exact public signup/demo
    URL — do not invent. Likely Geotab demo request / partner path.)*
  - Step 2 — Connect the Geotab MCP connector. *(VERIFY the connector directory /
    setup link for Claude; note other clients → WS5.)*
  - Step 3 — **PII warning (prominent):** when you connect a *real/production*
    database, the connector inherits your MyGeotab permissions and can surface
    **personal data** (driver names, employee numbers, emails on distribution
    lists, precise location histories). Before doing this:
    - Review your **DPA / contract** with your AI provider and your **GDPR /
      works-council / data-minimisation** obligations.
    - **Mitigation A — instruct the AI to avoid PII:** work at the vehicle/asset
      level ("use device names, not driver names; never return emails or phone
      numbers").
    - **Mitigation B — use a skill that enforces no-PII** (see WS3) so it's not
      left to per-prompt discipline.
    - Note: **demo databases are anonymised** ("Demo - NN", `UnknownDriverId`) so
      they're safe to experiment on; production is where the risk lives.
  - "Not legal advice" line; mirror language from the series bible §5.
- **Files:** `try-real.html`.
- **Depends on:** WS0; content-verify task for URLs (can stub with TODO links).
- **Parallel:** yes. Acceptance: 3 clear steps; PII box visually prominent; links
  either verified or clearly marked "confirm before launch".

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
- **Depends on:** nothing (simulator already supports tool+claude events). A chart
  visual is a nice-to-have (render a tiny inline bar chart in a new event type).
- **Parallel:** **yes — fully independent of WS0–WS3.**
- **Acceptance:** Ace episode plays; numbers match the live capture; story is
  consistent with WS6.
- **Note:** Ace may need extra permissions on some databases — page should say
  "if Ace isn't enabled on your DB, ask your admin."

### WS5 — MCP clients page (+ GitHub issue template)  🟡 (WS5b done; WS5a page ⬜)
- **Goal:** Claude is our default; encourage **Microsoft Copilot, ChatGPT, Block
  Goose, Cursor, Windsurf, or any MCP client.** Instructions "coming soon"; let
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
- **Goal:** feature a **Claude artifact** capability — Claude builds an interactive
  dashboard from data it pulled via the connector. *(This is a Claude/artifact
  feature, not a Geotab MCP feature — say so.)*
- **Build:** new simulator episode `ep8-dashboard` (hub: "📊 Build a fleet
  dashboard"): Geotab read tool cards → a rendered **dashboard artifact** inline
  (stat tiles + the existing bar `chart` event). Add a `dashboard` event type
  (tiles) — reuses the chart renderer from WS4.
- **Files:** `data/conversations.js` (+ small `dashboard` renderer in `app.js`/CSS).
- **Depends on:** nothing. **Parallel:** yes. **Effort:** low (chart already exists).
- **Acceptance:** dashboard artifact renders; copy makes clear it's Claude-built,
  grounded in connector data; no live embeds.

### WS9 — "Create a map" capability  ⬜ (grounding ✅: positions captured)
- **Goal:** feature Claude rendering a **map artifact** from live device positions
  (e.g. "map my fleet" / "show Valencia exposure"). Per brand guidance: a
  **prepared/stylized** map (SVG points over a simple backdrop), **no live tiles**.
- **Build:** new episode `ep9-map`: `Get DeviceStatusInfo` (have real lat/long for
  demo_fh4 — Galicia cluster ~42°N + Valencia Demo-23/Demo-31 ~39.4°N) → a `map`
  event that projects lat/long to x/y and plots dots, highlighting the Valencia ZBE
  ones. Ties nicely to Ep3.
- **Files:** `data/conversations.js` (+ `map` SVG renderer in `app.js`/CSS).
- **Depends on:** nothing. **Parallel:** yes. **Effort:** medium (SVG projection).
- **Acceptance:** map artifact plots the real positions; Valencia vehicles stand
  out; labeled "illustrative — Claude-rendered, not a live map".

### WS7 — Polish (later)  ⬜
- Responsive/a11y pass across new pages; meta/OG tags for sharing; optional
  privacy-respecting analytics; favicon/og image; "copy link to this episode".
- **Parallel:** last. Acceptance: Lighthouse pass; shares render a card.

### WS10 — Code review follow-ups (engine hardening)  ⬜
- **Goal:** track every finding from the 19 Jun code review of `app.js` as a
  discrete to-do (none blocking; this repo had no open PR to review, so the
  review covered the current `app.js`/`data/conversations.js` on `main`).
- **To-dos:**
  - [ ] **Security — href attribute-breakout.** `escapeHtml()` (app.js:42-47)
    only escapes `&`/`<`/`>`, not quotes. `inline()` (app.js:48-54) interpolates
    the markdown-link URL straight into `href="..."`, so a `"` in a URL/label
    would break out of the attribute and allow injected attributes (e.g.
    `onmouseover=`). No exploit today — no `[text](url)` links exist yet in
    `data/conversations.js` — but fix before anyone adds one: escape quotes
    too, and/or validate the URL scheme is `http(s)`.
  - [ ] **CI — silent broken links.** `checkGraph()` (app.js:28-39) only
    `console.error`s on a broken `next`/`choices[].next` reference; a broken
    link can ship silently since nobody opens devtools to check. Add a
    pre-commit/CI script that loads `conversations.js` headlessly and fails
    the build on any unresolved link.
  - [ ] **Test coverage.** No automated tests exist. At minimum, script the
    `checkGraph()` invariants (every link resolves, every node reachable from
    `start`) so authoring mistakes are caught before deploy, not by eyeballing.
  - [ ] **Cleanup — duplicate bubble renderers.** `addUserBubble` and
    `addClaudeProse` (app.js:114-132) are identical except for row/avatar
    class and glyph; collapse into one `addBubble(role, text)` helper.
  - [ ] **Cleanup — overcomplicated `wait()`.** `wait()` (app.js:102-111) runs
    a `setTimeout` *and* a 40ms-polling `setInterval` just to detect a mid-wait
    `skip` flip; simplify (e.g. check `skip` once per loop iteration like the
    existing `myToken` guards do, or use a single cancelable timer).
- **Files:** `app.js`; new lightweight check script (e.g. `scripts/check-graph.js`).
- **Depends on:** nothing. **Parallel:** yes, each to-do is isolated.
- **Acceptance:** quote-breakout fixed; CI fails on a broken graph link; no
  behavior change to playback.

---

## WS11 — New episode backlog (personas × real tools)  ⬜ 🔬

**Goal:** broaden the simulator beyond the fleet-manager lens. Today's six
episodes are mostly "the manager's Monday." Real fleets have **distinct roles
with distinct needs** (the vibe-guide's four pillars — *productivity, safety,
compliance, sustainability* — plus dispatch/maintenance), and the live MCP
exposes **several real tools we don't use yet.** Each story below is a *pitch*,
not a script: it names the persona, the question, the candidate **real** MCP
tools, and the teaching beat. **None are grounded yet** — before any ships,
capture the live MCP reply on `demo_fh_vegas4` / `demo_fh4`, fill in real
numbers, and flip 🔬 → ✅. **Do not fabricate tool results** (same bar as the
existing episodes).

> Source inspiration: `github.com/fhoffa/geotab-vibe-guide` (pillars, agentic
> monitoring, safety coaching, maintenance tickets) mapped onto unused tools in
> the live Geotab MCP: `SearchMedia`, `GetMediaUrl`, `DownloadMediaFile`,
> `GetEmissionComplianceDeadline`, `EmissionEnrollDevices`,
> `GetPostedRoadSpeedsForDevice`, `SendReportProcessingRequest`, `DecodeVins`,
> `GetDevicesInformation`, plus `Set`/`Remove` (only `Add` is used so far).

### Backlog (each = one new hub choice + answer node, optional action node)

- [ ] **Ep-Dashcam — "Show me what happened" (Safety / risk officer)** 🔬
  - *Ask:* "Demo-NN had a harsh-braking event yesterday — pull the dashcam clip
    around that moment so I can see what happened, then start a coaching note."
  - *Tools:* `Get`(ExceptionEvent, harsh braking) → `SearchMedia`(device +
    time window) → `GetMediaUrl` / `DownloadMediaFile`.
  - *Teaching beat:* MCP bridges telematics → **video** → coaching in one
    thread; the event timestamp *is* the media query. Strong, visual.
  - *Grounding risk:* **HIGH** — demo fleets may have no media/dashcam. Verify
    `SearchMedia` returns anything; if not, either skip or disclose as scripted.

- [ ] **Ep-Emissions — "Who's facing a compliance deadline?" (Compliance / sustainability)** 🔬
  - *Ask:* "Are any of my vehicles facing an emissions-compliance deadline (e.g.
    CARB Clean Truck Check)? Which still need enrolling — go ahead and enroll them."
  - *Tools:* `GetEmissionComplianceDeadline` (read) → `EmissionEnrollDevices`
    (**write/action**). Likely US-relevant → try `demo_fh_vegas4` first.
  - *Teaching beat:* surfaces a **regulatory deadline** + a one-step enroll
    action — compliance pillar, and a brand-new write verb beyond `Add`.

- [ ] **Ep-PostedSpeed — "Was the limit really what we think?" (Supervisor / driver dispute)** 🔬
  - *Ask:* "Demo-01 disputes a speeding flag on a stretch of road — pull the
    *posted* road speed for that device's route so we coach on facts, not memory."
  - *Tools:* `GetPostedRoadSpeedsForDevice` (+ `Get` ExceptionEvent for context).
  - *Teaching beat:* ground a coaching/HR conversation in **objective posted
    limits**; pairs perfectly with the fleet-wide speeding story (Ep2/Ep7).

- [ ] **Ep-Report — "Email me the Excel every Monday" (Operations / finance admin)** 🔬
  - *Ask:* "I need a fleet-utilization report as a file for the finance review —
    generate it and send it to me on a schedule."
  - *Tools:* `SendReportProcessingRequest`.
  - *Teaching beat:* MCP can drive **Geotab's own reporting engine** and deliver
    a real artifact — conversational ask → formal deliverable. Complements the
    "package as a skill" beat (Ep1) and the dashboard artifact (WS8).

- [ ] **Ep-Dispatch — "Who's closest and free right now?" (Dispatcher / operations)** ✅-ish
  - *Ask:* "A job just came in near downtown — which vehicle is closest and
    available right now?"
  - *Tools:* `GetDevicesInformation` / `Get`(DeviceStatusInfo) for live
    positions (already proven real in Ep3) + a simple nearest calc.
  - *Teaching beat:* real-time **operational decisioning** (productivity pillar),
    a genuinely different role from the reflective "manager's review." Could
    reuse the WS9 map artifact to plot the pick.

- [ ] **Ep-Maintenance — "Triage the whole shop's worklist" (Maintenance manager)** ✅-ish
  - *Ask:* "Across the fleet, which vehicles have active faults right now — give
    me a prioritized worklist for the shop."
  - *Tools:* `GetCountOf`/`Get`(FaultData) on `demo_fh4` (**593 faults / 7d**,
    Demo-06 active — already verified) + `GetDevicesInformation` to enrich.
  - *Teaching beat:* turn **593 raw faults into a ranked worklist**; vivid
    contrast with Vegas's *0 faults*. Distinct from Ep5 (one fault → one email):
    this is fleet-wide triage. Optional action: `DismissFaults` on serviced ones.

- [ ] **Ep-Electrify — "Which vans should go electric?" (Sustainability / fleet planning)** 🔬
  - *Ask:* "Which vehicles are the best EV-conversion candidates — short,
    predictable routes with lots of idling — and what are they (make/model)?"
  - *Tools:* `DecodeVins` (demo_fh4 has **real varied VINs** — MAN, Mercedes,
    Renault) + `Get` idling exceptions + positions.
  - *Teaching beat:* sustainability planning grounded in **real vehicle
    identity** + behavior. Gives `DecodeVins` the narrative it lacked as a bare
    utility (see findings log — VIN episode was dropped for *lack of story*).

- [ ] **Ep-Exec — "Board snapshot across both regions" (Executive / fleet director)** ✅-ish
  - *Ask:* "Give me a board-level snapshot across both fleets — safety,
    compliance, sustainability, utilization — in five numbers."
  - *Tools:* aggregate `GetCountOf` / `GetAceResults` across **both**
    `demo_fh_vegas4` *and* `demo_fh4`.
  - *Teaching beat:* the four pillars in one ask, **spanning two databases** (no
    current episode does cross-DB). Natural home for the WS8 dashboard artifact.

- **Files:** `data/conversations.js` (one node per answer, optional action node +
  hub choice); some need the new `chart`/`dashboard`/`map` renderers (WS4/8/9).
- **Depends on:** nothing structurally; **each is gated on a live MCP capture**
  (that's the 🔬). Dispatch/Maintenance/Exec lean on already-verified data, so
  they're the lowest-risk to ground first.
- **Parallel:** yes — each episode is an isolated graph addition.
- **Acceptance (per episode):** numbers match a live capture; tool names/args are
  real; no claim contradicts the live aggregate; persona + teaching beat are clear.

> **OPEN DECISION 3 — which to ground first?** Recommend the ✅-ish trio
> (**Dispatch, Maintenance, Exec**) since their data is already verified, plus
> **Emissions** and **PostedSpeed** as the highest-novelty *new-tool* showcases.
> Dashcam is the most cinematic but the riskiest to ground — confirm media
> exists on the demo DBs before investing.

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

1. **Claude connector setup** — screenshots of adding the Geotab MCP connector in
   Claude (Settings → Connectors → add, the auth/OAuth screen, the "connected"
   state). Used on the **Try-it-for-real** page (WS2) and optionally to make the
   simulator's `connect`/`authorize` beat look real.
2. **MyGeotab** — a screenshot of the **demo registration** page
   (https://my.geotab.com/registration.html) and, if you have it, a clean shot of a
   MyGeotab map/zone screen we can use as a *static* graphic (WS9, WS3-zone).
3. **Geotab Ace** — a screenshot of an Ace answer with its chart + reasoning, to
   anchor the Ace page/episode (WS4) visually.
4. **Branding** — logo/wordmark + approved color, and confirmation of how far the
   "Claude-style homage" can go vs. needing a more neutral skin (legal/brand).

Drop them in `assets/` (or share and I'll place them). PNG/SVG; please scrub any
real PII before sending.

## Findings log (verified live)

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
