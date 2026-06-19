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
    hub -->|"🔧 Triage maintenance"| ep8["Ep8 · Triage the worklist<br/>demo_fh4"]
    hub -->|"🚐 What's in my fleet?"| ep9["Ep9 · Fleet composition<br/>demo_fh4"]
    hub -->|"🛣️ Was that road that fast?"| ep10["Ep10 · Posted-speed check<br/>demo_fh_vegas4"]
    hub -.->|"🗺️ Story map"| MAP(("open map overlay"))

    ep1 -->|"🛠️ Make it a skill"| ep1s["Ep1 · Package as a skill"]
    ep1 -->|"🤖 Double-check w/ Ace"| ep7
    ep1 -->|"↩︎ Ask something else"| hub
    ep1s -->|"⚡ Try another"| hub

    ep2 -->|"🔔 Flag it live"| ep2a["Ep2 · Create alert"]
    ep2 -->|"🛣️ Were roads that fast?"| ep10
    ep2 -->|"↩︎ Ask something else"| hub
    ep2a -->|"⚡ Try another"| hub

    ep3 -->|"🗺️ Create zone + rule"| ep3a["Ep3 · Create zone + rule"]
    ep3 -->|"🚐 What are the vehicles?"| ep9
    ep3 -->|"↩︎ Ask something else"| hub
    ep3a -->|"⚡ Try another"| hub

    ep4 -->|"🔧 Triage the faults"| ep8
    ep4 -->|"↩︎ Ask something else"| hub

    ep5 -->|"🚐 What is Demo-06?"| ep9
    ep5 -->|"↩︎ Ask something else"| hub

    ep7 -->|"🧠 Show Ace's reasoning"| ep7r["Ep7 · Ace reasoning"]
    ep7 -->|"↩︎ Ask something else"| hub
    ep7r -->|"🔧 Ask Ace about faults"| ep8
    ep7r -->|"⚡ Try another"| hub

    ep8 -->|"🚐 What is Demo-08?"| ep9
    ep8 -->|"↩︎ Ask something else"| hub
    ep9 -->|"🌍 Valencia exposure?"| ep3
    ep9 -->|"↩︎ Ask something else"| hub
    ep10 -->|"🔔 Set a speed alert"| ep2a
    ep10 -->|"↩︎ Ask something else"| hub
```

## Nodes (16)

| id | title | database | leads to |
|---|---|---|---|
| `connect` | Connect the connector | — | `authorize` |
| `authorize` | Authorize | — | `hub` (auto) |
| `hub` | Pick a question | — | the nine episodes + map |
| `ep1-answer` | Weekly review | demo_fh_vegas4 | `ep1-skill`, `ep7-ace`, `hub` |
| `ep1-skill` | Package as a skill | — | `hub`, restart |
| `ep2-answer` | Ask why | demo_fh_vegas4 | `ep2-action`, `ep10-postedspeed`, `hub` |
| `ep2-action` | Create alert | demo_fh_vegas4 | `hub`, restart |
| `ep3-answer` | Zone from the news | demo_fh4 | `ep3-action`, `ep9-fleet`, `hub` |
| `ep3-action` | Create zone + rule | demo_fh4 | `hub`, restart |
| `ep4-answer` | Five actions | demo_fh4 | `ep8-maintenance`, `hub`, restart |
| `ep5-answer` | Geotab + Gmail + Calendar | demo_fh4 | `ep9-fleet`, `hub`, restart |
| `ep7-ace` | Ask Geotab Ace | demo_fh_vegas4 | `ep7-reasoning`, `hub` |
| `ep7-reasoning` | Ace reasoning | demo_fh_vegas4 | `ep8-maintenance`, `hub`, restart |
| `ep8-maintenance` | Triage the worklist | demo_fh4 | `ep9-fleet`, `hub` |
| `ep9-fleet` | Fleet composition | demo_fh4 | `ep3-answer`, `hub`, restart |
| `ep10-postedspeed` | Posted-speed check | demo_fh_vegas4 | `ep2-action`, `hub` |

Episodes now **cross-link** as well as branch to their own action node — e.g.
maintenance → fleet composition → Valencia exposure, or speeding → posted-speed
→ live alert — so the same nine entry points open many distinct paths. New
bifurcations slot in by adding a node and a choice — see the README's
"Extending the graph" section.
