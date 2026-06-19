/*
 * conversations.js — the conversation graph (a.k.a. "the map").
 *
 * This single object IS the map of every conversation possibility. The engine
 * (app.js) just walks it. To add a branch: add a node here and point a choice
 * at it. See README.md → "Extending the graph".
 *
 * Every number, vehicle name and decode below was pulled from the live Geotab
 * MCP demo databases on 18-19 Jun 2026. Answers are pre-recorded (this is a
 * simulator) but grounded in real data.
 *
 * Node shape:
 *   id      : string (unique)
 *   title   : short label shown in the Story Map
 *   db      : optional database badge for the whole node
 *   events  : ordered list of things that "happen" when you reach the node
 *               { type:"claude",  text }                      Claude prose (markdown)
 *               { type:"system",  text }                      status / connector line
 *               { type:"endcard", lines:[...] }               styled end card
 *               { type:"tool", server, name, args, summary,   a tool call firing
 *                              result, write? }
 *               { type:"chart", title, bars:[{label,value}] }   labeled bar chart
 *               { type:"media", src, poster?, caption?,         a video clip; set
 *                              illustrative:true, fallbackText? } illustrative:true
 *                              whenever it's a simulated/generated clip, not a real
 *                              MCP media result (see media/README.md)
 *   choices : buttons the user can pick (omit to auto-advance with `next`)
 *               { label, say?, next?, action? }
 *               - label : chip text
 *               - say   : what shows as the user's message (defaults to label)
 *               - next  : node id to go to
 *               - action: "restart" | "map" (engine-handled, no node needed)
 *   next    : auto-advance to this node id (used when there are no choices)
 */
