# Geotab MCP — Experience Simulator

**🔗 [Try it live](https://fhoffa.github.io/geotab-mcp-simulator/)**

A guided, **zero-setup** chatbot simulator for the **Geotab MCP connector** —
*without* installing anything, connecting a real fleet, or authenticating.

It's a **simulator**: you don't type freely. At each step it offers a few
realistic questions, then plays back a pre-recorded answer — including the **MCP
tool calls firing** on screen. Every number and vehicle name in those answers was
pulled from the **live Geotab MCP demo databases** on 18–19 Jun 2026, so the
experience is grounded in real data.

> **This is a demo, not the real connector.** In real use the Geotab MCP
> connector follows your MyGeotab permissions and can surface personal data
> (driver names, locations). Review your privacy obligations before connecting a
> production fleet.

## MCP in 30 seconds

**MCP — the Model Context Protocol — is an open standard that lets AI
assistants securely call external tools and data sources.** Geotab publishes an
[official MCP server](https://www.geotab.com/geotab-mcp-connector/) for
MyGeotab. That means any MCP-capable assistant — Claude, Microsoft Copilot,
ChatGPT, and others — can read your live fleet data and take real actions
(create zones, rules, alerts) from a plain-English conversation. No dashboards,
no report builder, no export/import loop.

This simulator shows what that feels like *before* you connect anything real.
More on the protocol itself: [modelcontextprotocol.io](https://modelcontextprotocol.io).

## What you can try

Connect the (simulated) connector, then pick from **~24 scenarios across six
themes** (plus a warehouse-building path — full map in
[docs/CONVERSATION-MAP.md](docs/CONVERSATION-MAP.md)):

- **⭐ Start here** — the Monday morning review (a week's fleet brief in one ask),
  your top-3 safety risks with fixes, "where is my fleet leaking money?" (an ROI
  case built live), and a guided **MotherDuck warehouse** build from MCP calls.
- **🛟 Safety** — riskiest drivers, harsh braking by driver, school-zone speeding,
  a "why are speeding alerts up?" diagnosis (a capped raw query vs **Geotab Ace**),
  and settling a disputed flag with posted road speeds.
- **🔧 Maintenance** — triage the shop's worklist, overdue service, fault codes by
  severity, unplanned downtime, a root-cause dig on one repeat offender, and a
  cross-tool chain: fault → email the garage → book service (Geotab + Gmail + Calendar).
- **🚀 Operations** — fuel economy by vehicle type, idle-time hotspots,
  EV-replacement candidates, "what's actually in my fleet?" (VIN decode), and
  reacting to Valencia's low-emission zone with live web rules.
- **🧠 Automate & share** — package the weekly review as a reusable **skill**,
  knock out 5 fleet chores (write-actions) in one ask, draft coaching notes.
- **🚚 Cross-tool & exec** — "who's closest and free right now?" dispatch, settle
  a late-delivery dispute against a Salesforce case, and a board snapshot across
  two fleets.

## Get started with your real fleet

When you're done playing, the real thing takes three steps — the in-app
**"Connect real account"** overlay walks through them with screenshots:

1. **Get a MyGeotab database.** Fastest: register a **free demo database** at
   [my.geotab.com/registration.html](https://my.geotab.com/registration.html) —
   anonymized data, same shape as this simulator, safe to explore. For
   production access, ask your Geotab account rep or fleet admin.
2. **Add the connector to your AI assistant.** Geotab's official MCP server URL
   is `https://mcp.geotab.com/mygeotab`. In Claude: **Settings → Connectors →
   Add custom connector**, paste the URL, and sign in with your MyGeotab
   credentials when prompted. Microsoft Copilot, ChatGPT, and other MCP clients
   follow the same pattern. Official walkthrough:
   [Getting started with MyGeotab MCP](https://support.geotab.com/help/mygeotab/access-and-administration/mygeotab-mcp/getting-started-with-mygeotab-mcp).
3. **Know what you're exposing.** The connector inherits your MyGeotab
   permissions, so the assistant can see anything you can — including personal
   data. Review your privacy/DPA obligations before connecting production data,
   and prefer vehicle/asset-level questions over person-level ones.

**Bonus — install a skill.** [`skills/geotab-weekly-review/SKILL.md`](skills/geotab-weekly-review/SKILL.md)
packages the Monday-morning review as a reusable skill for any MCP client. It
encodes real Geotab data quirks (the all-time trip counter, per-driver HOS,
pagination caps that fake "outliers") and a strict no-PII default — so anyone on
the team gets the same correct brief.

## Run it locally

It's plain static files — no build, no dependencies.

```bash
# from the repo root
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly via `file://` also works, because the data is
loaded as a plain script — but a tiny server is the cleaner path.)

## Deploy (GitHub Pages)

1. Push to GitHub.
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` / root.
3. It goes live at `https://<user>.github.io/<repo>/`. No CI or build step needed.

## How it works

```
index.html      app shell (header, chat, choice tray, footer)
styles.css      neutral chatbot theme
app.js          the conversation engine (no dependencies)
data/
  sample-data.js     the explicit sample-data store — THE source of truth for
                     the safety/maintenance/ops/agentic numbers (window.SAMPLE_DATA)
  conversations.js   the conversation graph; charts & results ground on the store
docs/
  CONVERSATION-MAP.md  a Mermaid diagram of the same graph, for reading on GitHub
```

`data/sample-data.js` holds the dataset the newer scenarios are grounded on —
the driver roster, safety scorecard, fault triage, fuel/idle/downtime figures,
etc. — so a number changes in one place and every conversation that quotes it
follows. `conversations.js` builds those nodes' charts (and some tool results)
from `window.SAMPLE_DATA` via a small `bars()` helper. Load order matters:
`sample-data.js` must come before `conversations.js` in `index.html`.

The whole experience is **data-driven**. `data/conversations.js` defines a graph
of *nodes*; `app.js` just walks it — playing each node's `events` (assistant prose,
system lines, tool-call cards, end cards) with typing delays, then offering the
node's `choices`.

## Extending the graph (adding a bifurcation)

All content lives in `data/conversations.js`. To add a new branch:

1. **Add a node** to `nodes`, e.g.:

   ```js
   "ep2-coach": {
     id: "ep2-coach",
     title: "Ep2 · Draft a coaching note",
     db: "demo_fh_vegas4",
     events: [
       { type: "tool", server: "geotab", name: "Get",
         args: { database: "demo_fh_vegas4", typeName: "Device", search: { id: "b1" } },
         summary: "Demo - 01", result: '{ "name": "Demo - 01" }' },
       { type: "assistant", text: "Here's a short, fact-based coaching note for **Demo - 01**…" },
       { type: "endcard", lines: ["Geotab MCP Connector", "From insight to action."] }
     ],
     choices: [
       { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
       { label: "↻ Restart", action: "restart" }
     ]
   }
   ```

2. **Point a choice at it** from an existing node (e.g. add to `ep2-answer.choices`):

   ```js
   { label: "📝 Draft a coaching note", say: "Draft a coaching note for that driver.", next: "ep2-coach" }
   ```

That's it — reload and the new branch appears. On load, `app.js` logs a
graph-integrity check to the console and flags any choice or `next` that
points at a missing node.

### Node reference (quick)

| field | meaning |
|---|---|
| `id` | unique node id |
| `title` | node label |
| `db` | optional database badge for the node |
| `events[]` | ordered: `assistant` (markdown), `system`, `endcard` (`lines[]`), or `tool` |
| `tool` event | `server`, `name`, `args`, `summary`, `result`, optional `write: true` |
| `choices[]` | `{ label, say?, next?, action? }` — `action` is `"restart"` |
| `next` | auto-advance to a node when there are no `choices` |

## Grounding & data notes

Answers were validated against the Geotab MCP demo databases (`demo_fh_vegas4`
= Las Vegas/50 vehicles, `demo_fh4` = Spain/Galicia+Valencia). A few real quirks
are baked in faithfully: trip activity is summarized rather than counted (the raw
counter is an all-time total), HOS is treated as a per-driver spot-check, and a
"clean week" with zero faults is presented as a finding, not padded out.

The newer **Safety / Maintenance / Operations / Agentic** scenarios go a step
further. Their structure is anchored to the real demo data (fleet sizes, vehicle
mix, the fleet-wide speeding pattern, the Sprinter fault cluster), but the demo
databases are sparse — no assigned drivers, only speeding exceptions, only
GO-device faults. To show what a **fully-instrumented customer** actually sees,
those scenarios are filled out with **realistic, fictional data grounded in
genuine Geotab capabilities** (Driver ID, Safety Center scorecards, maintenance
reminders, fault-lamp severity, fuel/idle reports) — all kept in
`data/sample-data.js`. **Driver names are fictional**, and write-actions point at
test mailboxes / sandbox records.

No secrets, tokens, or real personal data are included — vehicles use generic
"Demo - NN" names and any driver names are invented. Internal production notes
are intentionally **not** part of this repo.
