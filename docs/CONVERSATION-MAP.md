# Conversation map

Every branch the simulator can take. This mirrors `data/conversations.js` — the
**live in-app 🗺️ Story map is the source of truth** (generated from the graph at
runtime), and this diagram is the readable version for GitHub.

```mermaid
flowchart TD
    connect["🔌 Connect the connector"] --> authorize["Authorize"]
    authorize -->|auto| hub{{"Pick a question (hub)"}}

    hub -->|"📋 Weekly review"| ep1["Ep1 · Weekly review<br/>demo_fh_vegas4"]
    hub -->|"❓ Why speeding up?"| ep2["Ep2 · Ask why<br/>demo_fh_vegas4"]
    hub -->|"🌍 Low-emission zone"| ep3["Ep3 · Zone from the news<br/>demo_fh4"]
    hub -->|"⚡ 5 fleet chores"| ep4["Ep4 · Five actions<br/>demo_fh4"]
    hub -->|"📧 Fault → email → book"| ep5["Ep5 · Geotab + Gmail + Calendar<br/>demo_fh4"]
    hub -->|"🤖 Ask Geotab Ace"| ep7["Ep7 · Ask Geotab Ace<br/>demo_fh_vegas4"]
    hub -.->|"🗺️ Story map"| MAP(("open map overlay"))

    ep1 -->|"🛠️ Make it a skill"| ep1s["Ep1 · Package as a skill"]
    ep1 -->|"↩︎ Ask something else"| hub
    ep1s -->|"⚡ Try another"| hub

    ep2 -->|"🔔 Flag it live"| ep2a["Ep2 · Create alert"]
    ep2 -->|"↩︎ Ask something else"| hub
    ep2a -->|"⚡ Try another"| hub

    ep3 -->|"🗺️ Create zone + rule"| ep3a["Ep3 · Create zone + rule"]
    ep3 -->|"↩︎ Ask something else"| hub
    ep3a -->|"⚡ Try another"| hub

    ep4 -->|"↩︎ Ask something else"| hub

    ep5 -->|"↩︎ Ask something else"| hub

    ep7 -->|"🧠 Show Ace's reasoning"| ep7r["Ep7 · Ace reasoning"]
    ep7 -->|"↩︎ Ask something else"| hub
    ep7r -->|"⚡ Try another"| hub
```

## Nodes (13)

| id | title | database | leads to |
|---|---|---|---|
| `connect` | Connect the connector | — | `authorize` |
| `authorize` | Authorize | — | `hub` (auto) |
| `hub` | Pick a question | — | the six episodes + map |
| `ep1-answer` | Weekly review | demo_fh_vegas4 | `ep1-skill`, `hub` |
| `ep1-skill` | Package as a skill | — | `hub`, restart |
| `ep2-answer` | Ask why | demo_fh_vegas4 | `ep2-action`, `hub` |
| `ep2-action` | Create alert | demo_fh_vegas4 | `hub`, restart |
| `ep3-answer` | Zone from the news | demo_fh4 | `ep3-action`, `hub` |
| `ep3-action` | Create zone + rule | demo_fh4 | `hub`, restart |
| `ep4-answer` | Five actions | demo_fh4 | `hub`, restart |
| `ep5-answer` | Geotab + Gmail + Calendar | demo_fh4 | `hub`, restart |
| `ep7-ace` | Ask Geotab Ace | demo_fh_vegas4 | `ep7-reasoning`, `hub` |
| `ep7-reasoning` | Ace reasoning | demo_fh_vegas4 | `hub`, restart |

Each `*-answer` episode currently has **one** action branch plus "ask something
else". New bifurcations (more follow-ups, deeper "why" chains, alternate
databases) slot in by adding a node and a choice — see the README's "Extending
the graph" section.