window.CONVERSATIONS = {
  meta: {
    title: "Geotab MCP — Experience Simulator",
    groundedOn: "18–19 Jun 2026",
    databases: {
      demo_fh_vegas4: "Las Vegas, USA · 50 vehicles",
      demo_fh4: "Spain (Galicia + Valencia) · 50 vehicles",
    },
  },

  start: "connect",

  nodes: {
    /* ---------------------------------------------------------------- connect */
    connect: {
      id: "connect",
      title: "Connect the connector",
      events: [
        {
          type: "claude",
          text:
            "**Hi, I'm Claude.** I can work directly with your fleet through the " +
            "**Geotab MCP connector** — reading live data *and* taking actions, all from chat.\n\n" +
            "This page is a **simulator**: you'll pick from suggested questions instead of typing, " +
            "and the replies are pre-recorded. But every figure you'll see was pulled from a real " +
            "Geotab demo fleet. Connect the connector to begin.",
        },
      ],
      choices: [
        { label: "🔌 Connect the Geotab MCP connector", say: "Connect the Geotab MCP connector.", next: "authorize" },
      ],
    },

    /* -------------------------------------------------------------- authorize */
    authorize: {
      id: "authorize",
      title: "Authorize",
      events: [
        { type: "system", text: "Opening Geotab authorization…" },
        {
          type: "tool",
          server: "geotab",
          name: "authenticate",
          args: { method: "OAuth" },
          summary: "session established",
          result: '{ "authenticated": true, "databases": ["demo_fh_vegas4", "demo_fh4"] }',
        },
        {
          type: "system",
          text:
            "✓ **Connected to Geotab.** Two demo fleets are available:\n" +
            "- **demo_fh_vegas4** — Las Vegas, USA · 50 vehicles\n" +
            "- **demo_fh4** — Spain (Galicia + Valencia) · 50 vehicles",
        },
      ],
      next: "hub",
    },

    /* -------------------------------------------------------------------- hub */
    hub: {
      id: "hub",
      title: "Pick a question (hub)",
      events: [
        {
          type: "claude",
          text:
            "You're connected to a live demo fleet. **What would you like to try?**\n\n" +
            "*(In the real connector you'd just type — here, pick one below.)*",
        },
      ],
      choices: [
        {
          label: "📋 The Monday morning review",
          say:
            "Give me my weekly fleet review for the last 7 days — faults, idling and harsh driving, " +
            "HOS violations, DVIR gaps, and trip activity. Keep it to a short brief I can act on.",
          next: "ep1-answer",
        },
        {
          label: "❓ Why are speeding alerts up?",
          say:
            "Our speeding alerts are up this week. Why — is it the whole fleet, or a few vehicles? " +
            "Break it down for me.",
          next: "ep2-answer",
        },
        {
          label: "🌍 React to a low-emission zone",
          say:
            "Valencia's low-emission zone is tightening in 2026. Check the current rules, and tell me " +
            "whether my fleet drives through that zone and what a non-compliant entry would cost us.",
          next: "ep3-answer",
        },
        {
          label: "⚡ Get 5 fleet chores done",
          say:
            "I've got a few fleet chores to knock out — set up a depot geofence, an idling alert, " +
            "clear a serviced van's faults, group my Valencia vehicles, and route the alerts to a manager.",
          next: "ep4-answer",
        },
        {
          label: "📧 Fault → email garage → book service",
          say:
            "One of our vans just logged a fault. Pull the details, draft an email to the garage asking " +
            "them to take a look, and put a tentative service slot on my calendar for tomorrow morning.",
          next: "ep5-answer",
        },
        {
          label: "🤖 Ask Geotab Ace a question",
          say: "Using Geotab Ace — which 5 vehicles had the most speeding events in the last 7 days, and how many each?",
          next: "ep7-ace",
        },
        {
          label: "🔧 Triage the maintenance worklist",
          say:
            "I've got a pile of faults on the Spain fleet. Is it everywhere, or a few vehicles? " +
            "Give me a prioritized worklist for the shop.",
          next: "ep8-maintenance",
        },
        {
          label: "🚐 What's actually in my fleet?",
          say:
            "Decode my Spain fleet from the VINs — what makes, models and vehicle types am I actually running, " +
            "and which are realistic EV-conversion candidates?",
          next: "ep9-fleet",
        },
        {
          label: "🛣️ Was that road really that fast?",
          say:
            "A driver is disputing a speeding flag on Demo - 01. Pull the posted road speed along its actual " +
            "route so we can coach on facts, not memory.",
          next: "ep10-postedspeed",
        },
        {
          label: "🚐 Who's closest and free right now?",
          say:
            "A job just came in near downtown Las Vegas — which vehicle is closest and actually " +
            "available right now?",
          next: "ep-dispatch",
        },
        {
          label: "📊 Give me a board snapshot, both fleets",
          say:
            "Give me a board-level snapshot across both fleets — utilization, safety, maintenance and " +
            "sustainability — in five numbers.",
          next: "ep-exec",
        },
        { label: "🗺️ Show the story map", action: "map" },
      ],
    },

    /* ----------------------------------------------------------- ep1 · review */
    "ep1-answer": {
      id: "ep1-answer",
      title: "Ep1 · Weekly review",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Device" },
          summary: "50",
          result: '{ "result": 50 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "FaultData", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "0 active faults",
          result: '{ "result": 0 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "all RulePostedSpeeding · speeding is fleet-wide (see note)",
          result:
            '// newest 200 rows only (page cap) — NOT a fleet ranking\n' +
            '[\n  { "rule": "RulePostedSpeedingId", "device": "b1", "activeFrom": "…" },\n' +
            '  { "rule": "RulePostedSpeedingId", "device": "b2", "activeFrom": "…" },\n' +
            '  …\n]\n' +
            '// the whole-fleet aggregate (via Ace) shows ~99–100 events across many vehicles',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetHosRuleSets",
          args: { database: "demo_fh_vegas4" },
          summary: "per-driver rulesets (e.g. USA Property 60-hour / 7-day)",
          result: '[ { "id": "America7Day", "name": "USA Property 60-hour/7-day" }, … ]',
        },
        {
          type: "claude",
          text:
            "Here's your week on **demo_fh_vegas4** (last 7 days):\n\n" +
            "**Headline** — 50 vehicles, all reporting live. **0 active faults.** The story this week is " +
            "*behavior, not breakdowns*: driving exceptions are **entirely posted-speed speeding**.\n\n" +
            "**Needs attention**\n" +
            "- **Speeding is fleet-wide — not one bad actor.** Posted-speed events are spread across many vehicles; the top offenders are within a handful of events of each other. *(A quick raw pull can look like a single outlier — it isn't. Try the* **Why are speeding alerts up?** *scenario to see why.)*\n" +
            "- **HOS:** *per-driver only* — the API won't return violations without naming a driver — so treat this as a spot-check, not a fleet-wide all-clear.\n" +
            "- **DVIR:** none logged this week.\n\n" +
            "**Recommended actions**\n" +
            "1. Treat speeding as a **fleet-wide** coaching + policy issue, not a single-driver one.\n" +
            "2. Stand up a live posted-speed alert so events are flagged in the moment — not next Monday.\n" +
            "3. Maintenance: nothing urgent — a genuinely clean week.\n\n" +
            "> One pass, the whole week — instead of five separate reports.\n\n" +
            "*(I summarized trip activity qualitatively: the raw all-time trip counter isn't a useful weekly number.)*",
        },
      ],
      choices: [
        {
          label: "🛠️ Turn this into a reusable skill",
          say:
            "This is exactly my weekly routine. Turn it into a reusable skill so I — and anyone on my team — " +
            "can run the identical review just by asking for it.",
          next: "ep1-skill",
        },
        { label: "🤖 Double-check the speeding with Ace", say: "Double-check that speeding read with Geotab Ace.", next: "ep7-ace" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep1-skill": {
      id: "ep1-skill",
      title: "Ep1 · Package as a skill",
      events: [
        {
          type: "tool",
          server: "claude",
          name: "Create skill",
          args: { name: "geotab-weekly-review" },
          summary: "geotab-weekly-review.skill created",
          write: true,
          result:
            "# Weekly Fleet Review (skill)\n" +
            "steps: fleet size → faults → idling/harsh → HOS (per-driver) → DVIR → trips\n" +
            "defaults: written brief · no PII (device names only) · summarize counts",
        },
        {
          type: "claude",
          text:
            "Done — I've packaged your routine as **`geotab-weekly-review.skill`**.\n\n" +
            "Here's the part that changes the math: I didn't just answer this week, I packaged the " +
            "*question*. Drop the skill into your team's shared skills and anyone can say " +
            "**\"run my weekly review\"** and get this exact brief. The work you did once, everyone inherits.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."],
        },
      ],
      choices: [
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* -------------------------------------------------------------- ep2 · why */
    "ep2-answer": {
      id: "ep2-answer",
      title: "Ep2 · Ask why",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { fromDate: "…7 days ago", toDate: "now" }, resultsLimit: 200 },
          summary: "newest 200 of ~5,645 rows → false 'one outlier' impression",
          result:
            '// only the newest 200 of ~5,645 events (page cap)\n' +
            '{ "first-page leaders": ["Demo - 01", "Demo - 02"] }\n' +
            '// ⚠ chronological artifact — NOT a whole-fleet ranking',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Top 5 vehicles by speeding events, last 7 days?", new_chat: true },
          summary: "whole-fleet aggregate → top 5 within 1 event (~99–100 each)",
          result:
            '{ "answer": "1. Demo-01: 100  2. Demo-15: 99  3. Demo-16: 99  4. Demo-08: 99  5. Demo-04: 99" }',
        },
        {
          type: "chart",
          title: "Top 5 vehicles by speeding events · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 01", value: 100 },
            { label: "Demo - 15", value: 99 },
            { label: "Demo - 16", value: 99 },
            { label: "Demo - 08", value: 99 },
            { label: "Demo - 04", value: 99 },
          ],
        },
        {
          type: "claude",
          text:
            "Here's the trap. A quick **raw** pull returns only the newest ~200 events, and those happen to cluster " +
            "on a couple of vans — so it *looks* like **Demo - 01** is the culprit.\n\n" +
            "But that's a paging artifact, not the answer — those 200 rows are ~3.5% of the **5,645** events this week. " +
            "When I let **Geotab Ace** aggregate the **whole** week across **all** vehicles, the top five come back within " +
            "a *single event* of each other — about **99–100** speeding events each.\n\n" +
            "So it's **not one van — it's fleet-wide.** The 'why' isn't a person; it's systemic: shared routes, limits " +
            "and expectations. That changes the fix from *a conversation* to *a policy + a live guardrail.*\n\n" +
            "*(Fair to the plain API: it can get this right too — count per vehicle, or page through all 5,645 events — I " +
            "just shouldn't have trusted the first page. That's exactly what a **Geotab skill** enforces; Ace simply does " +
            "the aggregation for you in one step.)*",
        },
      ],
      choices: [
        {
          label: "🔔 Set a fleet-wide speed alert",
          say:
            "Set up a posted-speed alert across the fleet so events are flagged live from now on, and send it to " +
            "one fleet manager.",
          next: "ep2-action",
        },
        { label: "🛣️ Were those roads actually that fast?", say: "Pull the posted road speeds along Demo - 01's route.", next: "ep10-postedspeed" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep2-action": {
      id: "ep2-action",
      title: "Ep2 · Create alert",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Rule", entity: { name: "Posted Speed — fleet-wide", baseType: "Custom" } },
          summary: "Rule created",
          write: true,
          result: '{ "result": "RuleaXX…posted-speed-fleet" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Notification", entity: { recipient: "one fleet manager (by name)" } },
          summary: "Alert routed to 1 manager",
          write: true,
          result: '{ "result": "Notificationb…" }',
        },
        {
          type: "claude",
          text:
            "Done. I created a **fleet-wide posted-speed rule** and routed the alert to **one fleet manager** " +
            "(by name — no email shown). Now any vehicle over the posted limit is flagged in the moment — not " +
            "next Monday, and not just one van.\n\n*Diagnose → act → prevent.*",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Stop guessing why. Ask."] },
      ],
      choices: [
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------------- ep3 · zone */
    "ep3-answer": {
      id: "ep3-answer",
      title: "Ep3 · Zone from the news",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "web",
          name: "web_search",
          args: { query: "Valencia ZBE low emission zone 2026 rules fine enforcement" },
          summary: "278 cameras live · €200 statutory fine · enforcement contested (ordinance rejected Dec 2025)",
          result:
            "valencia.es · autopista.es · valenciabonita.es · race.es\n" +
            '"~27.8 km²; 278 ANPR cameras active; €200 statutory fine; ZBE ordinance rejected 22 Dec 2025 — ' +
            'cameras monitoring, not fining; restrictions phased 2026 → 2028; cleaner labels favoured"',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "DeviceStatusInfo" },
          summary: "live positions — Demo-23 & Demo-31 inside the Valencia area (~39.4°N)",
          result:
            '[\n  { "device": "b17", "name": "Demo - 23", "latitude": 39.473, "longitude": -0.528 },\n' +
            '  { "device": "b1F", "name": "Demo - 31", "latitude": 39.372, "longitude": -0.455 },\n' +
            '  … (rest of fleet up in Galicia, ~42°N)\n]',
        },
        {
          type: "claude",
          text:
            "I checked **today's** news, not my training data — and València's **Zona de Baixes Emissions (ZBE)** " +
            "is genuinely **in flux**:\n" +
            "- It covers **~27.8 km²** (most of the city), watched by **278 ANPR cameras** that are **already switched on**.\n" +
            "- The statutory fine for a non-compliant entry is **€200**.\n" +
            "- **But** the city's ZBE ordinance was **rejected in December 2025** — so right now the cameras are " +
            "**monitoring, not fining**, and sources disagree on whether sanctions have started. Restrictions are " +
            "**phased 2026 → 2028**, tightening over time; cleaner labels (Zero/ECO) are favoured.\n\n" +
            "That nuance is the whole point: a generic assistant would confidently quote old rules. The live read says " +
            "*cameras on, fines on hold, rules still moving.*\n\n" +
            "**And your fleet?** **Demo - 23** and **Demo - 31** are operating in the Valencia area right now " +
            "(~39.4°N) — so whatever the final rules, you're exposed.\n\n" +
            "*(This is moving week to week — re-confirm on valencia.es before acting.)*",
        },
      ],
      choices: [
        {
          label: "🗺️ Create the zone + entry alert",
          say:
            "Create a zone in Geotab matching Valencia's ZBE, add a rule that alerts me whenever one of our " +
            "vehicles enters it, and send the alert to one fleet manager.",
          next: "ep3-action",
        },
        { label: "🚐 What are the affected vehicles?", say: "What kind of vehicles are Demo - 23 and Demo - 31? Decode the fleet.", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep3-action": {
      id: "ep3-action",
      title: "Ep3 · Create zone + rule",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Zone", entity: { name: "ZBE València", points: "…polygon…" } },
          summary: "Zone created",
          write: true,
          result: '{ "result": "Zoneb…zbe-valencia" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Rule", entity: { name: "ZBE València — entry" } },
          summary: "Entry rule live",
          write: true,
          result: '{ "result": "Ruleb…zbe-entry" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Notification", entity: { recipient: "one fleet manager (by name)" } },
          summary: "Alert routed to 1 manager",
          write: true,
          result: '{ "result": "Notificationb…" }',
        },
        {
          type: "claude",
          text:
            "Done — zone **ZBE València** created, an **entry alert** is live, and it's routed to one manager. " +
            "You're ready the moment enforcement actually switches on — instead of finding out from a fine.\n\n" +
            "*(Optional next step: restrict it to non-compliant labels only — the older vans without an ECO/Zero badge.)*",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "The news changed. Your fleet already adapted."] },
      ],
      choices: [
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ---------------------------------------------------------- ep4 · actions */
    "ep4-answer": {
      id: "ep4-answer",
      title: "Ep4 · Five actions",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Zone", entity: { name: "Main Depot", radius_m: 300 } },
          summary: "Depot geofence created (300 m)",
          write: true,
          result: '{ "result": "Zoneb…depot" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Rule", entity: { name: "Idling > 15 min" } },
          summary: "Idling rule created",
          write: true,
          result: '{ "result": "Ruleb…idling" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DismissFaults",
          args: { database: "demo_fh4", device: "Demo - 06" },
          summary: "Acknowledged faults dismissed",
          write: true,
          result: '{ "dismissed": ["b1397", "b1398", "b1399"] }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Group", entity: { name: "Valencia Region" } },
          summary: "Group created (add-only via MCP)",
          write: true,
          result: '{ "result": "Groupb…valencia" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Notification", entity: { recipient: "one fleet manager (by name)" } },
          summary: "Idling alerts routed to 1 manager",
          write: true,
          result: '{ "result": "Notificationb…" }',
        },
        {
          type: "claude",
          text:
            "Five chores, five sentences — all done in one thread:\n" +
            "1. **Depot geofence** — a 300 m zone around your main depot.\n" +
            "2. **Idling alert** — flags any vehicle idling over 15 minutes.\n" +
            "3. **Faults cleared** — dismissed Demo - 06's acknowledged faults after its service.\n" +
            "4. **Region group** — your Valencia-area vehicles are now one reportable group.\n" +
            "5. **Alerts routed** — idling alerts go to one manager.\n\n" +
            "Reporting tells you *what* to do. This one just **did** it — your AI stops being a dashboard and " +
            "starts being a pair of hands.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "It doesn't just report. It acts."] },
      ],
      choices: [
        { label: "🔧 Now triage the faults", say: "Now show me the maintenance worklist for this fleet.", next: "ep8-maintenance" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------- ep5 · cross-tool */
    "ep5-answer": {
      id: "ep5-answer",
      title: "Ep5 · Geotab + Gmail + Calendar",
      db: "demo_fh4",
      events: [
        { type: "system", text: "This flow spans three connectors: **Geotab + Gmail + Google Calendar**." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "FaultData", search: { fromDate: "yesterday", toDate: "now" } },
          summary: "Demo - 06 — device unplugged / GPS antenna fault, 18 Jun 07:29",
          result:
            '[\n  { "device": "b6", "name": "Demo - 06", "diagnostic": "DeviceHasBeenUnpluggedId", "dateTime": "2026-06-18T07:29Z" },\n' +
            '  { "device": "b6", "diagnostic": "GpsAntennaShortCircuitId", "dateTime": "2026-06-18T07:10Z" }\n]',
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "garage@test-mailbox.example", subject: "Demo - 06 — fault check please" },
          summary: "Draft saved (NOT sent)",
          write: true,
          result: '{ "draftId": "r-…", "status": "in Drafts, awaiting your review" }',
        },
        {
          type: "tool",
          server: "google-calendar",
          name: "create_event",
          args: { title: "Service hold — Demo - 06", when: "tomorrow 09:00", status: "tentative" },
          summary: "Tentative service slot — tomorrow 09:00",
          write: true,
          result: '{ "eventId": "…", "status": "tentative" }',
        },
        {
          type: "claude",
          text:
            "Here's the chain, across three tools:\n" +
            "- **Geotab:** Demo - 06 logged a fault on 18 Jun — *device unplugged / GPS antenna* (it'll stop reporting position until checked).\n" +
            "- **Gmail:** I drafted an email to the garage with the vehicle and fault details — **left in Drafts for you to review and send**, not sent automatically.\n" +
            "- **Calendar:** I put a **tentative** service slot on tomorrow at 09:00.\n\n" +
            "Three systems, one sentence. You just review and send — you stop being the glue between your own tools.\n\n" +
            "*(Demo uses a test mailbox/calendar — never a real recipient.)*",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "Your fleet, connected to the tools you already use."],
        },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 06?", say: "What kind of vehicle is Demo - 06? Decode the fleet.", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------------------------------------------- ep7 · Ace */
    "ep7-ace": {
      id: "ep7-ace",
      title: "Ep7 · Ask Geotab Ace",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh_vegas4",
            prompt: "Which 5 vehicles had the most speeding events in the last 7 days, and how many each?",
            new_chat: true,
          },
          summary: "ranked answer + bar chart + reasoning trace",
          result:
            '{\n  "answer": "1. Demo - 01: 100\\n2. Demo - 15: 99\\n3. Demo - 16: 99\\n4. Demo - 08: 99\\n5. Demo - 04: 99",\n' +
            '  "chart": { "type": "bar", "title": "Top 5 Vehicles by Number of Speeding Events" },\n' +
            '  "reasoning": "Outcome / Understanding / Process …"\n}',
        },
        {
          type: "chart",
          title: "Top 5 vehicles by speeding events · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 01", value: 100 },
            { label: "Demo - 15", value: 99 },
            { label: "Demo - 16", value: 99 },
            { label: "Demo - 08", value: 99 },
            { label: "Demo - 04", value: 99 },
          ],
        },
        {
          type: "claude",
          text:
            "That's **Geotab Ace**. I asked in plain English — no SQL — and Ace wrote the query, ran it across your " +
            "whole fleet, and returned a ranked answer, a **chart**, and a **reasoning trace**.\n\n" +
            "Notice the shape: the top five are **within a single event of each other (~99–100)**. Speeding here is " +
            "**fleet-wide**, not one outlier — exactly the whole-fleet aggregation a quick raw query (capped at the " +
            "newest rows) gets wrong.",
        },
      ],
      choices: [
        { label: "🧠 Show Ace's reasoning", say: "Show me how Ace got there.", next: "ep7-reasoning" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep7-reasoning": {
      id: "ep7-reasoning",
      title: "Ep7 · Ace reasoning",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "claude",
          text:
            "Ace returns its work, not just an answer:\n\n" +
            "**Outcome** — Top 5 by speeding events (last 7 days): Demo - 01 (100), then Demo - 15, 16, 08, 04 at 99 each; a bar chart was included.\n\n" +
            "**Understanding** — You wanted the five vehicles with the most speeding events in the last seven days, with a count for each.\n\n" +
            "**Process** — Reviewed the fleet's event data for the past 7 days, isolated speeding events per vehicle, counted and ranked them, returned the top five.\n\n" +
            "That transparency is the point: you can see *what* it counted and *how* — so you can trust the number, or challenge it.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask in plain English. Ace does the analysis."] },
      ],
      choices: [
        { label: "🔧 Now ask Ace about faults", say: "Now ask Ace which vehicles have the most faults this week.", next: "ep8-maintenance" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------- ep8 · maintenance triage */
    "ep8-maintenance": {
      id: "ep8-maintenance",
      title: "Ep8 · Triage the worklist",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh4", typeName: "FaultData", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "599 fault records this week",
          result: '{ "result": 599 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh4", prompt: "Which 5 vehicles had the most fault data records in the last 7 days, and how many each?", new_chat: true },
          summary: "one vehicle dominates — Demo-08: 112 of 599",
          result:
            '{ "answer": "1. Demo - 08: 112  2. Demo - 22: 7  3. Demo - 26: 7  4. Demo - 21: 7  5. Demo - 27: 4" }',
        },
        {
          type: "chart",
          title: "Top 5 vehicles by fault records · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 08", value: 112 },
            { label: "Demo - 22", value: 7 },
            { label: "Demo - 26", value: 7 },
            { label: "Demo - 21", value: 7 },
            { label: "Demo - 27", value: 4 },
          ],
        },
        {
          type: "claude",
          text:
            "**599 fault records** this week sounds like a fire to fight everywhere. It isn't.\n\n" +
            "When Ace aggregates them per vehicle, **one van owns the problem: Demo - 08 logged 112 faults — about 1 in 5 of the entire fleet's total.** Everything else is in the single digits (the next four are 4–7 each).\n\n" +
            "So your shop's worklist writes itself: **pull Demo - 08 in first** — it's not 50 problems, it's basically one. " +
            "Note the contrast with the speeding story: there it was genuinely *fleet-wide* with no outlier; here it's the opposite. " +
            "**Aggregation is what tells you which shape you're in** — and the same Vegas fleet, by comparison, had **0** active faults all week.",
        },
      ],
      choices: [
        { label: "🚐 What is Demo - 08, exactly?", say: "What kind of vehicle is Demo - 08? Decode the fleet.", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* -------------------------------------------------- ep9 · fleet composition */
    "ep9-fleet": {
      id: "ep9-fleet",
      title: "Ep9 · What's in the fleet",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "50 vehicles, 10 distinct VINs",
          result:
            '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "WMAR62ZZ5LT034475" },\n' +
            '  { "name": "Demo - 08", "vehicleIdentificationNumber": "WDB9076571P106588" },\n' +
            '  { "name": "Demo - 21", "vehicleIdentificationNumber": "VF611A364JD011741" },\n' +
            '  … (10 distinct VINs across 50 vehicles)\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["WMAR62ZZ5LT034475", "WDB9076571P106588", "WDF9634031C001659", "VF611A364JD011741", "WEB63372313280840"] },
          summary: "MAN coach · Mercedes Sprinter · Actros · Renault T · Mercedes Intouro",
          result:
            '[\n  { "make": "MAN", "model": "Lion\'s Intercity C", "year": "2020" },\n' +
            '  { "make": "Mercedes-Benz", "model": "Sprinter 907" },\n' +
            '  { "make": "Mercedes-Benz", "model": "New Actros" },\n' +
            '  { "make": "Renault", "model": "T", "year": "2018", "engine": "Euro 6", "body": "Tractor" },\n' +
            '  { "make": "Mercedes-Benz", "model": "Intouro", "plant": "Istanbul" }\n]',
        },
        {
          type: "chart",
          title: "Fleet composition · demo_fh4 (decoded from VINs)",
          bars: [
            { label: "MAN Lion's Intercity (coach)", value: 25 },
            { label: "Mercedes Actros (truck)", value: 10 },
            { label: "Renault T (tractor)", value: 5 },
            { label: "Mercedes Intouro (coach)", value: 5 },
            { label: "Mercedes Sprinter (van)", value: 5 },
          ],
        },
        {
          type: "claude",
          text:
            "I pulled the VINs and decoded them — and this isn't the parcel-van fleet you might assume. It's a **passenger-transport operation**:\n\n" +
            "- **30 intercity coaches** — 25 **MAN Lion's Intercity** (2020/2022) + 5 **Mercedes-Benz Intouro**\n" +
            "- **15 heavy goods units** — 10 **Mercedes-Benz Actros** + 5 **Renault T** tractors (Euro 6)\n" +
            "- **5 light vans** — **Mercedes-Benz Sprinter** *(Demo - 06 to 10 — including your fault hot-spot **Demo - 08**)*\n\n" +
            "Why this matters: a generic assistant treats all 50 as interchangeable 'vehicles.' Grounded in the real VINs, the picture changes the plan — " +
            "your realistic **EV-conversion candidates are the 5 Sprinter vans** (light, urban, predictable), *not* the coaches and 40-tonne tractors. " +
            "Same connector, three minutes, no spreadsheet.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "It knows what you actually drive — not just how many."],
        },
      ],
      choices: [
        { label: "🌍 Which of these hit the Valencia zone?", say: "Which of these vehicles drive through Valencia's low-emission zone?", next: "ep3-answer" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------------------------------- ep10 · posted speeds */
    "ep10-postedspeed": {
      id: "ep10-postedspeed",
      title: "Ep10 · Posted-speed truth-check",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "GetPostedRoadSpeedsForDevice",
          args: { database: "demo_fh_vegas4", deviceId: "b1 (Demo - 01)", fromDate: "18 Jun 00:00", toDate: "18 Jun 23:59" },
          summary: "per-segment posted limits along the route · 10–65 mph",
          result:
            '[\n  { "date": "…00:03", "maxSpeed_kmh": 104.61, "isEstimate": false },  // 65 mph\n' +
            '  { "date": "…00:13", "maxSpeed_kmh": 56.33,  "isEstimate": false },  // 35 mph\n' +
            '  { "date": "…01:12", "maxSpeed_kmh": 48.28,  "isEstimate": false },  // 30 mph\n' +
            '  { "date": "…02:42", "maxSpeed_kmh": 104.61, "isEstimate": true  },  // 65 mph (estimated)\n' +
            '  { "date": "…",      "maxSpeed_kmh": -1 }                            // no posted limit on file\n]',
        },
        {
          type: "claude",
          text:
            "When a driver disputes a speeding flag, you don't have to argue from memory. I pulled the **posted road speed for Demo - 01's actual path** on 18 Jun, segment by segment.\n\n" +
            "Its route ran through limits from **10 up to 65 mph** — the fast stretches cap at **65 mph (105 km/h)**, with plenty of **35–45 mph** surface roads in between. A few segments come back as `-1` (no posted limit on file) or flagged `isEstimate`, so I'd treat those as low-confidence rather than evidence.\n\n" +
            "That's the difference between *\"you were speeding\"* and *\"on this 35-mph stretch at 00:13 you were over\"* — a coaching conversation grounded in the road, not a hunch. It also closes the loop on the fleet-wide speeding finding: the limits are real and knowable, so the fix is policy + live alerts.",
        },
      ],
      choices: [
        { label: "🔔 Set a fleet-wide speed alert", say: "Set up a posted-speed alert across the fleet and send it to one fleet manager.", next: "ep2-action" },
        { label: "📹 Pull the dashcam from that moment", say: "Now pull the dashcam clip for that segment so I can see what actually happened.", next: "ep-dashcam" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ------------------------------------------------------ ep-dispatch · closest vehicle */
    "ep-dispatch": {
      id: "ep-dispatch",
      title: "Ep-Dispatch · Closest available vehicle",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "DeviceStatusInfo", propertySelector: { fields: ["device", "latitude", "longitude", "speed", "isDriving"] }, resultsLimit: 50 },
          summary: "50 live positions · 21 driving, 29 parked right now",
          result:
            '[\n  { "device": { "id": "b1" },  "name": "Demo - 01", "latitude": 36.1662, "longitude": -115.1689, "speed": 59,  "isDriving": true  },\n' +
            '  { "device": { "id": "b2D" }, "name": "Demo - 45", "latitude": 36.1661, "longitude": -115.1577, "speed": 0,   "isDriving": false },\n' +
            '  { "device": { "id": "b32" }, "name": "Demo - 50", "latitude": 36.1659, "longitude": -115.1584, "speed": 0,   "isDriving": false },\n' +
            '  … (47 more)\n]',
        },
        {
          type: "chart",
          title: "Distance from the job (downtown Las Vegas) · miles",
          bars: [
            { label: "Demo - 45 (free)", value: 1.0 },
            { label: "Demo - 50 (free)", value: 1.1 },
            { label: "Demo - 01 (busy)", value: 1.6 },
          ],
        },
        {
          type: "claude",
          text:
            "I pulled live positions for the whole fleet, not just the ones you'd think to check.\n\n" +
            "**Demo - 45 is closest — about 1.0 mile from downtown — and it's parked (`isDriving: false`), so it's actually free.** " +
            "**Demo - 50** is a close second at 1.1 miles, also parked. **Demo - 01** is nearer than most but **already driving at 59 mph** — closest isn't the same as *available*, so it's out.\n\n" +
            "Both candidates' positions are seconds old (last ping ~20s before this query), so this isn't a stale guess — dispatch this off the live fix, not a cached map.",
        },
      ],
      choices: [
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------ ep-exec · board snapshot */
    "ep-exec": {
      id: "ep-exec",
      title: "Ep-Exec · Board snapshot, both fleets",
      events: [
        {
          type: "system",
          text: "Querying **both** demo databases — demo_fh_vegas4 (Las Vegas) and demo_fh4 (Spain)…",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "DeviceStatusInfo", propertySelector: { fields: ["isDriving"] }, resultsLimit: 50 },
          summary: "21 / 50 driving right now (42%)",
          result: "// 50 records → 21 isDriving:true",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "DeviceStatusInfo", propertySelector: { fields: ["isDriving"] }, resultsLimit: 50 },
          summary: "10 / 50 driving right now (20%)",
          result: "// 50 records → 10 isDriving:true",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "4,933 exception events this week",
          result: '{ "result": 4933 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh4", typeName: "ExceptionEvent", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "1,347 exception events this week",
          result: '{ "result": 1347 }',
        },
        {
          type: "chart",
          title: "Utilization right now · vehicles driving / 50",
          bars: [
            { label: "Vegas", value: 21 },
            { label: "Spain", value: 10 },
          ],
        },
        {
          type: "chart",
          title: "Exceptions (7d) & faults (7d) · both fleets",
          bars: [
            { label: "Vegas exc.", value: 4933 },
            { label: "Spain exc.", value: 1347 },
            { label: "Spain faults", value: 599 },
            { label: "Vegas faults", value: 0 },
          ],
        },
        {
          type: "claude",
          text:
            "Same five-minute ask, both fleets, one connector:\n\n" +
            "- **Utilization (right now):** Vegas 21/50 driving (42%) vs Spain 10/50 (20%).\n" +
            "- **Safety (exceptions, 7d):** Vegas logged **4,933** vs Spain's **1,347** — nearly 4× — consistent with " +
            "the fleet-wide speeding pattern already flagged this week.\n" +
            "- **Maintenance (faults, 7d):** flips the other way — Spain logged **599** (one Sprinter van, Demo - 08, " +
            "owns 112 of them) vs Vegas's **0**.\n" +
            "- **Sustainability:** Spain's VINs decode into a real fleet mix — 30 coaches, 15 heavy trucks/tractors, " +
            "5 EV-candidate Sprinter vans. Vegas's VINs are all the same placeholder value, so there's no EV-transition " +
            "conversation to even start there yet — that data gap is its own line item for the board.\n\n" +
            "Two fleets, two different failure modes: Vegas's risk is **behavioral**, Spain's is **mechanical and concentrated**. " +
            "You'd brief each very differently — and you just did, across two databases, without leaving the chat.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "One ask, two fleets, no spreadsheet stitched by hand."],
        },
      ],
      choices: [
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------- ep-dashcam · illustrative clip */
    "ep-dashcam": {
      id: "ep-dashcam",
      title: "Ep-Dashcam · Pull the clip (illustrative)",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "SearchMedia",
          args: { database: "demo_fh_vegas4", deviceId: "b1 (Demo - 01)", fromDate: "18 Jun 00:00", toDate: "18 Jun 23:59", mediaType: "Video" },
          summary: "no media records found",
          result: '{ "result": [] }',
        },
        {
          type: "claude",
          text:
            "`SearchMedia` is a real, live tool — but this demo database has **no dashcam hardware enrolled**, so it " +
            "genuinely comes back empty (Spain's demo DB returns a server error for the same call). I won't fake a " +
            "result for a tool that just told us *no*.\n\n" +
            "What I *can* show you is what this review looks like once camera media is connected — flagged clearly " +
            "below as a reconstruction, not a capture.",
        },
        {
          type: "media",
          illustrative: true,
          src: "media/dashcam-demo01-harsh-brake.mp4",
          poster: "media/dashcam-demo01-harsh-brake.jpg",
          caption: "Forward dashcam, Demo - 01 — hard-braking event (illustrative; generation prompt in media/README.md).",
          fallbackText: "No clip generated yet — see media/README.md for the prompt, then drop the file in media/.",
        },
        {
          type: "claude",
          text:
            "Once footage like this is actually wired up, the ask doesn't change much — *\"pull the clip for that " +
            "speeding flag on Demo - 01\"* — but the connector can now hand you the moment itself, not just the " +
            "telemetry. Pair it with the posted-speed check: the road tells you the limit, the clip tells you what " +
            "the driver saw.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "Same connector, once camera media is enrolled — today it's honest about not having any."],
        },
      ],
      choices: [
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },
  },
};
