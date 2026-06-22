# AGENTS.md

## Project overview

This repository is a static, zero-build simulator for the Geotab MCP connector experience. It is plain HTML/CSS/JavaScript with no package manager or build step.

Key files:
- `index.html` — app shell
- `styles.css` — visual styling
- `app.js` — simulator runtime and conversation engine
- `data/sample-data.js` — explicit sample-data store (`window.SAMPLE_DATA`); source of truth for the safety/maintenance/ops/agentic numbers & drivers. Must load before `conversations.js`.
- `data/conversations.js` — source of truth for scripted conversation nodes; grounds charts/results on the sample-data store via `bars()` / `D`
- `scripts/check-graph.js` — graph integrity checker (loads both data files)
- `docs/CONVERSATION-MAP.md` — human-readable graph map

## Development expectations

- Keep the app dependency-free unless there is a strong reason to add tooling.
- Preserve the static-site/GitHub Pages deployment model: `main` branch, repository root.
- Prefer data-driven scenario changes in `data/conversations.js`; avoid hardcoding scenario content in `app.js`.
- When editing conversation flows, keep node ids, `next`, and `choices[].next` references valid.
- Treat the simulator’s demo fleet data as public demo data only; do not add real customer data, private notes, secrets, tokens, or credentials.

### Design principle — enriching incomplete demo data

This is a **demo of what a real fleet manager would experience**, not a literal
mirror of the demo databases. The demo DBs are sometimes thin or unrealistic
(e.g. `demo_fh_vegas4`'s VINs are all the same placeholder; `demo_fh4` has only a
handful of distinct VINs). When that thinness would *break the illusion* of a
real fleet, it is **acceptable — and intended — to enrich the data toward a more
realistic experience** (e.g. presenting 50 distinct VINs for a 50-vehicle fleet
instead of the literal repeated placeholders).

Guardrails so enrichment stays honest:
- Keep **tool names, arguments, and response shapes real** — enrich the *values*,
  not the API surface.
- Don't contradict a *finding the simulator teaches* (e.g. the fleet-wide
  speeding result, the Demo-08 fault outlier). Enrichment fills realism gaps; it
  must not undercut a teaching beat.
- For a capability the demo genuinely can't produce a real result for (no camera
  media, no map tiles), label it **illustrative** the way `media`/`map` events
  already do, rather than passing it off as a live capture.

In short: enrich for realism, disclose when something is illustrative, and never
fabricate the *mechanics* (tools/args) — only the *texture* (plausible values).

**Where enriched values live:** keep them in `data/sample-data.js`
(`window.SAMPLE_DATA`), not hardcoded inline, so a number changes in one place
and every node that quotes it stays consistent. Build a node's chart `bars`
(and, where practical, its tool `result`) from `D` / `bars()` in
`conversations.js`. The `facts` block in the store is real demo data; everything
else is realistic and fictional — **driver names are fictional, no real PII**.

## Verification

Before finishing changes, run:

```bash
node scripts/check-graph.js
```

For UI-affecting changes, also run a local static server and smoke-test the main simulator path:

```bash
python3 -m http.server 8000
```

## Review guidelines

When reviewing pull requests for this repo, focus on P0/P1 issues:

- Broken simulator flow: missing node references, unreachable core scenarios, or JavaScript errors that prevent the app from loading.
- Privacy/data leakage: real PII, customer fleet data, credentials, tokens, internal notes, or non-demo identifiers committed into the repo.
- Static deployment regressions: changes that require a build step, server runtime, or dependencies without updating the deployment model.
- Accessibility/usability regressions in the landing overlay, choice tray, conversation controls, or “Connect your real account” flow.
- Content grounding issues where the simulator claims live/demo data support that is not represented in `data/conversations.js` or docs.

Minor copy edits, stylistic preferences, and low-risk refactors should generally be suggestions, not blocking review findings.
