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
            "Hi, I'm Claude. Once you connect the Geotab MCP connector, I can read live data from your fleet " +
            "and take actions on it, right here in chat — no separate dashboard.\n\n" +
            "(Worth knowing: the connector itself is just an open MCP server. Copilot, ChatGPT, anything that " +
            "speaks MCP can plug into the same one — I'm not special here.)\n\n" +
            "This particular page is a simulator, so you'll click suggested questions instead of typing and " +
            "the replies are pre-recorded — but the numbers underneath all came from a real Geotab demo fleet. " +
            "Connect it and I'll show you.",
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
            "Connected to Geotab. Two demo fleets are available:\n" +
            "- demo_fh_vegas4 — Las Vegas, USA · 50 vehicles\n" +
            "- demo_fh4 — Spain (Galicia + Valencia) · 50 vehicles",
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
            "You're connected. What do you want to look at?\n\n" +
            "(In the real connector you'd just type this — here, pick one of the options below.)",
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
          label: "💼 Settle a late-delivery dispute (Salesforce)",
          say:
            "A customer is disputing a late delivery yesterday and it's logged as an open Salesforce case. " +
            "Check Demo - 12's actual arrival time at the customer site against the case, and log the proof on the case.",
          next: "ep13-salesforce",
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
            "What makes and models am I actually running on the Spain fleet, " +
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
        {
          label: "❓ Why does Demo - 08 keep faulting?",
          say:
            "Demo - 08 keeps showing up in the fault list. Why — dig into it and don't stop at the first explanation.",
          next: "ep12-investigate",
        },
      ],
    },

    /* ----------------------------------------------------------- ep1 · review */
    "ep1-answer": {
      id: "ep1-answer",
      title: "Ep1 · Weekly review",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "claude",
          text: "Let me pull this together — starting with how many vehicles are actually reporting.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Device" },
          summary: "50",
          result: '{ "result": 50 }',
        },
        {
          type: "claude",
          text: "50, all reporting. Now the question that actually matters: any active faults this week?",
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
          type: "claude",
          text: "Zero. So whatever's going on this week, it's behavior, not breakdowns. Let me look at driving exceptions.",
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
          type: "claude",
          text:
            "Every exception this week is posted-speed speeding, and it's spread across a lot of vehicles, not concentrated on one. " +
            "Last thing before I write this up — let me spot-check HOS rulesets so I know what's actually in play.",
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
            "Okay, here's your week on demo_fh_vegas4.\n\n" +
            "Good news first: 50 vehicles, all reporting, zero active faults. Genuinely clean week on the maintenance side.\n\n" +
            "The thing that needs a look is speeding — and it's not one driver, it's the whole fleet. Posted-speed " +
            "events are spread across a lot of vehicles, with the top offenders within a handful of events of each " +
            "other. That changes the fix: this isn't a conversation with one person, it's a policy thing, plus a live " +
            "alert so it gets caught in the moment instead of next Monday.\n\n" +
            "Two caveats so you don't over-read this: HOS is per-driver only — the API won't return violations " +
            "without naming someone — so what I checked was a spot-check, not a fleet-wide all-clear. And DVIR has " +
            "nothing logged this week, which I'm reading as \"nothing to report,\" not \"nobody's filing them,\" but " +
            "worth a sanity check on your end.\n\n" +
            "(Didn't put trip count in here — the raw all-time counter isn't a meaningful weekly number, so I left it out rather than report something misleading.)",
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
          summary: "SKILL.md written — 90 lines, grounding rules + no-PII default included",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: geotab-weekly-review\n" +
            "description: >-\n" +
            "  Produce a manager-ready weekly fleet review from a Geotab MCP connection —\n" +
            "  fleet size, faults, speeding/harsh driving, HOS, DVIR, and trip activity — as a\n" +
            "  short written brief. Encodes Geotab data quirks and a strict no-PII default so\n" +
            "  the answer is correct and repeatable for anyone on the team.\n" +
            "---\n\n" +
            "# Geotab Weekly Fleet Review\n\n" +
            "## When to use\n" +
            "When the user asks for a weekly/periodic fleet review, a \"Monday morning\" summary, " +
            "or \"how did the fleet do this week.\" Default window: last 7 days.\n\n" +
            "## What to produce\n" +
            "1. Fleet size  2. Faults/maintenance  3. Driving exceptions  4. HOS  5. DVIR  6. Trip activity\n" +
            "End with a headline, a needs-attention list, and 2–3 recommended actions.\n\n" +
            "## Grounding rules (avoid these traps)\n" +
            "- Never report a raw Trip count — GetCountOf on Trip ignores the date window.\n" +
            "- HOS is per-driver — DutyStatusViolation needs a userSearch; treat as a spot-check.\n" +
            "- Don't infer outliers from a capped ExceptionEvent list — aggregate the whole window (e.g. via Ace).\n" +
            "- A clean section is a finding, not a gap — report \"clean week,\" never invent data.\n" +
            "- Summarize repeating demo data — report counts, don't dump raw rows.\n\n" +
            "## No-PII default\n" +
            "- Use device names, never driver names.\n" +
            "- Watch the name field itself — some device names encode a person; fall back to make/model + a non-identifying id.\n" +
            "- Never return emails, phone numbers, employee numbers, or per-person location histories.\n\n" +
            "## Suggested tool flow\n" +
            "GetCountOf Device → Get/GetCountOf FaultData → Get ExceptionEvent (or GetAceResults to rank) → " +
            "spot-check DutyStatusViolation → Get DVIRLog → bounded Get Trip.\n\n" +
            "## Output style\n" +
            "Plain language, short sentences, manager-ready. No jargon, no raw JSON, no PII.\n\n" +
            "(90 lines total — this is the trimmed preview.)",
        },
        {
          type: "claude",
          text:
            "Packaged it as geotab-weekly-review — open the card above if you want to see what's actually in it. " +
            "It's not just a shortcut that replays these same steps; I wrote in the gotchas too (the ExceptionEvent " +
            "page cap, HOS being per-driver, the Trip-count trap) plus a strict no-PII default, so whoever runs it " +
            "gets the careful version every time, not just a faster version.\n\n" +
            "Drop it in your team's shared skills and anyone can just say \"run my weekly review\" and get this same brief, " +
            "without re-explaining any of this to them first.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."],
        },
      ],
      choices: [
        { label: "🚐 What's actually in this fleet?", say: "While we're at it — what make and model are these vehicles, actually?", next: "ep9-fleet" },
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
          type: "claude",
          text: "Let me pull the raw exception events first and see who's leading.",
        },
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
          type: "claude",
          text:
            "On the raw pull, Demo - 01 and Demo - 02 are way out in front. But that's only the newest 200 of about " +
            "5,645 events this week — roughly 3.5% of the data. Before I point a finger at a van, let me have Ace " +
            "aggregate the whole week across the whole fleet instead of just the most recent page.",
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
          type: "claude",
          text:
            "So here's what actually happened. A quick raw pull only returns the newest ~200 events, and those " +
            "happen to cluster on a couple of vans, which makes it look like Demo - 01 is the problem.\n\n" +
            "It isn't — that's a paging artifact, not an answer. Those 200 rows are about 3.5% of the 5,645 events " +
            "this week. Once Ace aggregates the whole week across every vehicle, the top five come back within a " +
            "single event of each other, around 99–100 speeding events each.\n\n" +
            "So it's not one van, it's fleet-wide. The \"why\" isn't a person, it's systemic — shared routes, shared " +
            "limits, shared expectations. That's a different fix: not a conversation with one driver, a policy change " +
            "plus a live guardrail.\n\n" +
            "(To be fair, paging through all 5,645 events or just counting per vehicle properly would've caught this " +
            "too — I just shouldn't have trusted the first page.)",
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
          type: "claude",
          text: "On it — creating a fleet-wide posted-speed rule first.",
        },
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
          type: "claude",
          text: "Rule's live. Now routing the alert to your fleet manager.",
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
            "Done — fleet-wide posted-speed rule is live, and the alert's routed to one fleet manager (by name, no " +
            "email shown). Any vehicle over the posted limit gets flagged in the moment now, not when you run next " +
            "week's review.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Stop guessing why. Ask."] },
      ],
      choices: [
        { label: "🔧 Now check for faults too", say: "While that alert is live, show me the maintenance worklist for this fleet.", next: "ep8-maintenance" },
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
          type: "claude",
          text: "Let me check today's news rather than rely on what I already know about Valencia's low-emission zone.",
        },
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
          type: "claude",
          text:
            "It's actually messier than I expected — 278 cameras already live, a €200 statutory fine on paper, but " +
            "the ordinance got rejected in December, so right now it's monitoring, not fining. Let me check if any " +
            "of your vehicles are even in that area before we worry about it.",
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
            "Good thing I checked today's news instead of going off what I already knew — Valencia's low-emission " +
            "zone is genuinely in flux right now. It covers about 27.8 km², most of the city, and 278 ANPR cameras " +
            "are already switched on. The statutory fine for a non-compliant entry is €200 — but the city's ordinance " +
            "was actually rejected back in December, so for now the cameras are monitoring, not fining, and even the " +
            "sources I found disagree on whether sanctions have started. Restrictions are supposed to phase in through " +
            "2026 to 2028, with cleaner labels favored as it tightens.\n\n" +
            "And yes, this is relevant to you — Demo - 23 and Demo - 31 are both operating in the Valencia area right " +
            "now, so whatever the final rules end up being, you're exposed.\n\n" +
            "One caveat: this is moving week to week, so I'd re-confirm on valencia.es before you act on it.",
        },
      ],
      choices: [
        {
          label: "🗺️ Create the zone + entry alert",
          say:
            "Create a zone in Geotab matching Valencia's ZBE and add an alert for when our vehicles enter it.",
          next: "ep3-prefs",
        },
        { label: "🚐 What are the affected vehicles?", say: "What make and model are Demo - 23 and Demo - 31?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep3-prefs": {
      id: "ep3-prefs",
      title: "Ep3 · Alert preferences",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text:
            "Before I wire this up, two quick questions so it actually fits how you work:\n\n" +
            "First, what should trigger it — just entries, or entries and exits too (handy if you want confirmation a vehicle cleared the zone again)?\n\n" +
            "Second, who should get it — one fleet manager, or the whole Valencia ops group?",
        },
      ],
      choices: [
        {
          label: "🔔 Entry only → one manager",
          say: "Entry alerts only, sent to one fleet manager.",
          next: "ep3-action",
        },
        {
          label: "🔔 Entry + exit → whole ops group",
          say: "Alert on both entry and exit, sent to the whole Valencia ops group.",
          next: "ep3-action-wide",
        },
      ],
    },

    "ep3-action": {
      id: "ep3-action",
      title: "Ep3 · Create zone + rule",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text: "Starting with the zone itself — drawing the ZBE polygon in Geotab.",
        },
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
          type: "claude",
          text: "Zone's in. Now the entry rule, since that's what you asked for.",
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
          type: "claude",
          text: "And routing the alert to your fleet manager.",
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
            "Done — the ZBE València zone is created, entry alert's live, routed to one manager. You'll find out the " +
            "moment enforcement actually switches on, instead of from a fine in the mail.\n\n" +
            "If you want to tighten it later, you could restrict the alert to non-compliant labels only — the older " +
            "vans without an ECO or Zero badge — but that's optional for now.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "The news changed. Your fleet already adapted."] },
      ],
      choices: [
        { label: "🗺️ Show the zone on a map", say: "Show me the ZBE zone and the affected vehicles on a map.", next: "ep3-map" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep3-action-wide": {
      id: "ep3-action-wide",
      title: "Ep3 · Create zone + rule (entry+exit, group)",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text: "Starting with the zone itself — drawing the ZBE polygon in Geotab.",
        },
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
          type: "claude",
          text: "Zone's in. Now the rule — you wanted both entry and exit covered.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Rule", entity: { name: "ZBE València — entry & exit" } },
          summary: "Entry + exit rule live",
          write: true,
          result: '{ "result": "Ruleb…zbe-entry-exit" }',
        },
        {
          type: "claude",
          text: "And routing the alert to the whole Valencia ops group, not just one manager.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh4", typeName: "Notification", entity: { recipient: "Valencia ops group" } },
          summary: "Alert routed to the whole ops group",
          write: true,
          result: '{ "result": "Notificationb…" }',
        },
        {
          type: "claude",
          text:
            "Done — ZBE València zone created, alerts cover both entry and exit, and it's going to the whole Valencia " +
            "ops group, not just one person. Anyone on that team will see a vehicle cross the line either direction.\n\n" +
            "Same optional next step as before if you want it tighter later: restrict to non-compliant labels only.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "The news changed. Your fleet already adapted."] },
      ],
      choices: [
        { label: "🗺️ Show the zone on a map", say: "Show me the ZBE zone and the affected vehicles on a map.", next: "ep3-map" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep3-map": {
      id: "ep3-map",
      title: "Ep3 · ZBE zone on a map",
      events: [
        {
          type: "map",
          title: "ZBE València · zone + affected vehicles",
          zone: {
            label: "ZBE València",
            labelX: 50,
            labelY: 78,
            points: [
              [38, 22], [52, 18], [66, 26], [72, 38], [70, 52],
              [74, 62], [64, 72], [50, 70], [40, 60], [30, 50],
              [28, 36], [34, 28],
            ],
          },
          pins: [
            { label: "Demo - 23", x: 44, y: 40, status: "busy" },
            { label: "Demo - 31", x: 60, y: 52, status: "busy" },
          ],
        },
        {
          type: "claude",
          text: "Both Demo - 23 and Demo - 31 are sitting right inside the zone boundary right now — exactly the two the new alert's going to be watching.",
        },
      ],
      choices: [
        { label: "🚐 What make and model are these?", say: "What make and model are Demo - 23 and Demo - 31, exactly?", next: "ep9-fleet" },
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
          type: "claude",
          text: "Five things, one thread — let's just go in order. Starting with the depot geofence.",
        },
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
          type: "claude",
          text: "That's in. Next, the idling alert.",
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
          type: "claude",
          text: "Live — anything idling past 15 minutes gets flagged. Now clearing Demo - 06's acknowledged faults from its service.",
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
          type: "claude",
          text: "Cleared. Now the Valencia region group.",
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
          type: "claude",
          text: "Created. Last one — routing the idling alerts to a manager.",
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
            "All five done. To recap so you've got it for the record: a 300 m geofence around the main depot, an " +
            "idling alert past 15 minutes, Demo - 06's acknowledged faults cleared post-service, your Valencia " +
            "vehicles grouped into one reportable unit, and the idling alerts routed to a manager.\n\n" +
            "Nothing left to set up by hand — it's all live now.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "It doesn't just report. It acts."] },
      ],
      choices: [
        { label: "🔧 Now triage the faults", say: "Now show me the maintenance worklist for this fleet.", next: "ep8-maintenance" },
        { label: "🚐 What's in the new Valencia group?", say: "What kind of vehicles ended up in the Valencia Region group?", next: "ep9-fleet" },
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
        { type: "system", text: "This flow spans three connectors: Geotab + Gmail + Google Calendar." },
        {
          type: "claude",
          text: "Let me pull Demo - 06's fault first so I know what we're actually dealing with.",
        },
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
          type: "claude",
          text: "Device unplugged plus a GPS antenna fault — it'll stop reporting position until someone checks it. Let me grab the make, model, and plate so the garage knows what's actually coming in.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { id: "b6" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber", "licensePlate"] } },
          summary: "Demo - 06 — Mercedes-Benz Sprinter, plate VAL-4471-B",
          result: '[\n  { "name": "Demo - 06", "vehicleIdentificationNumber": "WDB9076571P106588", "licensePlate": "VAL-4471-B" }\n]',
        },
        {
          type: "claude",
          text: "Mercedes-Benz Sprinter, plate VAL-4471-B. Drafting the email to the garage now — leaving it in Drafts, not sending it without you looking first.",
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "garage@test-mailbox.example", subject: "Demo - 06 (Mercedes-Benz Sprinter, plate VAL-4471-B) — fault check please" },
          summary: "Draft saved (NOT sent)",
          write: true,
          result: '{ "draftId": "r-…", "status": "in Drafts, awaiting your review" }',
        },
        {
          type: "claude",
          text: "Saved, not sent. While I'm in here, let me also hold a tentative service slot so you don't lose the booking window waiting to reply.",
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
            "Okay, here's where that ended up across three tools. Demo - 06 logged a device-unplugged / GPS antenna " +
            "fault on the 18th — it's a Mercedes-Benz Sprinter, plate VAL-4471-B, and it'll stop reporting position " +
            "until it's checked. I drafted an email to the garage with the vehicle and fault details, but left it in " +
            "Drafts — it's not going out until you look at it. And I put a tentative slot on the calendar for tomorrow " +
            "at 09:00 so you don't lose the booking window in the meantime.\n\n" +
            "The draft's sitting there whenever you're ready.\n\n" +
            "(This demo points at a test mailbox and calendar, never a real recipient.)",
        },
      ],
      choices: [
        { label: "📤 Send the draft now", say: "It looks right — send the draft now.", next: "ep5-send" },
        { label: "🗓️ Just confirm the slot, hold the email", say: "Leave the email in Drafts for now — just confirm the calendar hold.", next: "ep5-hold" },
      ],
    },

    "ep5-send": {
      id: "ep5-send",
      title: "Ep5 · Send the draft",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "gmail",
          name: "send_message",
          args: { draftId: "r-…" },
          summary: "Sent to garage@test-mailbox.example",
          write: true,
          result: '{ "messageId": "r-…", "status": "sent" }',
        },
        {
          type: "claude",
          text: "Sent. Garage has the fault details and the plate now, and the 09:00 slot's already on the calendar waiting for them to confirm.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet, connected to the tools you already use."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 06?", say: "What make and model is Demo - 06?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep5-hold": {
      id: "ep5-hold",
      title: "Ep5 · Hold the email, keep the slot",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text: "Got it — email stays untouched in Drafts, and I'll leave the 09:00 slot on the calendar so the booking window doesn't slip while you decide. Nothing's gone out.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet, connected to the tools you already use."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 06?", say: "What make and model is Demo - 06?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------- ep13 · Salesforce */
    "ep13-salesforce": {
      id: "ep13-salesforce",
      title: "Ep13 · Geotab + Salesforce",
      db: "demo_fh4",
      events: [
        { type: "system", text: "This flow spans two connectors: Geotab + Salesforce." },
        {
          type: "claude",
          text: "Let's start with the GPS log — where was Demo - 12 actually yesterday?",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "LogRecord", search: { deviceSearch: { id: "ba" }, fromDate: "yesterday 00:00", toDate: "yesterday 23:59" } },
          summary: "Demo - 12 arrived at the customer site 14:32 yesterday",
          result:
            '[\n  { "device": "Demo - 12", "latitude": 41.123, "longitude": 2.456, "dateTime": "2026-06-18T14:32Z", "note": "matches customer site geofence" }\n]',
        },
        {
          type: "claude",
          text: "Inside the customer's geofence at 14:32, well before 16:00. Now let me find the case this is actually about.",
        },
        {
          type: "tool",
          server: "salesforce",
          name: "get_case",
          args: { caseNumber: "00012345" },
          summary: "Case 00012345 — \"Delivery arrived after 16:00\" — Open",
          result: '{ "caseNumber": "00012345", "subject": "Delivery arrived after 16:00", "status": "Open", "account": "Test Account Ltd." }',
        },
        {
          type: "claude",
          text: "That's the one — claiming a late delivery. Logging the GPS timestamp on it as proof.",
        },
        {
          type: "tool",
          server: "salesforce",
          name: "add_case_comment",
          args: { caseNumber: "00012345", body: "Geotab GPS log: Demo - 12 arrived on-site 14:32 (18 Jun), inside the customer geofence — well before the 16:00 the case describes." },
          summary: "Comment logged on Case 00012345",
          write: true,
          result: '{ "commentId": "00a…", "status": "added" }',
        },
        {
          type: "claude",
          text:
            "Quick summary across both tools: Demo - 12's GPS log puts it inside the customer's geofence at 14:32 " +
            "yesterday, not after 16:00 like the case claims. I found the open case — 00012345, \"Delivery arrived " +
            "after 16:00\" — and logged that timestamp as a comment directly on it.\n\n" +
            "Whoever picks it up next sees the proof right there, no separate spreadsheet, no \"let me go check the tracker.\"\n\n" +
            "(Demo's pointed at a test Salesforce org, not a real customer record.)",
        },
      ],
      choices: [
        { label: "✉️ Also close the case and notify the rep", say: "Go ahead and close the case, and let the account rep know it's resolved.", next: "ep13-close" },
        { label: "📌 Just leave the proof logged, don't close it", say: "Leave it logged on the case for now — don't close it yet.", next: "ep13-leaveopen" },
      ],
    },

    "ep13-close": {
      id: "ep13-close",
      title: "Ep13 · Close the case",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text: "Closing it with the GPS log as the resolution reason.",
        },
        {
          type: "tool",
          server: "salesforce",
          name: "update_case",
          args: { caseNumber: "00012345", status: "Closed", reason: "Resolved — GPS log confirms on-time arrival" },
          summary: "Case 00012345 closed",
          write: true,
          result: '{ "caseNumber": "00012345", "status": "Closed" }',
        },
        {
          type: "claude",
          text: "Closed. Letting the account rep know now so they can follow up with the customer.",
        },
        {
          type: "tool",
          server: "salesforce",
          name: "notify_owner",
          args: { caseNumber: "00012345", message: "Closed — GPS proof attached, arrival was on time." },
          summary: "Account rep notified",
          write: true,
          result: '{ "status": "notified" }',
        },
        {
          type: "claude",
          text: "Case 00012345 is closed, GPS timestamp logged as the reason, and the account rep's been notified to follow up with the customer directly.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet's truth, dropped straight into the CRM."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 12?", say: "What make and model is Demo - 12?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep13-leaveopen": {
      id: "ep13-leaveopen",
      title: "Ep13 · Leave the case open",
      db: "demo_fh4",
      events: [
        {
          type: "claude",
          text: "Done — the GPS proof's logged as a comment on Case 00012345, but I'm leaving the case itself open so whoever's handling the customer conversation can close it when they're ready.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet's truth, dropped straight into the CRM."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 12?", say: "What make and model is Demo - 12?", next: "ep9-fleet" },
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
            '{\n  "answer": "1. Demo - 08: 188\\n2. Demo - 15: 61\\n3. Demo - 01: 54\\n4. Demo - 16: 47\\n5. Demo - 04: 39",\n' +
            '  "chart": { "type": "bar", "title": "Top 5 Vehicles by Number of Speeding Events" },\n' +
            '  "reasoning": "Outcome / Understanding / Process …"\n}',
        },
        {
          type: "claude",
          text:
            "That's Geotab Ace doing its thing — I asked in plain English, no SQL, and it wrote the query itself, " +
            "ran it across the whole fleet, and handed back a ranked answer plus a chart and its reasoning.\n\n" +
            "Look at the shape of it though: Demo - 08 is running away with it at 188, roughly 3x the next vehicle, " +
            "and everyone else trails off normally after that. That's the same van that's already come up twice this " +
            "review for faults. I'd have a quick word with that driver before it turns into a third, seemingly unrelated, problem.",
        },
        {
          type: "chart",
          title: "Top 5 vehicles by speeding events · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 08", value: 188 },
            { label: "Demo - 15", value: 61 },
            { label: "Demo - 01", value: 54 },
            { label: "Demo - 16", value: 47 },
            { label: "Demo - 04", value: 39 },
          ],
        },
      ],
      choices: [
        { label: "🧠 Show Ace's reasoning", say: "Show me how Ace got there.", next: "ep7-reasoning" },
        { label: "🔔 Set a fleet-wide speed alert", say: "Set up a posted-speed alert across the fleet and send it to one fleet manager.", next: "ep2-action" },
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
            "Ace shows its work, not just the answer. Here's what it gave back: it understood you wanted the five " +
            "vehicles with the most speeding events over the last 7 days, with a count for each. To get there, it " +
            "went through the fleet's event data for that window, isolated speeding events per vehicle, counted and " +
            "ranked them, and returned the top five — Demo - 08 at 188, then 15, 01, 16, and 04 trailing down to 39.\n\n" +
            "Useful to have that trail if a number ever looks off and you want to know exactly what it counted.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask in plain English. Ace does the analysis."] },
      ],
      choices: [
        { label: "🔧 Now ask Ace about faults", say: "Now ask Ace which vehicles have the most faults this week.", next: "ep8-maintenance" },
        { label: "📋 Run the full weekly review", say: "Now give me the full weekly fleet review.", next: "ep1-answer" },
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
          type: "claude",
          text: "Let me count this week's fault records first.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh4", typeName: "FaultData", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "599 fault records this week",
          result: '{ "result": 599 }',
        },
        {
          type: "claude",
          text: "599 sounds like fires everywhere. Before I jump to that, let me have Ace break it down per vehicle — that number on its own doesn't tell you where to actually look.",
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
          type: "claude",
          text:
            "599 fault records this week sounds like a fire to fight everywhere. It isn't, really.\n\n" +
            "Once Ace breaks it down per vehicle, one van owns most of it — Demo - 08 logged 112 faults, about 1 in " +
            "5 of the fleet's total. Everything else is in the single digits, 4 to 7 each.\n\n" +
            "So your worklist basically writes itself: pull Demo - 08 in first, this isn't 50 problems, it's " +
            "basically one. The other four can wait. And for context, the Vegas fleet had zero active faults this " +
            "week, so this really is specific to this van rather than something systemic.",
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
      ],
      choices: [
        { label: "🚐 What is Demo - 08, exactly?", say: "What make and model is Demo - 08?", next: "ep9-fleet" },
        { label: "🔎 Why does it keep faulting? Dig deeper", say: "Don't stop there — why does Demo - 08 keep faulting? Dig into it.", next: "ep12-investigate" },
        { label: "📧 Book it into the garage now", say: "Pull Demo - 08's fault details, draft an email to the garage, and put a tentative service slot on my calendar for tomorrow morning.", next: "ep5-answer" },
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
          type: "claude",
          text: "Let me pull the VINs across the fleet first.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "50 vehicles, 50 distinct VINs",
          result:
            '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "WMAR62ZZ5LT034475" },\n' +
            '  { "name": "Demo - 06", "vehicleIdentificationNumber": "WDB9076571P106588" },\n' +
            '  { "name": "Demo - 08", "vehicleIdentificationNumber": "WDB9076571P106590" },\n' +
            '  { "name": "Demo - 21", "vehicleIdentificationNumber": "VF611A364JD011741" },\n' +
            '  … (50 distinct VINs, but only 5 distinct WMI+VDS prefixes — same manufacturer/model codes repeat, serials don\'t)\n]',
        },
        {
          type: "claude",
          text: "Every vehicle has its own VIN, like a real fleet — but the first 11 characters (manufacturer + model code) repeat across groups, only the serial differs. So decoding one VIN per group tells me the model for all 50.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["WMAR62ZZ5LT034475", "WDB9076571P106590", "WDF9634031C001659", "VF611A364JD011741", "WEB63372313280840"] },
          summary: "MAN coach · Mercedes Sprinter · Actros · Renault T · Mercedes Intouro",
          result:
            '[\n  { "make": "MAN", "model": "Lion\'s Intercity C", "year": "2020" },\n' +
            '  { "make": "Mercedes-Benz", "model": "Sprinter 907" },\n' +
            '  { "make": "Mercedes-Benz", "model": "New Actros" },\n' +
            '  { "make": "Renault", "model": "T", "year": "2018", "engine": "Euro 6", "body": "Tractor" },\n' +
            '  { "make": "Mercedes-Benz", "model": "Intouro", "plant": "Istanbul" }\n]',
        },
        {
          type: "claude",
          text:
            "Okay, decoded. This is a passenger-transport operation, not a delivery fleet — 30 intercity coaches " +
            "(25 MAN Lion's Intercity plus 5 Mercedes-Benz Intouro), 15 heavy goods units (10 Mercedes Actros and 5 " +
            "Renault T tractors, Euro 6), and just 5 light vans — Mercedes-Benz Sprinters, Demo - 06 through 10, " +
            "which includes your fault hot-spot Demo - 08.\n\n" +
            "That mix actually matters for the EV question you might be heading toward: the 5 Sprinters are realistic " +
            "conversion candidates — light, urban, predictable routes. The coaches and 40-tonne tractors aren't close to viable yet.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "It knows what you actually drive — not just how many."],
        },
      ],
      choices: [
        { label: "📊 Show that as a chart", say: "Show me the fleet composition as a chart.", next: "ep9-fleet-chart" },
        { label: "🌍 Which of these hit the Valencia zone?", say: "Which of these vehicles drive through Valencia's low-emission zone?", next: "ep3-answer" },
        { label: "🔋 Dig into the EV-conversion case", say: "Make the case for converting the Sprinters to EV — what would it take?", next: "ep9-ev" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet-chart": {
      id: "ep9-fleet-chart",
      title: "Ep9 · Fleet composition chart",
      events: [
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
          text: "30 coaches, 15 heavy goods units, 5 light vans — the Sprinters are really the only segment worth a second look for EV conversion.",
        },
      ],
      choices: [
        { label: "🌍 Which of these hit the Valencia zone?", say: "Which of these vehicles drive through Valencia's low-emission zone?", next: "ep3-answer" },
        { label: "🔋 Dig into the EV-conversion case", say: "Make the case for converting the Sprinters to EV — what would it take?", next: "ep9-ev" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-ev": {
      id: "ep9-ev",
      title: "Ep9 · EV-conversion case (Sprinters)",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Trip", search: { deviceSearch: { ids: ["Demo - 06", "Demo - 07", "Demo - 08", "Demo - 09", "Demo - 10"] }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "Sprinters average ~62 mi/day, max single trip ~140 mi",
          result: '{ "avgDailyMiles": 62, "maxSingleTrip_mi": 140, "longestGapBetweenTrips_h": 9 }',
        },
        {
          type: "claude",
          text:
            "The five Sprinters average around 62 miles a day, longest single trip about 140 miles, and there's a " +
            "roughly 9-hour gap overnight between routes. That's comfortably inside what mid-size EV vans can do on " +
            "a charge, and that overnight gap doubles nicely as charging time.\n\n" +
            "Compare that to the coaches or the Actros/Renault tractors — long-haul, heavier loads, tight turnarounds, " +
            "none of which fits an EV profile yet. The Sprinters are genuinely the one part of this fleet where a " +
            "swap is a near-term move, not a someday one.\n\n" +
            "(Worth flagging: the daily-mileage figures here are illustrative for the demo, directionally consistent " +
            "with how Sprinters get used, but not a live total I'd quote to a vendor.)",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "It knows what you actually drive — not just how many."] },
      ],
      choices: [
        { label: "🌍 Check them against the Valencia zone", say: "Do these same Sprinters drive through Valencia's low-emission zone?", next: "ep3-answer" },
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
            "When a driver disputes a speeding flag, you shouldn't have to argue from memory. I pulled the posted " +
            "road speed along Demo - 01's actual route on the 18th, segment by segment.\n\n" +
            "The route ran through limits from 10 up to 65 mph — fast stretches cap at 65 (105 km/h), with plenty of " +
            "35–45 mph surface roads mixed in. A handful of segments come back as no-limit-on-file or flagged as " +
            "estimates, so I'd treat those specific spots as low-confidence rather than solid evidence.\n\n" +
            "That's the difference between \"you were speeding\" and \"on this 35-mph stretch at 00:13 you were over\" " +
            "— a coaching conversation grounded in the actual road, not a hunch. It also backs up the fleet-wide " +
            "speeding finding from before: the limits are real and checkable, so the fix really is policy plus live alerts.",
        },
      ],
      choices: [
        { label: "🔔 Set a fleet-wide speed alert", say: "Set up a posted-speed alert across the fleet and send it to one fleet manager.", next: "ep2-action" },
        { label: "📹 Pull the dashcam from that moment", say: "Now pull the dashcam clip for that segment so I can see what actually happened.", next: "ep-dashcam" },
        { label: "🚐 What kind of vehicle is Demo - 01?", say: "What make and model is Demo - 01?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------------------- ep12 · why-investigation loop */
    "ep12-investigate": {
      id: "ep12-investigate",
      title: "Ep12 · Investigation loop",
      db: "demo_fh4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "FaultData", search: { deviceSearch: { id: "b6" }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "Demo - 08 — 14 faults in 30 days, 9 of them the same code",
          result:
            '[\n  { "diagnostic": "DeviceHasBeenUnpluggedId", "count": 9 },\n' +
            '  { "diagnostic": "GpsAntennaShortCircuitId", "count": 3 },\n' +
            '  { "diagnostic": "AllPowerRemovedId", "count": 2 }\n]',
        },
        {
          type: "claude",
          text:
            "Before I read anything into that, let me check if it's just exposure — a van on the road more will naturally rack up more faults. Pulling its mileage against the fleet average.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Trip", search: { deviceSearch: { id: "b6" }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "Demo - 08 — 2,140 mi in 30 days vs. fleet avg 5,800 mi",
          result: '{ "device": "Demo - 08", "distance_mi": 2140, "fleetAvg_mi": 5800 }',
        },
        {
          type: "claude",
          text:
            "Opposite of what I expected — Demo - 08 has driven less than a third of the fleet average this month. Fewer miles but more faults rules exposure out, if anything.\n\n" +
            "Next guess: harsh driving forcing false positives on engine sensors. Let me check its exception events.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "ExceptionEvent", search: { deviceSearch: { id: "b6" }, ruleSearch: { id: "HarshBrakingId" }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "Demo - 08 — 3 harsh-braking events in 30 days (fleet avg: 2.5)",
          result: '{ "device": "Demo - 08", "harshEvents": 3, "fleetAvg": 2.5 }',
        },
        {
          type: "claude",
          text:
            "That's a wash too — close to fleet average, nothing pointing to rough handling. So it's not driver behavior either.\n\n" +
            "Back to the fault breakdown: 9 of the 14 are the exact same code, device unplugged. Let me pull the dates and see if they cluster.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "FaultData", search: { deviceSearch: { id: "b6" }, diagnosticSearch: { id: "DeviceHasBeenUnpluggedId" }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "all 9 dated after 22 May — none before",
          result:
            '[\n  { "dateTime": "2026-05-22T…" }, { "dateTime": "2026-05-24T…" }, { "dateTime": "2026-05-29T…" },\n' +
            '  { "dateTime": "2026-06-02T…" }, "… 5 more, all after 22 May" ]',
        },
        {
          type: "claude",
          text:
            "There it is — all 9 \"device unplugged\" faults start on May 22nd, none before. That's not random wear, that's one point in time where something changed. Looks like a loose power connector or harness — an intermittent disconnect, not nine separate unrelated incidents.\n\n" +
            "So it took three rounds to get here: not exposure, not the driver, just one connector since one date. Worth having the shop check the harness rather than chasing each fault individually.",
        },
      ],
      choices: [
        {
          label: "📧 Fault → email garage → book service",
          say:
            "Pull Demo - 08's fault details, draft an email to the garage about the loose power connector, and put a tentative service slot on my calendar for tomorrow morning.",
          next: "ep5-answer",
        },
        { label: "🔧 Now triage the rest of the fleet", say: "Now show me the maintenance worklist for this fleet.", next: "ep8-maintenance" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
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
          type: "claude",
          text:
            "Pulled live positions for the whole fleet rather than just guessing.\n\n" +
            "Demo - 45 is closest — about 1.0 mile from downtown — and it's parked, so it's actually free. Demo - 50 is a close second at 1.1 miles, also parked. Demo - 01 is nearer than most but already driving at 59 mph, so closest isn't the same as available — it's out.\n\n" +
            "Both candidates' positions are seconds old (last ping ~20s before this query), so dispatch off the live fix, not a cached map.",
        },
      ],
      choices: [
        { label: "📊 Show distances as a chart", say: "Show me each vehicle's distance from the job as a chart.", next: "ep-dispatch-chart" },
        { label: "🗺️ Show me on a map", say: "Show me where these vehicles are on a map.", next: "ep-dispatch-map" },
        { label: "🚐 Dispatch Demo - 45", say: "Send Demo - 45 to the job.", next: "ep-dispatch-send-45" },
        { label: "🚐 Dispatch Demo - 50 instead", say: "Actually, send Demo - 50 to the job.", next: "ep-dispatch-send-50" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep-dispatch-send-45": {
      id: "ep-dispatch-send-45",
      title: "Ep-Dispatch · Dispatch Demo - 45",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Trip", entity: { device: "Demo - 45", note: "Dispatched to downtown job" } },
          summary: "Job assigned to Demo - 45",
          write: true,
          result: '{ "result": "Tripb…dispatch-45" }',
        },
        {
          type: "claude",
          text: "Demo - 45 is dispatched — the closest free unit, about 1.0 mile out. Demo - 50 stays available as backup.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Dispatch off the live fix, not a cached map."] },
      ],
      choices: [
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep-dispatch-send-50": {
      id: "ep-dispatch-send-50",
      title: "Ep-Dispatch · Dispatch Demo - 50",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Trip", entity: { device: "Demo - 50", note: "Dispatched to downtown job" } },
          summary: "Job assigned to Demo - 50",
          write: true,
          result: '{ "result": "Tripb…dispatch-50" }',
        },
        {
          type: "claude",
          text: "Demo - 50 is dispatched — 1.1 miles out and free. Noted that Demo - 45 was the closer option if you need a faster ETA next time.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Dispatch off the live fix, not a cached map."] },
      ],
      choices: [
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------ ep-dispatch-map · live positions map */
    "ep-dispatch-map": {
      id: "ep-dispatch-map",
      title: "Ep-Dispatch · Live positions map",
      events: [
        {
          type: "map",
          title: "Live positions vs. the job · downtown Las Vegas",
          pins: [
            { label: "Job site", x: 50, y: 48, status: "target" },
            { label: "Demo - 45 (free)", x: 36, y: 60, status: "free", value: 1.0 },
            { label: "Demo - 50 (free)", x: 64, y: 38, status: "free", value: 1.1 },
            { label: "Demo - 01 (busy)", x: 74, y: 68, status: "busy", value: 1.6 },
          ],
        },
        {
          type: "claude",
          text: "Both free units are tucked right around the job site — Demo - 45 a touch closer, Demo - 50 just over a block further. Demo - 01 is out past them and still moving, so it's not in play.",
        },
      ],
      choices: [
        { label: "🚐 Dispatch Demo - 45", say: "Send Demo - 45 to the job.", next: "ep-dispatch-send-45" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------ ep-dispatch-chart · distance chart */
    "ep-dispatch-chart": {
      id: "ep-dispatch-chart",
      title: "Ep-Dispatch · Distance chart",
      events: [
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
          text: "Demo - 45 and Demo - 50 are both under a mile and a half out and free — either works. Demo - 01 is technically closer but already on a job.",
        },
      ],
      choices: [
        { label: "🚐 Dispatch Demo - 50", say: "Send Demo - 50 to the job.", next: "ep-dispatch-send-50" },
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
          type: "claude",
          text: "Starting with utilization right now — Vegas first.",
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
          type: "claude",
          text: "Vegas is at 42%. Now Spain.",
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
          type: "claude",
          text: "Spain's at 20% — about half Vegas's utilization. Next, safety: exception events this week, Vegas first.",
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
          type: "claude",
          text: "4,933 for Vegas. And Spain's count for the same week.",
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
          type: "claude",
          text:
            "Putting both fleets side by side: utilization right now is Vegas 21/50 driving (42%) vs Spain 10/50 (20%). On safety, Vegas logged 4,933 exceptions this week vs Spain's 1,347 — nearly 4x — which lines up with the fleet-wide speeding pattern already flagged.\n\n" +
            "Maintenance flips the other way: Spain logged 599 faults (one Sprinter van, Demo - 08, owns 112 of them) vs Vegas's zero. And on sustainability, Spain's VINs decode into a real fleet mix — 30 coaches, 15 heavy trucks/tractors, 5 EV-candidate Sprinter vans — while Vegas's VINs are all the same placeholder value, so there's no EV-transition conversation to even start there. That data gap is its own line item for the board.\n\n" +
            "Two fleets, two different failure modes: Vegas's risk is behavioral, Spain's is mechanical and concentrated. Worth briefing the board on each separately since they need different fixes.",
        },
      ],
      choices: [
        { label: "📊 Break that down in charts", say: "Break that down in charts.", next: "ep-exec-chart" },
        { label: "🚦 Drill into Vegas — the behavioral risk", say: "Drill into Vegas first — why is speeding up there?", next: "ep2-answer" },
        { label: "🔧 Drill into Spain — the mechanical risk", say: "Drill into Spain first — what's going on with all those faults?", next: "ep8-maintenance" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ------------------------------------------------------ ep-exec-chart · both-fleet charts */
    "ep-exec-chart": {
      id: "ep-exec-chart",
      title: "Ep-Exec · Utilization & exceptions charts",
      events: [
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
          text: "Vegas drives more and breaks the rules more; Spain drives less but breaks down more. Same fleet size, opposite risk profile.",
        },
      ],
      choices: [
        { label: "🚦 Drill into Vegas speeding", say: "Drill into Vegas — why is speeding up there?", next: "ep2-answer" },
        { label: "🔧 Drill into Spain faults", say: "Drill into Spain — what's going on with all those faults?", next: "ep8-maintenance" },
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
            "SearchMedia is a real, live tool, but this demo database has no dashcam hardware enrolled, so it genuinely " +
            "comes back empty (Spain's demo DB returns a server error for the same call). I'm not going to fake a result " +
            "for a tool that just told us no.\n\n" +
            "What I can show you is what this review looks like once camera media is connected — flagged clearly below " +
            "as a reconstruction, not a capture.",
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
            "speeding flag on Demo - 01\"* — but I'd be able to hand you the moment itself, not just the telemetry. " +
            "Pair it with the posted-speed check: the road tells you the limit, the clip tells you what the driver saw.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "Same connector, once camera media is enrolled — today it's honest about not having any."],
        },
      ],
      choices: [
        { label: "🔔 Set the speed alert anyway", say: "Set up that posted-speed alert across the fleet regardless.", next: "ep2-action" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },
  },
};
