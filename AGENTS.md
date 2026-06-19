# AGENTS.md

## Project overview

This repository is a static, zero-build simulator for the Geotab MCP connector experience. It is plain HTML/CSS/JavaScript with no package manager or build step.

Key files:
- `index.html` — app shell
- `styles.css` — visual styling
- `app.js` — simulator runtime and conversation engine
- `data/conversations.js` — source of truth for scripted conversation nodes
- `scripts/check-graph.js` — graph integrity checker
- `docs/CONVERSATION-MAP.md` — human-readable graph map

## Development expectations

- Keep the app dependency-free unless there is a strong reason to add tooling.
- Preserve the static-site/GitHub Pages deployment model: `main` branch, repository root.
- Prefer data-driven scenario changes in `data/conversations.js`; avoid hardcoding scenario content in `app.js`.
- When editing conversation flows, keep node ids, `next`, and `choices[].next` references valid.
- Treat the simulator’s demo fleet data as public demo data only; do not add real customer data, private notes, secrets, tokens, or credentials.

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
