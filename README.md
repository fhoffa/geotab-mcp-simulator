# Geotab MCP — Experience Simulator

A guided, **zero-setup** way to experience what it's like to use the **Geotab MCP
connector** from an AI chat (à la Claude) — *without* installing anything,
connecting a real fleet, or authenticating.

It's a **simulator**: you don't type freely. At each step it offers a few
realistic questions, then plays back a pre-recorded answer — including the **MCP
tool calls firing** on screen. Every number and vehicle name in those answers was
pulled from the **live Geotab MCP demo databases** on 18–19 Jun 2026, so the
experience is grounded in real data.

> **This is a demo, not the real connector.** In real use the Geotab MCP
> connector follows your MyGeotab permissions and can surface personal data
> (driver names, locations). Review your privacy obligations before connecting a
> production fleet. Not affiliated with Anthropic — the chat styling is a
> stylistic homage.

## What you can try

Connect the (simulated) connector, then pick any of six scenarios:

1. **The Monday morning review** — a whole week's fleet brief in one ask, then package it as a reusable skill.
2. **Why are speeding alerts up?** — diagnostic reasoning that shows the spike is fleet-wide (not one outlier), contrasting a capped raw query with Geotab Ace, then create a live alert.
3. **React to a low-emission zone** — read today's Valencia ZBE rules from the web, see which of *your* vehicles are exposed, then create the zone + entry alert.
4. **Get 5 fleet chores done** — a montage of real write-actions (geofence, idling rule, dismiss faults, group, route alerts).
5. **Fault → email garage → book service** — a cross-tool chain (Geotab + Gmail + Calendar).
6. **Ask Geotab Ace** — pose a fleet question in plain English; Ace returns a ranked answer, a chart, and its reasoning.

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
index.html      app shell (header, chat, choice tray, footer, map overlay)
styles.css      Claude-like theme
app.js          the conversation engine (no dependencies)
data/
  conversations.js   the conversation graph — THE source of truth (the "map")
docs/
  CONVERSATION-MAP.md  a Mermaid diagram of the same graph, for reading on GitHub
```

The whole experience is **data-driven**. `data/conversations.js` defines a graph
of *nodes*; `app.js` just walks it — playing each node's `events` (Claude prose,
system lines, tool-call cards, end cards) with typing delays, then offering the
node's `choices`. The in-app **🗺️ Story map** is generated live from that graph,
so it never goes out of date.

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
       { type: "claude", text: "Here's a short, fact-based coaching note for **Demo - 01**…" },
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

That's it — reload and the new branch (and its place on the Story map) appears.
On load, `app.js` logs a graph-integrity check to the console and flags any choice
or `next` that points at a missing node.

### Node reference (quick)

| field | meaning |
|---|---|
| `id` | unique node id |
| `title` | label shown in the Story map |
| `db` | optional database badge for the node |
| `events[]` | ordered: `claude` (markdown), `system`, `endcard` (`lines[]`), or `tool` |
| `tool` event | `server`, `name`, `args`, `summary`, `result`, optional `write: true` |
| `choices[]` | `{ label, say?, next?, action? }` — `action` is `"restart"` or `"map"` |
| `next` | auto-advance to a node when there are no `choices` |

## Grounding & data notes

Answers were validated against the Geotab MCP demo databases (`demo_fh_vegas4`
= Las Vegas/50 vehicles, `demo_fh4` = Spain/Galicia+Valencia). A few real quirks
are baked in faithfully: trip activity is summarized rather than counted (the raw
counter is an all-time total), HOS is treated as a per-driver spot-check, and a
"clean week" with zero faults is presented as a finding, not padded out.

No secrets, tokens, or real personal data are included — demo fleets use generic
"Demo - NN" names. Internal production notes are intentionally **not** part of
this repo.
