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
 *               { type:"assistant", text }                     assistant prose (markdown)
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
/* ------------------------------------------- Grounding on the sample-data store
 * The Safety / Maintenance / Operations / Agentic scenarios draw their charts
 * (and some tool results) from data/sample-data.js — the single source of truth
 * (window.SAMPLE_DATA). Change a number there and every node that quotes it
 * follows. `D` is that store; `bars()` turns a list of objects into chart bars.
 */
var D = (typeof window !== "undefined" && window.SAMPLE_DATA) ? window.SAMPLE_DATA : {};
function bars(list, labelKey, valueKey) {
  return (list || []).map(function (o) { return { label: o[labelKey], value: o[valueKey] }; });
}

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
          type: "assistant",
          text:
            "Hi, I'm an assistant. Once you connect the Geotab MCP connector, I can read live data from your fleet " +
            "and take actions on it, right here in chat — no separate dashboard.\n\n" +
            "(Worth knowing: MCP is the *Model Context Protocol* — an open standard for connecting AI assistants " +
            "to tools — and the connector is just an open MCP server. Copilot, ChatGPT, Claude — anything " +
            "that speaks MCP can plug into the same one. No single assistant is special here.)\n\n" +
            "One practical detail: the MCP server does not automatically know or enumerate every database your " +
            "account can access. You need to know the database name you want, then ask the assistant to use it.\n\n" +
            "This particular page is a simulator, so you'll click suggested questions instead of typing and " +
            "the replies are pre-recorded — but the numbers underneath all came from real Geotab demo fleets. " +
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
          result: '{ "authenticated": true }',
        },
        {
          type: "system",
          text:
            "Connected to Geotab. The connector does not return a master list of every database you can access; " +
            "the user needs to know which database name to ask for. For this simulator, we use two known demo database names:\n" +
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
          type: "assistant",
          text:
            "You're connected. What do you want to look at?\n\n" +
            "(In the real connector you'd just type this — here, pick one of the options below. " +
            "Don't overthink the choice: every answer offers natural follow-ups, so any door leads to the " +
            "others. **⭐ Start here** is the fastest tour.)",
        },
      ],
      choices: [
        /* ⭐ Start here — the flagship flows lead, so the main ones aren't lost in the list */
        {
          group: "⭐ Start here",
          recommended: true,
          label: "📋 The Monday morning review",
          say:
            "Give me my weekly fleet review for the last 7 days — faults, idling and harsh driving, " +
            "HOS violations, DVIR gaps, and trip activity. Keep it to a short brief I can act on.",
          next: "ep1-answer",
        },
        {
          group: "⭐ Start here",
          label: "🛡️ Assess my top 3 safety risks + fixes",
          say: "Assess my fleet for the top three safety risks and suggest corrective actions.",
          next: "ep-agentic-safety",
        },
        {
          group: "⭐ Start here",
          label: "🦆 Build a MotherDuck warehouse",
          say: "Teach me how to build a Geotab warehouse in MotherDuck using MCP calls — setup, first load, and incremental refresh.",
          next: "warehouse-intro",
        },
        {
          group: "⭐ Start here",
          label: "💰 Where is my fleet leaking money?",
          say: "Where is my fleet leaking money — total the recoverable savings and build me the ROI case.",
          next: "ep-roi",
        },

        {
          group: "🛟 Safety",
          label: "🚦 Who are my riskiest drivers?",
          say: "Who are my ten riskiest drivers this week, and what were their top events?",
          next: "ep-safety-risk",
        },
        {
          group: "🛟 Safety",
          label: "🛑 Harsh braking by driver (30 days)",
          say: "Show me a breakdown of harsh braking events by driver over the last 30 days.",
          next: "ep-safety-harsh",
        },
        {
          group: "🛟 Safety",
          label: "🏫 Speeding in school zones this month?",
          say: "Which drivers have had speeding violations in school zones this month?",
          next: "ep-safety-schoolzone",
        },
        {
          group: "🛟 Safety",
          label: "❓ Why are speeding alerts up?",
          say:
            "Our speeding alerts are up this week. Why — is it the whole fleet, or a few vehicles? " +
            "Break it down for me.",
          next: "ep2-answer",
        },
        {
          group: "🛟 Safety",
          label: "🛣️ Was that road really that fast?",
          say:
            "A driver is disputing a speeding flag on Demo - 01. Pull the posted road speed along its actual " +
            "route so we can coach on facts, not memory.",
          next: "ep10-postedspeed",
        },
        {
          group: "🛟 Safety",
          label: "🤖 Ask Geotab Ace a question",
          say: "Using Geotab Ace — which 5 vehicles had the most speeding events in the last 7 days, and how many each?",
          next: "ep7-ace",
        },

        {
          group: "🔧 Maintenance",
          label: "🔧 Triage the maintenance worklist",
          say:
            "I've got a pile of faults on the Spain fleet. Is it everywhere, or a few vehicles? " +
            "Give me a prioritized worklist for the shop.",
          next: "ep8-maintenance",
        },
        {
          group: "🔧 Maintenance",
          label: "📅 What's overdue for service right now?",
          say: "Which vehicles are overdue for scheduled maintenance right now?",
          next: "ep-maint-overdue",
        },
        {
          group: "🔧 Maintenance",
          label: "⚠️ Fault codes + severity (last 7 days)",
          say: "Show me any fault codes flagged in the last seven days and their severity.",
          next: "ep-maint-severity",
        },
        {
          group: "🔧 Maintenance",
          label: "⏱️ Most unplanned downtime this quarter",
          say: "Which assets have had the most unplanned downtime this quarter?",
          next: "ep-maint-downtime",
        },
        {
          group: "🔧 Maintenance",
          label: "❓ Why does Demo - 08 keep faulting?",
          say:
            "Demo - 08 keeps showing up in the fault list. Why — dig into it and don't stop at the first explanation.",
          next: "ep12-investigate",
        },
        {
          group: "🔧 Maintenance",
          label: "📧 Fault → email garage → book service",
          say:
            "One of our vans just logged a fault. Pull the details, draft an email to the garage asking " +
            "them to take a look, and put a tentative service slot on my calendar for tomorrow morning.",
          next: "ep5-answer",
        },

        {
          group: "🚀 Operations",
          label: "⛽ Fuel economy by vehicle type",
          say: "What is my average fuel economy by vehicle type this month?",
          next: "ep-ops-fuel",
        },
        {
          group: "🚀 Operations",
          label: "💤 Longest idle times last week",
          say: "Show me which routes had the longest idle times last week.",
          next: "ep-ops-idle",
        },
        {
          group: "🚀 Operations",
          label: "🔋 EV-replacement candidates",
          say: "Which vehicles are candidates for EV replacement based on daily mileage patterns?",
          next: "ep9-ev-vegas",
        },
        {
          group: "🚀 Operations",
          label: "🚐 What's actually in my fleet?",
          say:
            "What makes and models am I actually running on the Spain fleet, " +
            "and which are realistic EV-conversion candidates?",
          next: "ep9-fleet-hub",
        },
        {
          group: "🚀 Operations",
          label: "🌍 React to a low-emission zone",
          say:
            "Valencia's low-emission zone is tightening in 2026. Check the current rules, and tell me " +
            "whether my fleet drives through that zone and what a non-compliant entry would cost us.",
          next: "ep3-answer",
        },
        {
          group: "🚀 Operations",
          label: "🧪 Test creating & deleting a zone/rule",
          say:
            "Before I automate anything with zones and rules, walk me through creating a disposable test " +
            "zone and rule, verifying they exist, then deleting both and confirming they're actually gone " +
            "— not just deactivated.",
          next: "ep-zonelife-answer",
        },

        {
          group: "🧠 Automate & share",
          label: "🛠️ Turn my weekly review into a team skill",
          say:
            "Package my weekly fleet review into a reusable skill so I — and anyone on my team — " +
            "can run the identical review just by asking for it.",
          next: "ep1-skill-first",
        },
        {
          group: "🧠 Automate & share",
          label: "⚡ Get 5 fleet chores done in one ask",
          say:
            "I've got a few fleet chores to knock out — set up a depot geofence, an idling alert, " +
            "clear a serviced van's faults, group my Valencia vehicles, and route the alerts to a manager.",
          next: "ep4-answer",
        },
        {
          group: "🧠 Automate & share",
          label: "🧑‍🏫 Draft coaching notes for a manager",
          say: "Identify drivers who need coaching and draft a summary I can send to their manager.",
          next: "ep-agentic-coaching",
        },

        {
          group: "🚚 Cross-tool & exec",
          label: "🚐 Who's closest and free right now?",
          say:
            "A job just came in near downtown Las Vegas — which vehicle is closest and actually " +
            "available right now?",
          next: "ep-dispatch",
        },
        {
          group: "🚚 Cross-tool & exec",
          label: "💼 Settle a late-delivery dispute (Salesforce)",
          say:
            "A customer is disputing a late delivery yesterday and it's logged as an open Salesforce case. " +
            "Check Demo - 12's actual arrival time at the customer site against the case, and log the proof on the case.",
          next: "ep13-salesforce",
        },
        {
          group: "🚚 Cross-tool & exec",
          label: "📊 Give me a board snapshot, both fleets",
          say:
            "Give me a board-level snapshot across both fleets — utilization, safety, maintenance and " +
            "sustainability — in five numbers.",
          next: "ep-exec",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
            '// the whole-fleet aggregate (via Ace) shows the top vehicles clustered 118–142 — no runaway outlier',
        },
        {
          type: "assistant",
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
          type: "assistant",
          text:
            "Okay, here's your week on demo_fh_vegas4.\n\n" +
            "Good news first: 50 vehicles, all reporting, zero active faults. Genuinely clean week on the maintenance side.\n\n" +
            "The thing that needs a look is speeding — and it's not one driver, it's the whole fleet. Posted-speed " +
            "events are spread across a lot of vehicles, with the top offenders close together and no single van " +
            "running away with it. That changes the fix: this isn't a conversation with one person, it's a policy " +
            "thing, plus a live alert so it gets caught in the moment instead of next Monday.\n\n" +
            "Two caveats so you don't over-read this: HOS is per-driver only — the API won't return violations " +
            "without naming someone — so what I checked was a spot-check, not a fleet-wide all-clear. And DVIR has " +
            "nothing logged this week, which I'm reading as \"nothing to report,\" not \"nobody's filing them,\" but " +
            "worth a sanity check on your end.\n\n" +
            "(Didn't put trip count in here — the raw all-time counter isn't a meaningful weekly number, so I left it out rather than report something misleading.)\n\n" +
            "That's the version of this brief that used to mean pulling four reports and cross-checking them by hand — " +
            "probably 30–45 minutes on a Monday. This was one ask.\n\n" +
            "One thing before you file it, though: that's *my* default shape — several paragraphs of prose. If this " +
            "is about to become your Monday ritual, push back now. Too wordy? Wrong order? Want it visual? Whatever " +
            "we settle on together is what we can later freeze into a skill for your whole team.",
        },
      ],
      choices: [
        {
          label: "📊 Too much prose — chart the speeding",
          say:
            "Useful, but honestly Monday-me won't read five paragraphs. Make it visual — chart the speeding " +
            "so I can see the top vehicles at a glance.",
          next: "ep1-shape-viz",
        },
        { label: "🤖 Double-check the speeding with Ace", say: "Double-check that speeding read with Geotab Ace.", next: "ep7-ace" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ------------------------------------- ep1 · shaping the review together */
    /* The user pushes back on the default brief and the review gets reshaped
     * in conversation — first the visualization, then the format. Whatever gets
     * settled here is exactly what ep1-skill freezes: conversations first,
     * skills second, demonstrated rather than told. */
    "ep1-shape-viz": {
      id: "ep1-shape-viz",
      title: "Ep1 · Shape it: chart the speeding",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Fair — and this is exactly the moment to say so, while we're still shaping the thing.\n\n" +
            "One catch first: I won't chart the raw pull. It's capped at the newest ~200 rows, so a chart of it " +
            "would just be a prettier version of a paging artifact. Let me have Ace aggregate the whole week " +
            "across the whole fleet, then chart the real ranking.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Top 5 vehicles by speeding events, last 7 days?", new_chat: true },
          summary: "whole-fleet aggregate → top 5 cluster 118–142",
          result:
            '{ "answer": "1. Demo-16: 142  2. Demo-01: 134  3. Demo-08: 129  4. Demo-15: 121  5. Demo-04: 118" }',
        },
        {
          type: "chart",
          title: "Top 5 vehicles by speeding events · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 16", value: 142 },
            { label: "Demo - 01", value: 134 },
            { label: "Demo - 08", value: 129 },
            { label: "Demo - 15", value: 121 },
            { label: "Demo - 04", value: 118 },
          ],
        },
        {
          type: "assistant",
          text:
            "There's the picture — and notice it carries the argument the paragraph was making. One bad vehicle " +
            "would look like a single long bar and a cliff; this is a plateau, five vehicles within about 20 events " +
            "of each other. \"Fleet-wide problem, fix it with policy\" — now at a glance instead of in a sentence.\n\n" +
            "(I'd skip charting the maintenance side this week: every bar would be zero. When a chart has nothing " +
            "to say, the sentence \"zero active faults\" says it better.)\n\n" +
            "Keep shaping — what about the words around it? Same six sections, or tighter?",
        },
      ],
      choices: [
        {
          label: "🧾 Headline, chart, three bullets — it gets forwarded",
          say:
            "Tighter. Headline on top, then the chart, then three bullets max. And it gets forwarded to my " +
            "ops manager, so keep it plain and keep driver names out of it.",
          next: "ep1-shape-brief",
        },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep1-shape-brief": {
      id: "ep1-shape-brief",
      title: "Ep1 · Shape it: the reshaped brief",
      events: [
        {
          type: "assistant",
          text:
            "Deal. Same week, reshaped — this is what your Monday brief looks like from now on:\n\n" +
            "**Clean trucks, heavy right feet — speeding is a fleet problem this week, not a driver problem.**",
        },
        {
          type: "chart",
          title: "Top 5 vehicles by speeding events · last 7 days (via Ace)",
          bars: [
            { label: "Demo - 16", value: 142 },
            { label: "Demo - 01", value: 134 },
            { label: "Demo - 08", value: 129 },
            { label: "Demo - 15", value: 121 },
            { label: "Demo - 04", value: 118 },
          ],
        },
        {
          type: "assistant",
          text:
            "- All 50 vehicles reporting, **zero active faults** — a genuinely clean maintenance week.\n" +
            "- **Speeding is fleet-wide** — the top five sit within 118–142 events, nobody running away with it. " +
            "The fix is a policy plus a live alert, not one conversation.\n" +
            "- **HOS spot-checked clean; DVIR silent** — HOS is per-driver only, so confirm crews are filing " +
            "rather than assuming.\n\n" +
            "That's the whole thing — forwardable as-is, vehicles not people, and the chart does the arguing.\n\n" +
            "Worth noticing what just happened: this shape didn't come from me, it came out of the conversation. " +
            "You said Monday-you won't read paragraphs, so the chart leads. You said it gets forwarded, so it's " +
            "plain and names no drivers. That's exactly what makes it worth freezing — want me to package *this*, " +
            "format and all the data traps I had to dodge, into a skill anyone on your team can run?",
        },
      ],
      choices: [
        {
          label: "🛠️ Freeze it — make this the team skill",
          say:
            "Freeze it. Package exactly this into a reusable skill so anyone on my team gets the same brief " +
            "just by asking for it.",
          next: "ep1-skill",
        },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* Entry from the hub's "turn my weekly review into a team skill" ask:
     * don't package a guess — run the review once and shape it first. */
    "ep1-skill-first": {
      id: "ep1-skill-first",
      title: "Ep1 · Run it once before packaging",
      events: [
        {
          type: "assistant",
          text:
            "Happy to — but I don't want to package a guess. A skill is only as good as the conversation it's " +
            "frozen from, so here's the plan: I run your review once, you tell me what's wrong with it — too " +
            "long, wrong shape, missing things — and whatever we settle on together is what I save. Running it now.",
        },
      ],
      next: "ep1-answer",
    },

    "ep1-skill": {
      id: "ep1-skill",
      title: "Ep1 · Package as a skill",
      events: [
        {
          type: "tool",
          server: "assistant",
          name: "Create skill",
          args: { name: "geotab-weekly-review" },
          summary: "SKILL.md written — shaped format (headline → chart → 3 bullets), grounding rules + no-PII default",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: geotab-weekly-review\n" +
            "description: >-\n" +
            "  Produce a manager-ready weekly fleet review from a Geotab MCP connection —\n" +
            "  a one-line headline, one whole-fleet ranking chart, and at most three\n" +
            "  bullets. Encodes Geotab data quirks and a strict no-PII default so the\n" +
            "  answer is correct and repeatable for anyone on the team.\n" +
            "---\n\n" +
            "# Geotab Weekly Fleet Review\n\n" +
            "## When to use\n" +
            "When the user asks for a weekly/periodic fleet review, a \"Monday morning\" summary, " +
            "or \"how did the fleet do this week.\" Default window: last 7 days.\n\n" +
            "## What to check\n" +
            "1. Fleet size  2. Faults/maintenance  3. Driving exceptions  4. HOS  5. DVIR  6. Trip activity\n\n" +
            "## Output format (shaped in conversation — reshape for your fleet)\n" +
            "- Headline first: one line with the week's verdict.\n" +
            "- One chart: top vehicles from a whole-window aggregate — never from a capped raw list.\n" +
            "- Three bullets max, then stop. Forwardable as-is: plain language, no driver names.\n" +
            "- Chart only what has signal — a clean section is a sentence (\"zero active faults\"), not a chart of zeros.\n\n" +
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
            "GetCountOf Device → Get/GetCountOf FaultData → GetAceResults to rank exceptions for the chart → " +
            "spot-check DutyStatusViolation → Get DVIRLog → bounded Get Trip.\n\n" +
            "(~100 lines total — this is the trimmed preview.)",
        },
        {
          type: "assistant",
          text:
            "Packaged it as geotab-weekly-review — open the card above if you want to see what's actually in it. " +
            "Every line of it traces back to something that happened in this conversation:\n\n" +
            "- The **chart-first format** is in there because you said Monday-you won't read paragraphs.\n" +
            "- The **three-bullet cap** and the **no-driver-names rule** are in there because you said the brief " +
            "gets forwarded.\n" +
            "- The **\"aggregate the whole window, never rank from a capped list\"** rule is in there because the " +
            "raw pull would have told the wrong story before Ace corrected it.\n" +
            "- Plus the traps you never saw me dodge: the Trip counter that ignores dates, HOS being per-driver only.\n\n" +
            "Drop it in your team's shared skills and anyone can just say \"run my weekly review\" and get exactly " +
            "the brief we shaped — the careful version every time, without re-litigating any of this first.\n\n" +
            "That's the pattern worth stealing from this whole demo: **conversations first, skills second.** Don't " +
            "write a skill from a blank page — run the review by hand, argue with it the way you just did, then " +
            "freeze what you settle on. The one above stays public in this project as a worked example — " +
            "[skills/geotab-weekly-review/SKILL.md](https://github.com/fhoffa/geotab-mcp-simulator/blob/main/skills/geotab-weekly-review/SKILL.md) — " +
            "not something to install as-is, because the rules that make a skill valuable come out of *your* fleet's " +
            "conversations. (For ready-to-follow shared skills — like the MotherDuck warehouse one this simulator's " +
            "warehouse path uses — see the companion [geotab-vibe-guide](https://github.com/fhoffa/geotab-vibe-guide).)",
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

    /* --------------------------------------------- skill · weekly safety scorecard */
    "ep-safety-skill": {
      id: "ep-safety-skill",
      title: "Skill · Package the safety scorecard",
      events: [
        {
          type: "tool",
          server: "assistant",
          name: "Create skill",
          args: { name: "fleet-safety-scorecard" },
          summary: "SKILL.md written — weighted scoring, systemic-vs-individual read, no-PII default",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: fleet-safety-scorecard\n" +
            "description: >-\n" +
            "  Rank a fleet's drivers by a weighted safety score from a Geotab MCP connection,\n" +
            "  separate systemic (policy) risk from individual (coaching) risk, and end with who\n" +
            "  needs a conversation this week. Encodes the scoring rules and a no-PII default.\n" +
            "---\n\n" +
            "# Fleet Safety Scorecard\n\n" +
            "## When to use\n" +
            "When the user asks for their riskiest drivers, a safety scorecard, or \"who needs " +
            "coaching this week.\" Default window: last 7 days.\n\n" +
            "## What to produce\n" +
            "1. Fleet safety score vs benchmark + week-over-week trend\n" +
            "2. Top 10 drivers: weighted score, total events, breakdown by event type\n" +
            "3. The read underneath: which risk is systemic vs individual\n" +
            "End with the 2-3 drivers who need a 1:1 this week and why.\n\n" +
            "## Grounding rules (avoid these traps)\n" +
            "- Score is weighted, not a raw tally — severity outweighs volume (a driver with fewer but severe events can outrank a high-count one). Say so.\n" +
            "- A tight cluster within a few points = a systemic problem (shared routes/limits), not bad actors → policy + live alert, not 10 chats.\n" +
            "- Don't infer outliers from a capped ExceptionEvent page — aggregate the whole window (e.g. via Ace).\n" +
            "- Map severe events before blaming a driver — a single-corner cluster is a route problem.\n" +
            "- A clean week is a finding, not a gap.\n\n" +
            "## No-PII default\n" +
            "- Attribute to the driver only where Driver ID is on AND the viewer has permission; otherwise use device names.\n" +
            "- Never return emails, phone numbers, employee numbers, or per-person location histories.\n\n" +
            "## Suggested tool flow\n" +
            "Get DriverChange (who's driving) → GetAceResults to rank by weighted score → " +
            "Get ExceptionEvent for the per-type breakdown → map severe events for any single-driver spike.\n\n" +
            "## Output style\n" +
            "Plain language, manager-ready. Lead with the read, not the table. No jargon, no raw JSON, no PII.\n\n" +
            "(94 lines total — trimmed preview.)",
        },
        {
          type: "assistant",
          text:
            "Packaged it as fleet-safety-scorecard — open the card to see what's in it. It's not just a faster " +
            "leaderboard: it encodes the judgment, that the score is weighted so severity beats volume, that a tight " +
            "cluster means a policy fix not ten chats, and that a single-corner spike is a route problem. Plus the no-PII " +
            "default, so whoever runs it gets the careful version.\n\n" +
            "Drop it in your team's shared skills and anyone can say \"run the safety scorecard\" and get this same read.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."] },
      ],
      choices: [
        { label: "🚦 Run the scorecard now", say: "Who are my ten riskiest drivers this week, and what were their top events?", next: "ep-safety-risk" },
        { label: "🧑‍🏫 Draft this week's coaching notes", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------------------------- skill · maintenance triage */
    "ep-maint-skill": {
      id: "ep-maint-skill",
      title: "Skill · Package the maintenance triage",
      events: [
        {
          type: "tool",
          server: "assistant",
          name: "Create skill",
          args: { name: "maintenance-triage" },
          summary: "SKILL.md written — severity-by-lamp triage, legal-first, noise-vs-engine, no-PII default",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: maintenance-triage\n" +
            "description: >-\n" +
            "  Turn a pile of Geotab faults and maintenance reminders into a prioritized shop\n" +
            "  worklist — ranked by consequence, not count — separating red/amber warning lamps\n" +
            "  from device-connectivity noise, and flagging legal items first.\n" +
            "---\n\n" +
            "# Maintenance Triage\n\n" +
            "## When to use\n" +
            "When the user asks what's wrong with the fleet, what's overdue, or for a shop worklist. " +
            "Default fault window: last 7 days; reminders: read against live odometer/engine hours.\n\n" +
            "## What to produce\n" +
            "1. Total faults, then split: red-stop / amber-warning / informational-device\n" +
            "2. The same-day list (red lamp + legal/roadworthiness items)\n" +
            "3. This-week list (amber) and the batch-it noise (device/connectivity)\n" +
            "End with a prioritized worklist, not a raw dump.\n\n" +
            "## Grounding rules (avoid these traps)\n" +
            "- Rank by consequence, not by how overdue/how many: a legal roadworthiness (ITV) item jumps the queue over a bigger-distance oil change.\n" +
            "- Severity lives in the J1939 warning lamp (red/amber), not the raw code count.\n" +
            "- A huge fault count is often ONE wiring job — device-unplugged/GPS faults cluster on a few units; report it as one fix, not N problems.\n" +
            "- Geotab Add is one entity per call — batch real writes with ExecuteMultiCall.\n" +
            "- Confirm against the shop's own records before sign-off; never invent a fault.\n\n" +
            "## No-PII default\n" +
            "- Device names and plates are fine; attribute to a driver only with permission.\n" +
            "- Never return emails, phone numbers, or employee numbers.\n\n" +
            "## Suggested tool flow\n" +
            "GetCountOf FaultData → Get FaultData (redStopLamp, amberWarningLamp) → group by device → " +
            "GetAceResults for overdue reminders vs odometer → ExecuteMultiCall to book the criticals.\n\n" +
            "## Output style\n" +
            "Plain language, shop-ready. Lead with what comes off the road today. No raw JSON, no PII.\n\n" +
            "(96 lines total — trimmed preview.)",
        },
        {
          type: "assistant",
          text:
            "Packaged it as maintenance-triage — open the card to read it. It carries the judgment that makes this useful: " +
            "rank by consequence so a legal ITV beats a bigger oil change, read severity off the warning lamp not the raw " +
            "count, and recognize that 580 device faults are usually one wiring job, not 580 problems.\n\n" +
            "Drop it in your shared skills and anyone can say \"triage the fleet\" and get the same prioritized worklist.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."] },
      ],
      choices: [
        { label: "🔧 Run the triage now", say: "I've got a pile of faults on the Spain fleet. Is it everywhere, or a few vehicles? Give me a prioritized worklist for the shop.", next: "ep8-maintenance" },
        { label: "📅 What's overdue right now?", say: "Which vehicles are overdue for scheduled maintenance right now?", next: "ep-maint-overdue" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------------------------- skill · quarterly ROI case */
    "ep-roi-skill": {
      id: "ep-roi-skill",
      title: "Skill · Package the quarterly ROI case",
      events: [
        {
          type: "tool",
          server: "assistant",
          name: "Create skill",
          args: { name: "quarterly-roi-case" },
          summary: "SKILL.md written — conservative lever model, honest caveats, no double-count",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: quarterly-roi-case\n" +
            "description: >-\n" +
            "  Build a defensible, conservative fleet ROI case from a Geotab MCP connection —\n" +
            "  total recoverable cost by lever (fuel, collision, maintenance, idling) with the\n" +
            "  fix for each — and state the caveats so it survives the room.\n" +
            "---\n\n" +
            "# Quarterly ROI Case\n\n" +
            "## When to use\n" +
            "When the user asks where the fleet is leaking money, for an ROI/business case, or a " +
            "one-pager for their boss. Scope to ONE fleet's actual fuel spend.\n\n" +
            "## What to produce\n" +
            "1. Total annual recoverable + per-vehicle figure\n" +
            "2. The levers: speeding→fuel, collision & insurance, maintenance & downtime, idling — each with its fix\n" +
            "3. The recommendation: which one initiative captures most of it\n" +
            "End with the caveats, stated up front, so it reads as pressure-tested.\n\n" +
            "## Grounding rules (avoid these traps)\n" +
            "- Use the LOW end of every range — an ROI that oversells gets torn apart.\n" +
            "- The collision line is an expected value, not a banked saving — label it.\n" +
            "- Don't double-count the fuel/idling overlap (the speeding line already absorbs the driving-style fuel gain).\n" +
            "- Hardware/subscription is sunk — this is operating-cost recovery on top, not a hardware pitch.\n" +
            "- Tie every number to a real source figure (actual fuel spend, measured idle hours), never a round guess.\n\n" +
            "## No-PII default\n" +
            "- Aggregate figures only; name drivers only with permission, and never in a doc headed upstairs.\n\n" +
            "## Suggested tool flow\n" +
            "GetAceResults fuel by type → safety scorecard (collision risk) → maintenance/downtime → " +
            "idling hours → sum conservatively, then draft the one-pager.\n\n" +
            "## Output style\n" +
            "Board-ready: headline number, four levers, one recommendation, caveats. No jargon, no PII.\n\n" +
            "(92 lines total — trimmed preview.)",
        },
        {
          type: "assistant",
          text:
            "Packaged it as quarterly-roi-case — open the card to see it. The value isn't the arithmetic, it's the " +
            "discipline baked in: low end of every range, the collision line flagged as expected value not cash, no " +
            "double-counting fuel and idling, and every number tied to a real source figure. That's the version that " +
            "gets a yes.\n\n" +
            "Run it each quarter and you get the same defensible case from fresh data, without rebuilding the model.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."] },
      ],
      choices: [
        { label: "📄 Draft this quarter's one-pager", say: "Turn this into a one-page business case I can forward to my boss.", next: "ep-roi-onepager" },
        { label: "💰 Re-run the full ROI breakdown", say: "Where is my fleet leaking money — total the recoverable savings and build me the ROI case.", next: "ep-roi" },
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
          type: "assistant",
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
          type: "assistant",
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
          summary: "whole-fleet aggregate → top 5 cluster 118–142, no van running away with it",
          result:
            '{ "answer": "1. Demo-16: 142  2. Demo-01: 134  3. Demo-08: 129  4. Demo-15: 121  5. Demo-04: 118" }',
        },
        {
          type: "assistant",
          text:
            "So here's what actually happened. A quick raw pull only returns the newest ~200 events, and those " +
            "happen to cluster on a couple of vans, which makes it look like Demo - 01 is the problem.\n\n" +
            "It isn't — that's a paging artifact, not an answer. Those 200 rows are about 3.5% of the 5,645 events " +
            "this week. Once Ace aggregates the whole week across every vehicle, Demo - 01 isn't even in first place: " +
            "it's Demo - 16 at 142, then Demo - 01 at 134, then 129, 121, and 118. That's real variance, not a tie — " +
            "but nobody's running away with it the way an actual outlier would (think 2–3x the next vehicle, not 1.2x).\n\n" +
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
            { label: "Demo - 16", value: 142 },
            { label: "Demo - 01", value: 134 },
            { label: "Demo - 08", value: 129 },
            { label: "Demo - 15", value: 121 },
            { label: "Demo - 04", value: 118 },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
          text:
            "Done — fleet-wide posted-speed rule is live, and the alert's routed to one fleet manager (by name, no " +
            "email shown). Any vehicle over the posted limit gets flagged in the moment now, not when you run next " +
            "week's review.",
        },
        {
          type: "confirm",
          changes: [
            "Rule \"Posted Speed — fleet-wide\" created and active on demo_fh_vegas4",
            "Notification routed to 1 fleet manager",
          ],
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
        { label: "🚐 What are the affected vehicles?", say: "What make and model are Demo - 23 and Demo - 31?", next: "ep9-fleet-23-31" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep3-prefs": {
      id: "ep3-prefs",
      title: "Ep3 · Alert preferences",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          mapStyle: "valencia",
          zone: {
            label: "ZBE València",
            labelX: 51,
            labelY: 69,
            points: [
              [38, 22], [52, 18], [66, 26], [72, 38], [70, 52],
              [74, 62], [64, 72], [50, 70], [40, 60], [30, 50],
              [28, 36], [34, 28],
            ],
          },
          areas: [
            { kind: "water", d: "M77 50 C88 54, 97 61, 102 72 L102 102 L66 102 C72 82, 74 64, 77 50 Z" },
            { kind: "park", x: 9, y: 66, w: 18, h: 14, rx: 2, rotate: -7 },
            { kind: "block", x: 16, y: 18, w: 16, h: 10, rx: 1, rotate: -7 },
            { kind: "block", x: 34, y: 10, w: 18, h: 9, rx: 1, rotate: -5 },
            { kind: "block", x: 57, y: 15, w: 17, h: 10, rx: 1, rotate: 7 },
            { kind: "block", x: 16, y: 34, w: 14, h: 12, rx: 1, rotate: -7 },
            { kind: "industrial", x: 76, y: 26, w: 15, h: 12, rx: 1, rotate: 7 },
            { kind: "block", x: 30, y: 74, w: 17, h: 10, rx: 1, rotate: 8 },
            { kind: "block", x: 49, y: 76, w: 16, h: 9, rx: 1, rotate: 5 },
          ],
          roads: [
            { kind: "arterial", d: "M5 58 C24 54, 37 50, 50 48 S78 46, 96 40", label: "Av. del Port", labelX: 19, labelY: 54, labelRotate: -9 },
            { kind: "arterial", d: "M17 28 C34 32, 48 35, 72 30 S88 29, 98 34", label: "Blasco Ibáñez", labelX: 42, labelY: 32, labelRotate: 6 },
            { kind: "local", d: "M42 4 C45 22, 46 36, 44 52 S42 78, 44 98" },
            { kind: "local", d: "M69 7 C64 28, 61 40, 60 52 S58 72, 54 96" },
            { kind: "local", d: "M23 76 C35 68, 44 60, 50 48 S64 31, 75 20" },
            { kind: "local", d: "M10 43 C26 43, 38 45, 50 48 S70 55, 90 54" },
            { kind: "local", d: "M31 18 C42 26, 50 33, 56 45 S64 62, 70 75" },
          ],
          intersections: [
            { x: 44, y: 41, r: 1.2 },
            { x: 50, y: 48, r: 1.4 },
            { x: 60, y: 52, r: 1.2 },
            { x: 69, y: 31, r: 0.9, kind: "minor" },
          ],
          pins: [
            { label: "Demo - 23", x: 44, y: 41, status: "busy" },
            { label: "Demo - 31", x: 60, y: 52, status: "busy" },
          ],
        },
        {
          type: "assistant",
          text: "Both Demo - 23 and Demo - 31 are sitting right inside the zone boundary right now — exactly the two the new alert's going to be watching.",
        },
      ],
      choices: [
        { label: "🚐 What make and model are these?", say: "What make and model are Demo - 23 and Demo - 31, exactly?", next: "ep9-fleet-23-31" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------------------------- ep-zonelife · zone/rule lifecycle */
    // Grounded 20 Jul 2026 against the live MCP (real database, disposable test
    // entities, cleaned up after). Verdicts below are from real calls, not
    // guesses — see docs/ROADMAP.md's grounding-pass log for the raw transcript.
    "ep-zonelife-answer": {
      id: "ep-zonelife-answer",
      title: "Ops · Zone & rule lifecycle test",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Before I build anything you'd rely on, let's prove the whole lifecycle actually works — create a zone " +
            "and a rule, confirm they're really there, then delete both and confirm they're *really* gone, not just " +
            "deactivated. Checking the current baseline first.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Zone" },
          summary: "0 zones currently on this database",
          result: '{ "result": 0 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Rule" },
          summary: "17 rules — the stock set (Speeding, Harsh Braking, Collision, Seatbelt, …)",
          result: '{ "result": 17 }',
        },
        {
          type: "assistant",
          text:
            "No zones yet, 17 stock rules already in place, no custom zone-based ones. I'll create a throwaway pair — " +
            "named unmistakably as test data — verify them, then tear both down and confirm the counts land back on " +
            "0 and 17.",
        },
      ],
      choices: [
        {
          label: "🧪 Go ahead — create the test zone + rule",
          say: "Go ahead — create a disposable test zone and rule so we can verify the full lifecycle including deletion.",
          next: "ep-zonelife-create",
        },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-zonelife-create": {
      id: "ep-zonelife-create",
      title: "Ops · Create test zone + rule",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text: "Creating the zone first — a small closed polygon, named so it can't be mistaken for real fleet config.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: {
            database: "demo_fh_vegas4",
            typeName: "Zone",
            entity: {
              name: "ZTEST-DELETE-ME-2026-07-20",
              points: [
                { x: -115.14, y: 36.17 }, { x: -115.139, y: 36.17 },
                { x: -115.139, y: 36.169 }, { x: -115.14, y: 36.169 }, { x: -115.14, y: 36.17 },
              ],
            },
          },
          summary: "Zone created",
          write: true,
          result: '{ "result": "Zoneb…ztest-2026-07-20" }',
        },
        {
          type: "assistant",
          text: "Zone's in — verifying it's actually retrievable before building on it, then adding the rule tied to it.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: {
            database: "demo_fh_vegas4",
            typeName: "Rule",
            entity: {
              name: "RTEST-DELETE-ME-2026-07-20",
              baseType: "ZoneStop",
              condition: { conditionType: "ZoneStop", zone: { id: "Zoneb…ztest-2026-07-20" } },
            },
          },
          summary: "rejected — Groups required",
          write: true,
          result: 'Error: Undefined or empty ExceptionRule.Groups',
        },
        {
          type: "assistant",
          text:
            "First attempt bounced: `Undefined or empty ExceptionRule.Groups`. The schema lists `groups` as optional, " +
            "but the live API disagrees — every real rule on this database carries `groups: [{ id: \"GroupCompanyId\" }]`, " +
            "so I'll add that and retry rather than guess further.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: {
            database: "demo_fh_vegas4",
            typeName: "Rule",
            entity: {
              name: "RTEST-DELETE-ME-2026-07-20",
              baseType: "ZoneStop",
              groups: [{ id: "GroupCompanyId" }],
              condition: { conditionType: "ZoneStop", zone: { id: "Zoneb…ztest-2026-07-20" } },
            },
          },
          summary: "Rule created and tied to the zone",
          write: true,
          result: '{ "result": "Ruleb…rtest-2026-07-20" }',
        },
        {
          type: "assistant",
          text: "Both created. Pulling them back by id to confirm the zone reference actually persisted, not just accepted.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Rule", search: { id: "Ruleb…rtest-2026-07-20" } },
          summary: "confirmed — condition.zone.id matches the test zone",
          result: '[{ "id": "Ruleb…rtest-2026-07-20", "name": "RTEST-DELETE-ME-2026-07-20", "condition": { "zone": { "id": "Zoneb…ztest-2026-07-20" } } }]',
        },
        {
          type: "confirm",
          changes: [
            "Zone \"ZTEST-DELETE-ME-2026-07-20\" created on demo_fh_vegas4",
            "Rule \"RTEST-DELETE-ME-2026-07-20\" created and tied to that zone",
          ],
        },
      ],
      choices: [
        {
          label: "🗑️ Now delete both, rule first",
          say: "Good — now delete the rule, then the zone, and confirm both are actually gone.",
          next: "ep-zonelife-delete",
        },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
      ],
    },

    "ep-zonelife-delete": {
      id: "ep-zonelife-delete",
      title: "Ops · Delete + verify zone/rule",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text: "Removing the rule first, then the zone — the safer, most portable order regardless of what the API happens to allow.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Remove",
          args: { database: "demo_fh_vegas4", typeName: "Rule", entity: { id: "Ruleb…rtest-2026-07-20" } },
          summary: "removed",
          write: true,
          result: "{}",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Remove",
          args: { database: "demo_fh_vegas4", typeName: "Zone", entity: { id: "Zoneb…ztest-2026-07-20" } },
          summary: "removed",
          write: true,
          result: "{}",
        },
        {
          type: "assistant",
          text: "Both calls returned clean. Confirming they're actually gone rather than trusting a success response — checking `Get` by id, not just `activeTo`.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Zone", search: { id: "Zoneb…ztest-2026-07-20" } },
          summary: "empty — hard-deleted, not retired",
          result: "[]",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Rule", search: { id: "Ruleb…rtest-2026-07-20" } },
          summary: "empty — hard-deleted, not retired",
          result: "[]",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Zone" },
          summary: "back to 0",
          result: '{ "result": 0 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Rule" },
          summary: "back to 17",
          result: '{ "result": 17 }',
        },
        {
          type: "assistant",
          text:
            "Confirmed: `Remove` genuinely deletes on this API — the follow-up `Get` came back empty, not a record " +
            "with `activeTo` set to a past date. That matters, because `activeFrom`/`activeTo` exist on both entities " +
            "for scheduling and could easily be mistaken for the delete mechanism; they're not. Counts are back to " +
            "baseline — 0 zones, 17 rules — so nothing test-related is left behind.",
        },
        {
          type: "confirm",
          changes: [
            "Rule removed and confirmed gone (Get returns empty, not a retired record)",
            "Zone removed and confirmed gone (Get returns empty, not a retired record)",
            "Zone & Rule counts back to baseline (0 zones / 17 rules)",
          ],
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Tested end-to-end — create, verify, delete, verify. Nothing left behind."] },
      ],
      choices: [
        {
          label: "⚠️ Does deleting a rule wipe its exception history?",
          say:
            "Wait — would that Remove call have also wiped out this rule's historical exceptions? Native MyGeotab " +
            "shows a warning popup before you delete a rule. Does the MCP connector warn about that too?",
          next: "ep-zonelife-safety",
        },
        {
          label: "🔀 What if I delete the zone first?",
          say: "What happens if I delete the zone before the rule — does it error, or does the rule get orphaned?",
          next: "ep-zonelife-cascade",
        },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep-zonelife-safety": {
      id: "ep-zonelife-safety",
      title: "Ops · What deleting a rule clears (and how to check first)",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Good instinct to check — let me look at this properly instead of guessing, without touching any real rule " +
            "or its history. Two things: how much history a real rule actually carries, and what the documentation " +
            "says happens to it on delete.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { ruleSearch: { id: "RuleSpeedingId" } } },
          summary: "518 historical exception events tied to the stock Speeding rule — read-only, nothing touched",
          result: '{ "result": 518 }',
        },
        {
          type: "tool",
          server: "web",
          name: "web_search",
          args: { query: "Geotab MyGeotab rule deletion exception history behavior" },
          summary: "MyGeotab docs & support content: editing or removing a rule invalidates the exceptions it generated",
          result:
            'geotab.com/support · community.geotab.com\n' +
            '"Editing, removing, or reprocessing a rule invalidates the exceptions it previously generated, since an ' +
            'exception tied to a rule definition that no longer exists — or no longer matches — isn\'t a meaningful ' +
            'record to keep. This is treated as part of normal rule maintenance rather than a separate event: the ' +
            'audit log captures the rule change itself, not a running list of which exception rows were invalidated ' +
            'underneath it."',
        },
        {
          type: "assistant",
          text:
            "So: yes. Editing or removing a rule invalidates its attached `ExceptionEvent` history — that's expected " +
            "behavior given how rules work, not a malfunction. The thing worth being deliberate about is that this " +
            "isn't a separate audit-log event: the log records the rule change itself, not an inventory of what got " +
            "invalidated underneath it, so there's nothing built-in that tells you afterward how much history a given " +
            "change actually cleared.\n\n" +
            "Native MyGeotab shows a warning popup before a delete like this — exactly the kind of moment where a " +
            "human should pause. The `Remove` calls I ran earlier in this test went straight through, no prompt, " +
            "because that test rule was fresh with zero exceptions attached, so there was nothing at stake. But the " +
            "real stock \"Speeding\" rule on this same database carries **518** historical exception events. Anyone " +
            "calling `Remove` on a rule like that through this connector should know going in that it carries the " +
            "same weight as the native delete — the MCP layer just doesn't pause to ask first.\n\n" +
            "Practical habit worth building into any real automation: before calling `Remove` on a real `Rule`, " +
            "check `GetCountOf(ExceptionEvent, search:{ruleSearch:{id:...}})` first. `ExceptionEvent` only carries " +
            "a rule id, not a zone id, so there's no direct filter for a `Zone` — find the rule(s) that reference " +
            "it first (`Get(Rule)`, matching `condition.zone.id`), then run the same count for each. Surface " +
            "whatever you find to a human, and get explicit sign-off if it isn't zero. Don't rely on the MCP tool " +
            "to stop you — it won't.",
        },
      ],
      choices: [
        {
          label: "🛠️ Turn this into a reusable safety-check skill",
          say:
            "Should I wait for Geotab to build a guardrail like this into the connector, or can we just package " +
            "this check into a skill ourselves right now?",
          next: "ep-zonelife-skill",
        },
        {
          label: "🔀 What if I delete the zone first?",
          say: "What happens if I delete the zone before the rule — does it error, or does the rule get orphaned?",
          next: "ep-zonelife-cascade",
        },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep-zonelife-skill": {
      id: "ep-zonelife-skill",
      title: "Skill · Package the pre-delete safety check",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Good question to end on, and you don't have to pick one — but there's no reason to sit and wait. The " +
            "gap we just found came from testing the real behavior in this exact conversation, which is the same raw " +
            "material every skill in this project gets built from. Packaging it now.",
        },
        {
          type: "tool",
          server: "assistant",
          name: "Create skill",
          args: { name: "geotab-safe-delete" },
          summary: "SKILL.md written — pre-delete ExceptionEvent check, human sign-off on any non-zero count",
          write: true,
          openByDefault: true,
          result:
            "---\n" +
            "name: geotab-safe-delete\n" +
            "description: >-\n" +
            "  Guardrail for removing a MyGeotab Rule or Zone through the MCP connector.\n" +
            "  Checks how much ExceptionEvent history is attached before calling Remove,\n" +
            "  and pauses for human sign-off on anything that isn't disposable test data —\n" +
            "  since native MyGeotab warns about this and the connector doesn't.\n" +
            "---\n\n" +
            "# Safe Delete for Rules & Zones\n\n" +
            "## When to use\n" +
            "Before calling `Remove` on a `Rule` or `Zone` through the MCP connector — any time the target isn't " +
            "obviously disposable test data.\n\n" +
            "## What to check first\n" +
            "1. Deleting a `Rule`: `GetCountOf(ExceptionEvent, search:{ruleSearch:{id:<ruleId>}})` — read-only, " +
            "safe to run on anything.\n" +
            "2. Deleting a `Zone`: `ExceptionEvent` has no zone filter, only `ruleSearch`/`deviceSearch`. Find the " +
            "rule(s) that reference the zone first (`Get(Rule)`, matching `condition.zone.id`), then run the same " +
            "count for each rule id found.\n" +
            "3. Count is 0 (across all matching rules) → proceed, it's genuinely disposable.\n" +
            "4. Count is anything else → stop. Tell the human the number and what it means (historical exceptions " +
            "that get invalidated, not archived), and wait for explicit go-ahead before calling `Remove`.\n\n" +
            "## Why this exists\n" +
            "Editing or removing a Rule invalidates the exceptions it generated — expected behavior, not a " +
            "malfunction — but it isn't logged as its own audit event, and native MyGeotab's warning dialog before " +
            "a rule delete doesn't extend to the MCP connector. This skill puts that pause back in.\n\n" +
            "## Suggested tool flow\n" +
            "If deleting a Zone: Get(Rule) to find the rule(s) referencing it (condition.zone.id) → " +
            "GetCountOf(ExceptionEvent, ruleSearch:{id:...}) per rule found → report the total → wait for " +
            "sign-off if non-zero → Remove(Rule) → Remove(Zone) → Get by id to confirm a hard delete, not a " +
            "retire.\n\n" +
            "(41 lines total — trimmed preview.)",
        },
        {
          type: "assistant",
          text:
            "Packaged it as geotab-safe-delete — open the card to see what's in it. It's small on purpose: one " +
            "check, one rule for what to do with the result. Same caveat as the weekly-review skill earlier in " +
            "this demo: this stays here as a **worked example**, not something to install as-is — package your " +
            "own version from a real conversation on your own fleet, since that's where a skill actually worth " +
            "trusting comes from.\n\n" +
            "On waiting versus building: if Geotab ships an equivalent confirmation at the API or connector level " +
            "later, that's strictly better — a first-party guardrail beats a client-side one, and a skill like " +
            "this would retire in its favor. But that's not a reason to sit on the gap in the meantime. This one " +
            "came from testing the real behavior right here, same pattern as every skill in this project — " +
            "conversations first, skills second. You don't need a vendor roadmap to fix something you can just " +
            "fix; you just shouldn't mistake a demo artifact for a deployed guardrail.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Ask once. Automate it. Share it with your whole team."] },
      ],
      choices: [
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep-zonelife-cascade": {
      id: "ep-zonelife-cascade",
      title: "Ops · Delete order — zone before rule",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Good question — I recommended rule-then-zone as the safe default, but let's actually test the reverse: " +
            "a second disposable pair, then remove the zone while the rule still references it.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: {
            database: "demo_fh_vegas4",
            typeName: "Zone",
            entity: {
              name: "ZTEST-ORDERCHECK-2026-07-20",
              points: [
                { x: -115.145, y: 36.175 }, { x: -115.144, y: 36.175 },
                { x: -115.144, y: 36.174 }, { x: -115.145, y: 36.174 }, { x: -115.145, y: 36.175 },
              ],
            },
          },
          summary: "second test zone created",
          write: true,
          result: '{ "result": "Zoneb…ordercheck" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: {
            database: "demo_fh_vegas4",
            typeName: "Rule",
            entity: {
              name: "RTEST-ORDERCHECK-2026-07-20",
              baseType: "ZoneStop",
              groups: [{ id: "GroupCompanyId" }],
              condition: { conditionType: "ZoneStop", zone: { id: "Zoneb…ordercheck" } },
            },
          },
          summary: "second test rule created, tied to the zone",
          write: true,
          result: '{ "result": "Ruleb…ordercheck" }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Remove",
          args: { database: "demo_fh_vegas4", typeName: "Zone", entity: { id: "Zoneb…ordercheck" } },
          summary: "removed the zone while the rule still referenced it — no error",
          write: true,
          result: "{}",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Rule", search: { id: "Ruleb…ordercheck" } },
          summary: "empty — the rule is gone too",
          result: "[]",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "Rule" },
          summary: "back to 17 — not just hidden, actually gone",
          result: '{ "result": 17 }',
        },
        {
          type: "assistant",
          text:
            "No referential-integrity error, and the rule didn't get orphaned — it cascade-deleted along with the " +
            "zone it depended on. Rule count went straight back to the 17-rule baseline without me ever calling " +
            "`Remove(Rule)` on it directly.\n\n" +
            "Useful to know, but I still wouldn't script around it: cascade behavior like this isn't documented, and " +
            "there's no guarantee every rule `baseType`/`conditionType` combination behaves the same way. Delete the " +
            "rule explicitly before the zone in anything you automate — it's the assumption that stays correct even " +
            "if this particular cascade doesn't.",
        },
        {
          type: "confirm",
          changes: [
            "Confirmed: removing a referenced zone does not error, even with a dependent rule still attached",
            "The dependent ZoneStop rule cascade-deleted along with its zone (Get + count both confirm)",
            "Counts back to baseline after both orderings — no orphans in either test",
          ],
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Verified, not assumed — the delete path actually deletes."] },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
        { label: "🚐 What's in the new Valencia group?", say: "What kind of vehicles ended up in the Valencia Region group?", next: "ep9-fleet-23-31" },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
          text: "Sent. Garage has the fault details and the plate now, and the 09:00 slot's already on the calendar waiting for them to confirm.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet, connected to the tools you already use."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 06?", say: "What make and model is Demo - 06?", next: "ep9-fleet-06" },
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
          type: "assistant",
          text: "Got it — email stays untouched in Drafts, and I'll leave the 09:00 slot on the calendar so the booking window doesn't slip while you decide. Nothing's gone out.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet, connected to the tools you already use."] },
      ],
      choices: [
        { label: "🚐 What kind of van is Demo - 06?", say: "What make and model is Demo - 06?", next: "ep9-fleet-06" },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
          text: "Case 00012345 is closed, GPS timestamp logged as the reason, and the account rep's been notified to follow up with the customer directly.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet's truth, dropped straight into the CRM."] },
      ],
      choices: [
        { label: "🚚 What kind of vehicle is Demo - 12?", say: "What make and model is Demo - 12?", next: "ep9-fleet-12" },
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
          type: "assistant",
          text: "Done — the GPS proof's logged as a comment on Case 00012345, but I'm leaving the case itself open so whoever's handling the customer conversation can close it when they're ready.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Your fleet's truth, dropped straight into the CRM."] },
      ],
      choices: [
        { label: "🚚 What kind of vehicle is Demo - 12?", say: "What make and model is Demo - 12?", next: "ep9-fleet-12" },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
        { label: "🛠️ Turn this triage into a reusable skill", say: "Turn this maintenance triage into a reusable skill my whole shop can run every week.", next: "ep-maint-skill" },
        { label: "🚐 What is Demo - 08, exactly?", say: "What make and model is Demo - 08?", next: "ep9-fleet-08" },
        { label: "🔎 Why does it keep faulting? Dig deeper", say: "Don't stop there — why does Demo - 08 keep faulting? Dig into it.", next: "ep12-investigate" },
        { label: "📧 Book it into the garage now", say: "Pull Demo - 08's fault details, draft an email to the garage, and put a tentative service slot on my calendar for tomorrow morning.", next: "ep5-answer" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ------------------------------------------- ep9 · single-vehicle lookups */
    "ep9-fleet-08": {
      id: "ep9-fleet-08",
      title: "Ep9 · What is Demo - 08",
      db: "demo_fh4",
      events: [
        { type: "assistant", text: "Let me check Demo - 08's VIN." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { name: "Demo - 08" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "Demo - 08 — VIN WDB9076571P106590",
          result: '[\n  { "name": "Demo - 08", "vehicleIdentificationNumber": "WDB9076571P106590" }\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["WDB9076571P106590"] },
          summary: "Mercedes-Benz Sprinter 907",
          result: '[\n  { "make": "Mercedes-Benz", "model": "Sprinter 907" }\n]',
        },
        {
          type: "assistant",
          text: "Demo - 08 is a Mercedes-Benz Sprinter 907 — one of your 5 light vans, Demo - 06 through 10.",
        },
      ],
      choices: [
        { label: "🔎 Why does it keep faulting? Dig deeper", say: "Don't stop there — why does Demo - 08 keep faulting? Dig into it.", next: "ep12-investigate" },
        { label: "📧 Book it into the garage now", say: "Pull Demo - 08's fault details, draft an email to the garage, and put a tentative service slot on my calendar for tomorrow morning.", next: "ep5-answer" },
        { label: "📊 What's the rest of the fleet running?", say: "What about the rest of the fleet — what's the full mix?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep9-fleet-06": {
      id: "ep9-fleet-06",
      title: "Ep9 · What is Demo - 06",
      db: "demo_fh4",
      events: [
        { type: "assistant", text: "Let me check Demo - 06's VIN." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { name: "Demo - 06" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "Demo - 06 — VIN WDB9076571P106588",
          result: '[\n  { "name": "Demo - 06", "vehicleIdentificationNumber": "WDB9076571P106588" }\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["WDB9076571P106588"] },
          summary: "Mercedes-Benz Sprinter 907",
          result: '[\n  { "make": "Mercedes-Benz", "model": "Sprinter 907" }\n]',
        },
        {
          type: "assistant",
          text: "Demo - 06 is a Mercedes-Benz Sprinter 907 — one of your 5 light vans.",
        },
      ],
      choices: [
        { label: "📊 What's the rest of the fleet running?", say: "What about the rest of the fleet — what's the full mix?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet-12": {
      id: "ep9-fleet-12",
      title: "Ep9 · What is Demo - 12",
      db: "demo_fh4",
      events: [
        { type: "assistant", text: "Let me check Demo - 12's VIN." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { name: "Demo - 12" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "Demo - 12 — VIN WDF9634031C001659",
          result: '[\n  { "name": "Demo - 12", "vehicleIdentificationNumber": "WDF9634031C001659" }\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["WDF9634031C001659"] },
          summary: "Mercedes-Benz New Actros",
          result: '[\n  { "make": "Mercedes-Benz", "model": "New Actros" }\n]',
        },
        {
          type: "assistant",
          text: "Demo - 12 is a Mercedes-Benz New Actros — one of your 10 heavy goods units, which tracks with it running customer deliveries.",
        },
      ],
      choices: [
        { label: "📊 What's the rest of the fleet running?", say: "What about the rest of the fleet — what's the full mix?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet-23-31": {
      id: "ep9-fleet-23-31",
      title: "Ep9 · What are Demo - 23 & Demo - 31",
      db: "demo_fh4",
      events: [
        { type: "assistant", text: "Let me check both VINs." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { ids: ["Demo - 23", "Demo - 31"] }, propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "2 VINs",
          result:
            '[\n  { "name": "Demo - 23", "vehicleIdentificationNumber": "VF611A364JD011743" },\n' +
            '  { "name": "Demo - 31", "vehicleIdentificationNumber": "WMAR62ZZ5LT034495" }\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh4", vins: ["VF611A364JD011743", "WMAR62ZZ5LT034495"] },
          summary: "Renault T · MAN Lion's Intercity C",
          result:
            '[\n  { "make": "Renault", "model": "T", "year": "2018", "engine": "Euro 6", "body": "Tractor" },\n' +
            '  { "make": "MAN", "model": "Lion\'s Intercity C", "year": "2020" }\n]',
        },
        {
          type: "assistant",
          text:
            "Different vehicle types, same zone: Demo - 23 is a Renault T tractor (Euro 6) and Demo - 31 is a MAN " +
            "Lion's Intercity coach — one hauling freight, one running a passenger route, both inside the ZBE right now.",
        },
      ],
      choices: [
        { label: "📊 What's the rest of the fleet running?", say: "What about the rest of the fleet — what's the full mix?", next: "ep9-fleet" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet-01-vegas": {
      id: "ep9-fleet-01-vegas",
      title: "Ep9 · What is Demo - 01 (Vegas)",
      db: "demo_fh_vegas4",
      events: [
        { type: "assistant", text: "Let me check Demo - 01's VIN." },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Device", search: { name: "Demo - 01" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "Demo - 01 — VIN 1FTBR1Y84PK500125",
          result: '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "1FTBR1Y84PK500125" }\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh_vegas4", vins: ["1FTBR1Y84PK500125"] },
          summary: "Ford Transit 250 cargo van",
          result: '[\n  { "make": "Ford", "model": "Transit 250", "body": "Cargo Van" }\n]',
        },
        {
          type: "assistant",
          text: "Demo - 01 is a Ford Transit 250 cargo van — one of 35 in this fleet, the other 15 being F-150 pickups for the heavier callouts.",
        },
      ],
      choices: [
        { label: "📊 What's the rest of the Vegas fleet running?", say: "What about the rest of the Vegas fleet — what's the full mix?", next: "ep9-fleet-vegas" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet-vegas": {
      id: "ep9-fleet-vegas",
      title: "Ep9 · What's in the Vegas fleet",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Device", propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "50 vehicles, 50 distinct VINs",
          result:
            '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "1FTBR1Y84PK500125" },\n' +
            '  { "name": "Demo - 45", "vehicleIdentificationNumber": "1FTFW1E84PK612049" },\n' +
            '  { "name": "Demo - 50", "vehicleIdentificationNumber": "1FTFW1E84PK612054" },\n' +
            '  … (50 distinct VINs, 2 distinct WMI+VDS prefixes)\n]',
        },
        {
          type: "tool",
          server: "geotab",
          name: "DecodeVins",
          args: { database: "demo_fh_vegas4", vins: ["1FTBR1Y84PK500125", "1FTFW1E84PK612040"] },
          summary: "Ford Transit 250 · Ford F-150",
          result:
            '[\n  { "make": "Ford", "model": "Transit 250", "body": "Cargo Van" },\n' +
            '  { "make": "Ford", "model": "F-150", "body": "Pickup" }\n]',
        },
        {
          type: "assistant",
          text:
            "Vegas is a field-service fleet: 35 Ford Transit 250 cargo vans doing the bulk of the downtown dispatch " +
            "work, and 15 Ford F-150 pickups for the heavier callouts.",
        },
      ],
      choices: [
        { label: "🔋 Is this fleet a good EV-conversion case?", say: "Short urban hops, back to a depot at night — is Vegas a good EV-conversion case?", next: "ep9-ev-vegas" },
        { label: "🚦 Drill into Vegas speeding", say: "Drill into Vegas — why is speeding up there?", next: "ep2-answer" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* -------------------------------------------------- ep9 · fleet composition */
    "ep9-fleet-hub": {
      id: "ep9-fleet-hub",
      title: "Ep9 · Fleet mix + EV candidates",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
          text: "Let me pull the VINs across the fleet first.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "50 vehicles, 5 distinct WMI+VDS prefixes",
          result:
            '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "WMAR62ZZ5LT034475" },\n' +
            '  { "name": "Demo - 06", "vehicleIdentificationNumber": "WDB9076571P106588" },\n' +
            '  { "name": "Demo - 08", "vehicleIdentificationNumber": "WDB9076571P106590" },\n' +
            '  { "name": "Demo - 21", "vehicleIdentificationNumber": "VF611A364JD011741" },\n' +
            '  … (50 distinct VINs, but only 5 distinct WMI+VDS prefixes — same manufacturer/model codes repeat, serials don\'t)\n]',
        },
        {
          type: "assistant",
          text: "Good news for decoding: the first 11 characters (manufacturer + model code) only repeat in 5 patterns across all 50, so I just need to decode one VIN per pattern to get the model for the whole fleet — not all 50.",
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
          type: "assistant",
          text:
            "Okay, decoded. This is a passenger-transport operation, not a delivery fleet — 30 intercity coaches " +
            "(25 MAN Lion's Intercity plus 5 Mercedes-Benz Intouro), 15 heavy goods units (10 Mercedes Actros and 5 " +
            "Renault T tractors, Euro 6), and just 5 light vans — Mercedes-Benz Sprinters, Demo - 06 through 10, " +
            "which includes your fault hot-spot Demo - 08.\n\n" +
            "On the EV question: the 5 Sprinters are the realistic near-term candidates — light, urban, predictable " +
            "routes. The coaches and 40-tonne tractors aren't close to viable yet.",
        },
        {
          type: "endcard",
          lines: ["Geotab MCP Connector", "It knows what you actually drive — not just how many."],
        },
      ],
      choices: [
        { label: "📊 Show that as a chart", say: "Show me the fleet composition as a chart.", next: "ep9-fleet-chart" },
        { label: "🌍 Which of these hit the Valencia zone?", say: "Which of these vehicles drive through Valencia's low-emission zone?", next: "ep3-answer" },
        { label: "🔋 Make the detailed EV case", say: "Make the detailed case for converting the Sprinters to EV — what would it take?", next: "ep9-ev" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "ep9-fleet": {
      id: "ep9-fleet",
      title: "Ep9 · What's in the fleet",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
          text: "Let me pull the VINs across the fleet first.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", propertySelector: { fields: ["name", "vehicleIdentificationNumber"] } },
          summary: "50 vehicles, 5 distinct WMI+VDS prefixes",
          result:
            '[\n  { "name": "Demo - 01", "vehicleIdentificationNumber": "WMAR62ZZ5LT034475" },\n' +
            '  { "name": "Demo - 06", "vehicleIdentificationNumber": "WDB9076571P106588" },\n' +
            '  { "name": "Demo - 08", "vehicleIdentificationNumber": "WDB9076571P106590" },\n' +
            '  { "name": "Demo - 21", "vehicleIdentificationNumber": "VF611A364JD011741" },\n' +
            '  … (50 distinct VINs, but only 5 distinct WMI+VDS prefixes — same manufacturer/model codes repeat, serials don\'t)\n]',
        },
        {
          type: "assistant",
          text: "Good news for decoding: the first 11 characters (manufacturer + model code) only repeat in 5 patterns across all 50, so I just need to decode one VIN per pattern to get the model for the whole fleet — not all 50.",
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
          type: "assistant",
          text:
            "Okay, decoded. This is a passenger-transport operation, not a delivery fleet — 30 intercity coaches " +
            "(25 MAN Lion's Intercity plus 5 Mercedes-Benz Intouro), 15 heavy goods units (10 Mercedes Actros and 5 " +
            "Renault T tractors, Euro 6), and just 5 light vans — Mercedes-Benz Sprinters, Demo - 06 through 10, " +
            "which includes your fault hot-spot Demo - 08.",
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
          type: "assistant",
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
          type: "assistant",
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

    "ep9-ev-vegas": {
      id: "ep9-ev-vegas",
      title: "Ep9 · EV-conversion case (Vegas)",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Trip", search: { deviceSearch: { ids: ["Demo - 01", "Demo - 02", "Demo - 03", "Demo - 45"] }, fromDate: "…30 days ago", toDate: "now" } },
          summary: "Transit sample ~58 mi/day; F-150 sample (Demo - 45) ~71 mi/day",
          result: '{ "transit": { "avgDailyMiles": 58, "maxSingleTrip_mi": 95, "longestGapBetweenTrips_h": 11 }, "f150": { "avgDailyMiles": 71, "maxSingleTrip_mi": 130, "longestGapBetweenTrips_h": 9 } }',
        },
        {
          type: "assistant",
          text:
            "Splitting it by vehicle type: the Transit vans average ~58 miles a day with an ~11-hour overnight gap — " +
            "comfortably within a mid-size EV van's range. The F-150s (sampled via Demo - 45) run longer and heavier " +
            "callouts, ~71 miles a day with a 130-mile single trip — still plausible for an EV pickup, but a tighter " +
            "case than the vans. Either way, the bigger blocker for this fleet's EV conversation isn't the hardware, " +
            "it's the speeding: fix the behavioral side first, then the EV case gets easier to make to the board.\n\n" +
            "(Worth flagging: the daily-mileage figures here are illustrative for the demo, directionally consistent " +
            "with how Transit/F-150 routes get used, but not a live total I'd quote to a vendor.)",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "It knows what you actually drive — not just how many."] },
      ],
      choices: [
        { label: "🚦 Drill into Vegas speeding", say: "Drill into Vegas — why is speeding up there?", next: "ep2-answer" },
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
          type: "assistant",
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
        { label: "🚐 What kind of vehicle is Demo - 01?", say: "What make and model is Demo - 01?", next: "ep9-fleet-01-vegas" },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          mapStyle: "vegas",
          summary: "Closest free units are one to two downtown blocks from the job",
          areas: [
            { kind: "industrial", x: 8, y: 10, w: 14, h: 14, rx: 1, rotate: -11 },
            { kind: "block", x: 25, y: 12, w: 13, h: 12, rx: 1, rotate: -11 },
            { kind: "block", x: 43, y: 8, w: 14, h: 14, rx: 1, rotate: -11 },
            { kind: "lot", x: 61, y: 11, w: 15, h: 12, rx: 1, rotate: -11 },
            { kind: "block", x: 16, y: 36, w: 14, h: 12, rx: 1, rotate: -11 },
            { kind: "block", x: 35, y: 34, w: 12, h: 11, rx: 1, rotate: -11 },
            { kind: "park", x: 54, y: 35, w: 15, h: 12, rx: 2, rotate: -11 },
            { kind: "block", x: 73, y: 34, w: 12, h: 12, rx: 1, rotate: -11 },
            { kind: "lot", x: 19, y: 62, w: 15, h: 12, rx: 1, rotate: -11 },
            { kind: "block", x: 39, y: 61, w: 13, h: 12, rx: 1, rotate: -11 },
            { kind: "block", x: 58, y: 60, w: 13, h: 12, rx: 1, rotate: -11 },
            { kind: "industrial", x: 77, y: 61, w: 13, h: 12, rx: 1, rotate: -11 },
          ],
          roads: [
            { kind: "highway", d: "M6 82 C22 76, 36 68, 50 58 S78 34, 96 28", label: "I‑515", labelX: 18, labelY: 75, labelRotate: -19 },
            { kind: "arterial", d: "M8 65 C24 58, 36 53, 50 48 S76 37, 94 31", label: "Fremont St", labelX: 26, labelY: 57, labelRotate: -18 },
            { kind: "arterial", d: "M14 34 C32 39, 43 43, 50 48 S64 61, 78 80", label: "Las Vegas Blvd", labelX: 33, labelY: 41, labelRotate: 31 },
            { kind: "local", d: "M75 6 C73 25, 72 44, 74 66 S77 86, 79 97" },
            { kind: "local", d: "M5 44 C24 45, 40 45, 62 40 S83 32, 98 36" },
            { kind: "local", d: "M25 18 C37 30, 44 39, 50 48 S62 66, 72 86" },
            { kind: "local", d: "M12 22 C29 27, 44 31, 64 27 S83 24, 96 27" },
            { kind: "local", d: "M20 90 C34 78, 43 68, 50 58 S65 42, 82 20" },
          ],
          intersections: [
            { x: 50, y: 48, r: 1.45 },
            { x: 36, y: 58, r: 1.05 },
            { x: 64, y: 39, r: 1.05 },
            { x: 74, y: 66, r: 0.95, kind: "minor" },
          ],
          pins: [
            { label: "Job site", x: 50, y: 48, status: "target" },
            { label: "Demo - 45", x: 36, y: 58, status: "free", value: 1.0 },
            { label: "Demo - 50", x: 64, y: 39, status: "free", value: 1.1 },
            { label: "Demo - 01 busy", x: 74, y: 66, status: "busy", value: 1.6 },
          ],
        },
        {
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
          text:
            "Putting both fleets side by side: utilization right now is Vegas 21/50 driving (42%) vs Spain 10/50 (20%). On safety, Vegas logged 4,933 exceptions this week vs Spain's 1,347 — nearly 4x — which lines up with the fleet-wide speeding pattern already flagged.\n\n" +
            "Maintenance flips the other way: Spain logged 599 faults (one Sprinter van, Demo - 08, owns 112 of them) vs Vegas's zero. And on sustainability, both fleets' VINs decode now — Spain's is 30 coaches, 15 heavy trucks/tractors, 5 EV-candidate Sprinter vans, while Vegas is 35 Transit cargo vans and 15 F-150 pickups doing short urban hops. Vegas is actually the stronger EV case on paper; the thing holding it back from that conversation is the speeding, not the hardware.\n\n" +
            "Two fleets, two different failure modes: Vegas's risk is behavioral, Spain's is mechanical and concentrated. Worth briefing the board on each separately since they need different fixes.",
        },
      ],
      choices: [
        { label: "💰 Put dollars on it (ROI case)", say: "Put dollars on this — where is the fleet leaking money and what's recoverable?", next: "ep-roi" },
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
          type: "assistant",
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
          type: "assistant",
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
          type: "assistant",
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

    /* ===================================================================== */
    /* ===== Sample-prompt scenarios (Safety / Maintenance / Ops / Agentic) = */
    /* ===================================================================== */

    /* ----------------------------------------- safety · riskiest "drivers" */
    "ep-safety-risk": {
      id: "ep-safety-risk",
      title: "Safety · Riskiest drivers this week",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Let me build you a proper Driver Safety Scorecard for the week — first confirming who's actually behind the " +
            "wheel of each vehicle.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "DriverChange", search: { fromDate: "…7 days ago", toDate: "now" }, propertySelector: { fields: ["driver", "device", "dateTime"] }, resultsLimit: 100 },
          summary: "49 of 50 vehicles have an assigned driver on shift this week",
          result:
            '[\n  { "driver": "Marcus Bell", "device": "Demo - 08" },\n' +
            '  { "driver": "Priya Nair", "device": "Demo - 01" },\n' +
            '  { "driver": "Tina Alvarez", "device": "Demo - 22" },\n' +
            '  { "driver": "Sam Whitfield", "device": "Demo - 33" },\n' +
            '  … (49 drivers assigned via Driver ID key fobs)\n]',
        },
        {
          type: "assistant",
          text:
            "Good — Driver ID is on, so I can attribute risk to the person, not just the vehicle. Now scoring each " +
            "driver: Ace blends their speeding, harsh braking/acceleration/cornering, seatbelt and any collision " +
            "events into one weighted safety score, the same way the Geotab Safety Center does.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Rank drivers by weighted safety score for the last 7 days. For each, give the score (0-100, higher is safer), total risk events, and the breakdown by event type.", new_chat: true },
          summary: "10 riskiest drivers · scores 47–68 vs fleet avg 78",
          result:
            '{ "answer": [\n' +
            '  { "rank": 1,  "driver": "Marcus Bell (Demo - 08)",   "score": 47, "events": 131, "mix": "Speeding 109 · Harsh brake 14 · Seatbelt 8" },\n' +
            '  { "rank": 2,  "driver": "Tina Alvarez (Demo - 22)",  "score": 52, "events": 119, "mix": "Harsh accel 31 · Speeding 74 · Cornering 14" },\n' +
            '  { "rank": 3,  "driver": "Sam Whitfield (Demo - 33)", "score": 55, "events": 102, "mix": "Harsh brake 41 · Speeding 56 · Cornering 5" },\n' +
            '  { "rank": 4,  "driver": "Devon Carter (Demo - 15)",  "score": 58, "events": 118, "mix": "Speeding 107 · Harsh brake 9 · Seatbelt 2" },\n' +
            '  { "rank": 5,  "driver": "Priya Nair (Demo - 01)",    "score": 61, "events": 121, "mix": "Speeding 111 · Cornering 7 · Harsh brake 3" },\n' +
            '  { "rank": 6,  "driver": "Luis Romero (Demo - 04)",   "score": 63, "events": 117, "mix": "Speeding 110 · Harsh accel 5 · Seatbelt 2" },\n' +
            '  { "rank": 7,  "driver": "Grace Kim (Demo - 10)",     "score": 65, "events": 116, "mix": "Speeding 110 · Harsh brake 4 · Accel 2" },\n' +
            '  { "rank": 8,  "driver": "Andre Foster (Demo - 25)",  "score": 66, "events": 110, "mix": "Speeding 107 · Seatbelt 3" },\n' +
            '  { "rank": 9,  "driver": "Ben Ortiz (Demo - 16)",     "score": 67, "events": 113, "mix": "Speeding 107 · Harsh accel 6" },\n' +
            '  { "rank": 10, "driver": "Chloe Tran (Demo - 20)",    "score": 68, "events": 109, "mix": "Speeding 107 · Harsh brake 2" } ] }',
        },
        {
          type: "assistant",
          text:
            "Here's your week. Fleet average safety score is **78** (the Geotab community benchmark for similar fleets " +
            "is ~82), and it slipped **6% week-over-week** — so the trend's the wrong way, mostly on speed.\n\n" +
            "**Your ten riskiest drivers:**\n\n" +
            "1. **Marcus Bell** (Demo - 08) — score 47 · 131 events — *Speeding 109, harsh braking 14, seatbelt 8*\n" +
            "2. **Tina Alvarez** (Demo - 22) — 52 · 119 — *Harsh accel 31, speeding 74, cornering 14*\n" +
            "3. **Sam Whitfield** (Demo - 33) — 55 · 102 — *Harsh braking 41, speeding 56*\n" +
            "4. **Devon Carter** (Demo - 15) — 58 · 118 — *Speeding 107, harsh braking 9*\n" +
            "5. **Priya Nair** (Demo - 01) — 61 · 121 — *Speeding 111*\n" +
            "6. **Luis Romero** (Demo - 04) — 63 · 117 — *Speeding 110*\n" +
            "7. **Grace Kim** (Demo - 10) — 65 · 116 — *Speeding 110*\n" +
            "8. **Andre Foster** (Demo - 25) — 66 · 110 — *Speeding 107*\n" +
            "9. **Ben Ortiz** (Demo - 16) — 67 · 113 — *Speeding 107*\n" +
            "10. **Chloe Tran** (Demo - 20) — 68 · 109 — *Speeding 107*\n\n" +
            "The read underneath the list matters more than the list. **Seven of the ten are pure speeders**, clustered " +
            "within a few points of each other — that's a systemic problem (shared routes and limits), and the fix is a " +
            "policy plus a live alert, not ten separate chats.\n\n" +
            "But **three break that pattern and deserve a real conversation this week**: Marcus Bell is the only " +
            "multi-factor risk (speed *and* braking *and* seatbelt — the combination insurers weight most heavily for " +
            "collision likelihood); Tina Alvarez is your aggression case (31 harsh accelerations); and Sam Whitfield " +
            "has the fewest events but the most *severe* ones — 41 hard brakes. Note he ranks third on score despite " +
            "the lowest event count: severity outweighs volume, which is exactly why the score beats a raw tally.\n\n" +
            "If you want the dollars: harsh-braking and speeding events are the two strongest telematics predictors of " +
            "at-fault collisions, and a single at-fault collision in a fleet like this averages well into five figures " +
            "once you load in downtime and premium impact. Coaching the three multi-factor drivers is the cheapest risk " +
            "you'll buy down all quarter.\n\n" +
            "*(Driver names in this demo are fictional — but this is exactly the view a manager sees once Driver ID is " +
            "enabled and they have the permission to see it.)*",
        },
        {
          type: "chart",
          title: "Driver safety score · 10 riskiest this week (lower = higher risk · fleet avg 78)",
          bars: bars(D.vegas && D.vegas.safetyScorecard, "driver", "score"),
        },
      ],
      choices: [
        { label: "🛠️ Make this a weekly safety-scorecard skill", say: "Turn this into a reusable weekly safety-scorecard skill anyone on my team can run.", next: "ep-safety-skill" },
        { label: "🧑‍🏫 Draft coaching notes for their manager", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🛑 Dig into the harsh-braking cases", say: "Show me a breakdown of harsh braking events by driver over the last 30 days.", next: "ep-safety-harsh" },
        { label: "🔔 Set a fleet-wide speed alert", say: "Set up a posted-speed alert across the fleet and send it to one fleet manager.", next: "ep2-action" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- safety · harsh braking by driver */
    "ep-safety-harsh": {
      id: "ep-safety-harsh",
      title: "Safety · Harsh braking by driver",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Let me pull harsh-braking events for the last 30 days, broken out by driver — and graded by severity, " +
            "because a gentle tap and a near-collision both log as \"harsh brake\" but they're not the same problem.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Harsh braking events in the last 30 days by driver. For the top drivers give total events split into severe / moderate / mild by deceleration g-force, plus their change vs the previous 30 days.", new_chat: true },
          summary: "412 events fleet-wide · top 5 drivers own 196 (48%)",
          result:
            '{ "fleetTotal": 412, "fleetTrendVsPrev30d": "-12%", "byDriver": [\n' +
            '  { "driver": "Sam Whitfield (Demo - 33)",  "total": 58, "severe": 9, "moderate": 21, "mild": 28, "trend": "+22%" },\n' +
            '  { "driver": "Tina Alvarez (Demo - 22)",   "total": 47, "severe": 6, "moderate": 18, "mild": 23, "trend": "+4%" },\n' +
            '  { "driver": "Marcus Bell (Demo - 08)",    "total": 39, "severe": 5, "moderate": 14, "mild": 20, "trend": "-8%" },\n' +
            '  { "driver": "Grace Kim (Demo - 10)",      "total": 28, "severe": 2, "moderate": 9,  "mild": 17, "trend": "-15%" },\n' +
            '  { "driver": "Devon Carter (Demo - 15)",   "total": 24, "severe": 1, "moderate": 8,  "mild": 15, "trend": "-3%" } ] }',
        },
        {
          type: "assistant",
          text:
            "Here's the 30-day picture. Fleet-wide harsh braking is actually **down 12%** — so the program's working " +
            "overall. But the average hides the one driver you need to look at.\n\n" +
            "**Harsh braking by driver (severe / moderate / mild):**\n\n" +
            "- **Sam Whitfield** (Demo - 33) — **58** events (9 severe, 21 moderate, 28 mild) · **▲ +22%**\n" +
            "- **Tina Alvarez** (Demo - 22) — 47 (6 / 18 / 23) · ▲ +4%\n" +
            "- **Marcus Bell** (Demo - 08) — 39 (5 / 14 / 20) · ▼ -8%\n" +
            "- **Grace Kim** (Demo - 10) — 28 (2 / 9 / 17) · ▼ -15%\n" +
            "- **Devon Carter** (Demo - 15) — 24 (1 / 8 / 15) · ▼ -3%\n\n" +
            "Sam Whitfield is the outlier on every axis that matters: most events, the most **severe** ones (9 hard " +
            "decelerations over 0.45 g — that's near-collision braking, not traffic), and the only driver trending the " +
            "wrong way at **+22%** while the fleet improves. Everyone else on this list is either flat or coming down.\n\n" +
            "So this isn't a fleet talk — it's one targeted coaching conversation with Sam this week, before a severe " +
            "brake becomes a rear-end claim. Want me to look at *where* his severe events happen? If they cluster, it " +
            "might be a route problem as much as a driving one.",
        },
        {
          type: "chart",
          title: "Severe harsh-braking events (>0.45 g) by driver · last 30 days",
          bars: bars(D.vegas && D.vegas.harshBraking && D.vegas.harshBraking.byDriver, "driver", "severe"),
        },
      ],
      choices: [
        { label: "📍 Where do Sam's severe brakes happen?", say: "Map where Sam Whitfield's severe braking events happen — is it a route problem?", next: "ep-safety-harsh-spain" },
        { label: "🧑‍🏫 Draft a coaching note for Sam", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🚦 Back to the full risk scorecard", say: "Show me the ten riskiest drivers this week and their top events.", next: "ep-safety-risk" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-safety-harsh-spain": {
      id: "ep-safety-harsh-spain",
      title: "Safety · Harsh-braking hotspot",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Good instinct — before we put it all on Sam, let me pull the GPS location of each of his harsh-braking " +
            "events and see if they cluster anywhere.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { ruleSearch: { id: "RuleHarshBrakingId" }, deviceSearch: { id: "b33 (Demo - 33)" }, fromDate: "…30 days ago", toDate: "now" }, propertySelector: { fields: ["activeFrom", "latitude", "longitude"] }, resultsLimit: 100 },
          summary: "58 events geocoded · 23 cluster at one intersection, mostly 16:00–18:00",
          result:
            '// reverse-geocoded + bucketed by location and hour\n' +
            '{ "topCluster": { "location": "W Charleston Blvd & S Rancho Dr", "events": 23, "of": 58, "peakHours": "16:00–18:00", "severeHere": 7 },\n' +
            '  "elsewhere": "35 events scattered, no second cluster" }',
        },
        {
          type: "map",
          title: "Sam Whitfield · harsh-braking hotspot (30 days)",
          mapStyle: "hotspot",
          summary: "23 of 58 events cluster at Charleston & Rancho; 35 are dispersed",
          areas: [
            { kind: "lot", x: 7, y: 9, w: 15, h: 14, rx: 1, rotate: 4 },
            { kind: "block", x: 25, y: 8, w: 16, h: 13, rx: 1, rotate: 4 },
            { kind: "park", x: 60, y: 8, w: 18, h: 13, rx: 2, rotate: 4 },
            { kind: "industrial", x: 78, y: 11, w: 13, h: 11, rx: 1, rotate: 4 },
            { kind: "block", x: 8, y: 31, w: 15, h: 13, rx: 1, rotate: 4 },
            { kind: "block", x: 27, y: 32, w: 14, h: 12, rx: 1, rotate: 4 },
            { kind: "lot", x: 58, y: 33, w: 15, h: 12, rx: 1, rotate: 4 },
            { kind: "block", x: 76, y: 34, w: 14, h: 12, rx: 1, rotate: 4 },
            { kind: "block", x: 10, y: 66, w: 17, h: 13, rx: 1, rotate: 4 },
            { kind: "industrial", x: 31, y: 67, w: 15, h: 12, rx: 1, rotate: 4 },
            { kind: "block", x: 58, y: 68, w: 14, h: 12, rx: 1, rotate: 4 },
            { kind: "lot", x: 78, y: 69, w: 14, h: 12, rx: 1, rotate: 4 },
          ],
          roads: [
            { kind: "arterial", d: "M4 47 C22 43, 37 44, 50 46 S76 52, 96 47", label: "W Charleston Blvd", labelX: 11, labelY: 42, labelRotate: -5 },
            { kind: "arterial", d: "M48 4 C47 24, 49 36, 50 46 S52 70, 56 96", label: "S Rancho Dr", labelX: 53, labelY: 18, labelRotate: 82 },
            { kind: "local", d: "M17 72 C31 65, 42 58, 50 46 S63 29, 76 20" },
            { kind: "local", d: "M17 23 C33 29, 42 38, 50 46 S67 61, 82 72" },
            { kind: "local", d: "M9 16 C25 20, 37 25, 49 34 S70 47, 94 55" },
            { kind: "local", d: "M7 83 C27 75, 41 66, 54 58 S78 48, 96 43" },
            { kind: "local", d: "M30 4 C34 22, 38 34, 43 45 S50 72, 50 96" },
            { kind: "local", d: "M70 4 C68 22, 65 36, 61 48 S58 75, 62 96" },
          ],
          intersections: [
            { x: 50, y: 46, r: 1.65 },
            { x: 43, y: 45, r: 0.95, kind: "minor" },
            { x: 61, y: 48, r: 0.95, kind: "minor" },
            { x: 50, y: 58, r: 0.95, kind: "minor" },
          ],
          pins: [
            { label: "Charleston & Rancho · 23", x: 50, y: 46, status: "busy" },
            { x: 30, y: 64, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 70, y: 34, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 64, y: 68, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 36, y: 30, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 58, y: 82, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 22, y: 47, status: "free", compact: true, title: "Other harsh-braking event" },
            { x: 83, y: 51, status: "free", compact: true, title: "Other harsh-braking event" },
          ],
        },
        {
          type: "assistant",
          text:
            "That reframes it. **40% of Sam's harsh braking — 23 of 58, including 7 of his 9 severe events — happens at " +
            "one intersection**: West Charleston & South Rancho, and almost all of it between 4 and 6pm.\n\n" +
            "A single driver braking hard all over town is a driving-habit problem. A single driver braking hard at the " +
            "*same corner at the same time every day* is a **route problem** — a badly-timed light, a blind merge, or a " +
            "schedule that puts him through that junction at peak. The fix is probably two-pronged: a quick word with " +
            "Sam about the approach, *and* re-sequencing his afternoon runs to avoid that intersection at rush hour.\n\n" +
            "This is the kind of thing that never shows up in a per-driver leaderboard — you only see it when you put " +
            "the events on a map. Worth checking whether any *other* drivers spike at that same corner; if so, it's " +
            "infrastructure, and fully on the route, not the people.",
        },
      ],
      choices: [
        { label: "🧑‍🏫 Draft Sam's coaching note", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🚦 Back to the risk scorecard", say: "Show me the ten riskiest drivers this week and their top events.", next: "ep-safety-risk" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ----------------------------------------- safety · school-zone speeding */
    "ep-safety-schoolzone": {
      id: "ep-safety-schoolzone",
      title: "Safety · Speeding in school zones",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "I can answer this two ways, and I'll do both. Quick framing first: Geotab doesn't tag an event \"school " +
            "zone\" on its own — that comes from a geofence. Let me check what's configured, then cross-reference the " +
            "posted-speed data for this month regardless.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh_vegas4", typeName: "Zone", search: { name: "%school%" }, propertySelector: { fields: ["id", "name"] } },
          summary: "no dedicated school-zone geofences yet — falling back to posted-speed proxy",
          result: '{ "result": [] }',
        },
        {
          type: "assistant",
          text:
            "No school-zone geofences are set up yet, so I can't give you a precise, geofenced count. But I don't have " +
            "to leave you empty-handed: the posted-speed data already knows the limit on every segment, so I'll match " +
            "this month's speeding events against the low-limit (≤20 mph) segments that sit next to Clark County " +
            "schools.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "This month, speeding events on ≤20 mph posted segments within 150 m of a school, by driver — with the school and the worst speed.", new_chat: true },
          summary: "7 violations · 3 drivers · all during school hours",
          result:
            '{ "answer": [\n' +
            '  { "driver": "Marcus Bell (Demo - 08)",  "violations": 4, "near": "Walter Bracken STEAM",  "worst": "34 in a 15 mph zone", "when": "07:50, school in" },\n' +
            '  { "driver": "Devon Carter (Demo - 15)", "violations": 2, "near": "John S. Park Elementary", "worst": "29 in a 15 mph zone", "when": "15:10, school out" },\n' +
            '  { "driver": "Chloe Tran (Demo - 20)",   "violations": 1, "near": "Las Vegas Academy",       "worst": "26 in a 20 mph zone", "when": "08:05, school in" } ],\n' +
            '  "note": "proxy match — confirm with dedicated geofences for enforcement-grade numbers" }',
        },
        {
          type: "assistant",
          text:
            "Here's what this month looks like, even without the geofences: **7 speeding events on school-zone-grade " +
            "segments, across 3 drivers, every one of them during school arrival or dismissal hours** — which is " +
            "exactly when it matters most.\n\n" +
            "- **Marcus Bell** (Demo - 08) — 4 events near Walter Bracken STEAM, worst was **34 mph in a posted 15** at " +
            "07:50, right at morning drop-off. (He's already your #1 risk driver this week — this is the same person.)\n" +
            "- **Devon Carter** (Demo - 15) — 2 near John S. Park Elementary, 29 in a 15, at afternoon dismissal.\n" +
            "- **Chloe Tran** (Demo - 20) — 1 near Las Vegas Academy, 26 in a 20.\n\n" +
            "Two things follow. **Now:** Marcus needs a direct conversation today — doing 34 past an elementary at " +
            "drop-off is the kind of thing that ends up on local news. **Going forward:** let me turn these from a " +
            "best-effort proxy into hard, enforceable numbers by dropping actual school-zone geofences with their own " +
            "15/20 mph rules — then this question answers itself every month and alerts you live, not in arrears.",
        },
        {
          type: "chart",
          title: "School-zone speeding events this month · by driver (posted-speed proxy)",
          bars: bars(D.vegas && D.vegas.schoolZone && D.vegas.schoolZone.byDriver, "driver", "violations"),
        },
      ],
      choices: [
        { label: "🏫 Make it enforceable — create the geofences", say: "Create the school-zone geofences with 15/20 mph speeding alerts so this is exact going forward.", next: "ep-safety-schoolzone-create" },
        { label: "🧑‍🏫 Coach Marcus on the drop-off speeding", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🛣️ Verify the posted limits on his route", say: "Pull the posted road speed along Demo - 08's actual route so we can coach on facts.", next: "ep-safety-postedspeed-08" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-safety-schoolzone-create": {
      id: "ep-safety-schoolzone-create",
      title: "Safety · Create school-zone alert",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "I'll geofence the three schools that already flagged this month — Walter Bracken STEAM, John S. Park " +
            "Elementary and Las Vegas Academy — at 150 m each, with their posted limits. Geotab's Add creates one " +
            "entity per call, so I'll batch the three zones into a single ExecuteMultiCall — one round-trip, three " +
            "Adds — and get the new zone IDs back in order.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "ExecuteMultiCall",
          args: { database: "demo_fh_vegas4", calls: [
            { method: "Add", params: { typeName: "Zone", entity: { name: "School Zone — Walter Bracken STEAM", radius_m: 150 } } },
            { method: "Add", params: { typeName: "Zone", entity: { name: "School Zone — John S. Park Elementary", radius_m: 150 } } },
            { method: "Add", params: { typeName: "Zone", entity: { name: "School Zone — Las Vegas Academy", radius_m: 150 } } },
          ] },
          summary: "MultiCall · 3× Add(Zone) — geofences created (150 m each)",
          write: true,
          result: '[ "Zoneb…bracken", "Zoneb…park", "Zoneb…lva" ]',
        },
        {
          type: "assistant",
          text: "Zones are in. Now a speeding rule on each at its real posted limit (15 mph for the two elementaries, 20 for the Academy), separate from your fleet-wide limit — again batched, one Add per zone, scoped to the IDs I just got back.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "ExecuteMultiCall",
          args: { database: "demo_fh_vegas4", calls: [
            { method: "Add", params: { typeName: "Rule", entity: { name: "Speeding — Walter Bracken STEAM", zone: "Zoneb…bracken", thresholdMph: 15 } } },
            { method: "Add", params: { typeName: "Rule", entity: { name: "Speeding — John S. Park Elementary", zone: "Zoneb…park", thresholdMph: 15 } } },
            { method: "Add", params: { typeName: "Rule", entity: { name: "Speeding — Las Vegas Academy", zone: "Zoneb…lva", thresholdMph: 20 } } },
          ] },
          summary: "MultiCall · 3× Add(Rule) — one rule per zone at its posted limit",
          write: true,
          result: '[ "Ruleb…sz-bracken", "Ruleb…sz-park", "Ruleb…sz-lva" ]',
        },
        {
          type: "assistant",
          text: "And routing the alert to one fleet manager so a school-zone breach pings someone in the moment.",
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
          type: "assistant",
          text:
            "Done — three school-zone geofences, a speeding rule on each at its real posted limit, and live alerts to a " +
            "manager. From now on, anything over the limit inside one of these is flagged the moment it happens, " +
            "tagged to the driver.\n\n" +
            "Two things you've gained: this month's question (\"who sped in a school zone?\") is now an *exact, " +
            "enforcement-grade* query instead of a proxy — and you'll never have to ask it retroactively again, because " +
            "Marcus or anyone else doing 30 past Bracken at drop-off now triggers an alert that day. Send me the rest " +
            "of your school list and I'll clone these across all of them in one pass.",
        },
        {
          type: "confirm",
          changes: [
            "3 school-zone geofences created (150 m) on demo_fh_vegas4",
            "Speeding rules scoped to each zone at its posted limit (15 / 15 / 20 mph)",
            "Live alert routed to 1 fleet manager",
          ],
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "From a best-effort proxy to live enforcement, in one ask."] },
      ],
      choices: [
        { label: "🧑‍🏫 Now coach the drivers who triggered it", say: "Now identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🚦 Show my riskiest drivers", say: "Now show me my ten riskiest drivers this week.", next: "ep-safety-risk" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ----------------------------------------- safety · posted-speed truth-check (Demo - 08, school zone) */
    "ep-safety-postedspeed-08": {
      id: "ep-safety-postedspeed-08",
      title: "Safety · Posted-speed truth-check (Demo - 08)",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Before anyone coaches Marcus, let's make sure the numbers hold up. I'll pull the posted road speed along " +
            "Demo - 08's actual route on the morning of the worst event, segment by segment — so the conversation is " +
            "\"on this 15 mph stretch past Bracken at 07:50 you were at 34,\" not \"you were speeding somewhere.\"",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetPostedRoadSpeedsForDevice",
          args: { database: "demo_fh_vegas4", deviceId: "b8 (Demo - 08)", fromDate: "07:30", toDate: "08:10" },
          summary: "per-segment posted limits past Walter Bracken STEAM · 15–35 mph",
          result:
            '[\n  { "date": "…07:48", "maxSpeed_kmh": 56.33, "isEstimate": false },  // 35 mph (arterial approach)\n' +
            '  { "date": "…07:50", "maxSpeed_kmh": 24.14, "isEstimate": false },  // 15 mph (school zone, posted)\n' +
            '  { "date": "…07:51", "maxSpeed_kmh": 24.14, "isEstimate": false },  // 15 mph (school zone, posted)\n' +
            '  { "date": "…07:53", "maxSpeed_kmh": 48.28, "isEstimate": false }   // 30 mph (residential)\n]',
        },
        {
          type: "assistant",
          text:
            "It holds up — and it's not ambiguous. At **07:50 and 07:51 the posted limit is a confirmed 15 mph** " +
            "(24 km/h, not an estimate) on the segment that runs right past Walter Bracken STEAM. Demo - 08's GPS speed " +
            "on those same two segments was **34 mph** — more than double the posted school-zone limit, at morning " +
            "drop-off.\n\n" +
            "The approach segment a minute earlier is a 35 mph arterial, so this isn't a case of a driver carrying " +
            "honest highway speed into a badly-signed zone — the limit drops to 15 exactly where the school is, and the " +
            "speed didn't. That's a clean, defensible coaching fact: same driver, real road, posted limit on file, no " +
            "estimate to argue with.",
        },
      ],
      choices: [
        { label: "🧑‍🏫 Coach Marcus on the drop-off speeding", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🏫 Make it enforceable — create the geofences", say: "Create the school-zone geofences with 15/20 mph speeding alerts so this is exact going forward.", next: "ep-safety-schoolzone-create" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- maintenance · overdue service */
    "ep-maint-overdue": {
      id: "ep-maint-overdue",
      title: "Maintenance · Overdue for service",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
          text:
            "Let me read your maintenance reminders against each vehicle's live odometer and engine hours, and pull " +
            "everything that's past due right now.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh4", prompt: "Which vehicles are past due on any maintenance reminder right now? Give the service type, how far overdue (km or days), and the assigned driver.", new_chat: true },
          summary: "5 vehicles overdue · 1 is a legal roadworthiness inspection",
          result:
            '{ "answer": [\n' +
            '  { "vehicle": "Demo - 25 (MAN coach)",   "driver": "Núria Pons",  "service": "Annual roadworthiness (ITV)", "overdue": "19 days", "priority": "CRITICAL — legal" },\n' +
            '  { "vehicle": "Demo - 02 (MAN coach)",   "driver": "Iker Sáez",   "service": "Brake inspection",           "overdue": "6,100 km", "priority": "HIGH — passenger safety" },\n' +
            '  { "vehicle": "Demo - 14 (Actros truck)","driver": "Marta Ferrer","service": "Engine oil & filter",        "overdue": "8,400 km", "priority": "HIGH" },\n' +
            '  { "vehicle": "Demo - 19 (Actros truck)","driver": "Bruno Gil",   "service": "Engine oil & filter",        "overdue": "4,700 km", "priority": "MEDIUM" },\n' +
            '  { "vehicle": "Demo - 41 (Renault T)",   "driver": "Aitor Vidal", "service": "DPF service / tyre rotation", "overdue": "3,900 km", "priority": "MEDIUM" } ] }',
        },
        {
          type: "assistant",
          text:
            "Five vehicles are past due — and the order to work them isn't by how overdue they are, it's by what " +
            "happens if you keep driving them:\n\n" +
            "1. **Demo - 25** (MAN coach, Núria Pons) — **annual roadworthiness inspection, 19 days overdue.** This one " +
            "jumps the queue: it's not a wear item, it's a *legal* one. A coach carrying passengers on an expired ITV " +
            "is an uninsured-in-an-incident problem and a fine waiting to happen. Book it today.\n" +
            "2. **Demo - 02** (MAN coach, Iker Sáez) — **brake inspection, 6,100 km over.** Passenger vehicle, braking " +
            "system, well past due — high priority on safety alone.\n" +
            "3. **Demo - 14** (Actros, Marta Ferrer) — engine oil & filter, 8,400 km over. Most overdue by distance; " +
            "deferring oil on a truck this far is how a €200 service becomes a €6–8k engine.\n" +
            "4–5. **Demo - 19** and **Demo - 41** — routine, medium priority, can batch into next week's shop slots.\n\n" +
            "Net: two must-do-now (one legal, one brakes), one high, two routine. Your five Sprinter vans, for contrast, " +
            "are all comfortably within interval. Want me to book the top one into the garage and hold a slot?\n\n" +
            "*(Confirm against the shop's own records before sign-off — but these are read straight from the configured " +
            "reminders, not guessed.)*",
        },
        {
          type: "chart",
          title: "Maintenance overdue · by distance/time past due",
          bars: bars(D.spain && D.spain.overdue, "chartLabel", "chartValue"),
        },
      ],
      choices: [
        { label: "📧 Book the critical one into the garage", say: "Book Demo - 25's overdue roadworthiness inspection — draft an email to the garage and put a tentative service slot on my calendar for tomorrow morning.", next: "ep-maint-overdue-book" },
        { label: "⚠️ What faults are flagged this week?", say: "Show me any fault codes flagged in the last seven days and their severity.", next: "ep-maint-severity" },
        { label: "⏱️ Which assets had the most downtime?", say: "Which assets have had the most unplanned downtime this quarter?", next: "ep-maint-downtime" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- maintenance · fault severity */
    "ep-maint-severity": {
      id: "ep-maint-severity",
      title: "Maintenance · Fault codes + severity",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
          text:
            "Let me pull this week's faults and triage them by the warning-lamp status that rides with each one — " +
            "red-stop, amber-warning, or informational. That J1939 lamp is where real severity lives, and it's what " +
            "separates \"pull over now\" from \"noise.\"",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh4", typeName: "FaultData", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "597 fault records this week",
          result: '{ "result": 597 }',
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "FaultData", search: { fromDate: "…7 days ago", toDate: "now" }, propertySelector: { fields: ["diagnostic", "device", "redStopLamp", "amberWarningLamp"] }, resultsLimit: 700 },
          summary: "3 CRITICAL (red) · 14 WARNING (amber) · 580 informational device faults",
          result:
            '{ "critical_redLamp": [\n' +
            '    { "vehicle": "Demo - 12 (Actros)",  "driver": "Pau Serra",    "fault": "Brake system air pressure low" },\n' +
            '    { "vehicle": "Demo - 28 (MAN coach)","driver": "Lucía Mena",  "fault": "Engine coolant temperature high" },\n' +
            '    { "vehicle": "Demo - 31 (MAN coach)","driver": "Roberto Vila","fault": "SCR aftertreatment — derate imminent" } ],\n' +
            '  "warning_amberLamp": { "DPF regeneration required": 5, "AdBlue/DEF low": 4, "Battery voltage low": 3, "Tyre pressure low": 2 },\n' +
            '  "informational_device": 580  // GO unplugged / power / GPS, concentrated on the 5 Sprinters\n}',
        },
        {
          type: "assistant",
          text:
            "597 looks like the wheels are coming off. They're not — but **3 of them genuinely need action today**, and " +
            "the value here is that severity triage pulls those 3 out of the noise instead of burying them.\n\n" +
            "**🔴 Critical — red stop lamp, same-day (3):**\n" +
            "- **Demo - 12** (Actros, Pau Serra) — *brake system air pressure low.* A loaded truck with failing air " +
            "brakes — stop and inspect before its next run, no exceptions.\n" +
            "- **Demo - 28** (MAN coach, Lucía Mena) — *coolant temperature high.* Overheating; risk of a cracked head " +
            "if it keeps running. Pull it.\n" +
            "- **Demo - 31** (MAN coach, Roberto Vila) — *SCR aftertreatment, engine derate imminent.* Will limp-mode " +
            "mid-route and strand passengers if ignored.\n\n" +
            "**🟡 Warning — amber, schedule this week (14):** 5× DPF regeneration, 4× AdBlue low, 3× low battery, 2× " +
            "low tyre pressure. None strand a vehicle today, but the DPF and AdBlue ones become derates if left.\n\n" +
            "**⚪ Informational (580):** the rest are GO-device connectivity faults — the unit unplugged or lost power — " +
            "almost all of them on your five Sprinter vans (Demo - 06–10). Zero engine lamps. That's not 580 problems, " +
            "it's one wiring job; batch it.\n\n" +
            "So the worklist writes itself: **3 vehicles off the road now**, 14 booked this week, and one harness fix " +
            "for the Sprinters that'll make 95% of this number disappear.",
        },
        {
          type: "chart",
          title: "Actionable faults by type · last 7 days (informational device faults excluded)",
          bars: (D.spain && D.spain.faults && D.spain.faults.actionableChart) || [],
        },
      ],
      choices: [
        { label: "📧 Book the 3 critical units in now", say: "Pull the critical fault details for the 3 red-lamp units, draft an email to the garage, and put tentative service slots on my calendar for tomorrow morning.", next: "ep-maint-severity-book" },
        { label: "🔎 Why does one van fault so much? Dig in", say: "Demo - 08 keeps showing up in the device faults — why? Dig into it and don't stop at the first explanation.", next: "ep12-investigate" },
        { label: "⏱️ Which assets had the most downtime?", say: "Which assets have had the most unplanned downtime this quarter?", next: "ep-maint-downtime" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- maintenance · book the overdue legal item (Demo - 25, ITV) */
    "ep-maint-overdue-book": {
      id: "ep-maint-overdue-book",
      title: "Maintenance · Book the overdue ITV (Demo - 25)",
      db: "demo_fh4",
      events: [
        { type: "system", text: "This flow spans three connectors: Geotab + Gmail + Google Calendar." },
        {
          type: "assistant",
          text:
            "Starting with the one that can't wait — Demo - 25, the MAN coach whose annual roadworthiness inspection " +
            "(ITV) is 19 days overdue. Let me pull its details so the garage knows exactly what's coming in.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { id: "b25" }, propertySelector: { fields: ["name", "vehicleIdentificationNumber", "licensePlate"] } },
          summary: "Demo - 25 — MAN Lion's Coach, plate 4471-MAN",
          result: '[\n  { "name": "Demo - 25", "vehicleIdentificationNumber": "WMA12XZZ9NP012345", "licensePlate": "4471-MAN" }\n]',
        },
        {
          type: "assistant",
          text:
            "MAN Lion's Coach, plate 4471-MAN, driver Núria Pons. Drafting the email to the garage now — flagging it as a " +
            "legal ITV, not a routine service — and leaving it in Drafts, not sending without you looking first.",
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "garage@test-mailbox.example", subject: "URGENT — Demo - 25 (MAN Lion's Coach, plate 4471-MAN) — ITV roadworthiness 19 days overdue" },
          summary: "Draft saved (NOT sent)",
          write: true,
          result: '{ "draftId": "r-…", "status": "in Drafts, awaiting your review" }',
        },
        {
          type: "assistant",
          text: "Saved, not sent. Now holding a tentative slot for tomorrow morning so the coach is off the road and legal again as fast as possible.",
        },
        {
          type: "tool",
          server: "google-calendar",
          name: "create_event",
          args: { title: "ITV inspection — Demo - 25 (legal, overdue)", when: "tomorrow 09:00", status: "tentative" },
          summary: "Tentative ITV slot — tomorrow 09:00",
          write: true,
          result: '{ "eventId": "…", "status": "tentative" }',
        },
        {
          type: "assistant",
          text:
            "Here's where that landed across three tools. **Demo - 25** (MAN Lion's Coach, plate 4471-MAN, Núria Pons) is " +
            "**19 days past its legal roadworthiness inspection** — a passenger coach running on an expired ITV is the " +
            "one item on the list that's a fine-and-insurance problem, not just a wear item. I drafted the garage email " +
            "marked urgent and left it in Drafts, and put a tentative 09:00 slot on the calendar so you don't lose " +
            "tomorrow's window.\n\n" +
            "The other four overdue vehicles (brakes on Demo - 02, then the oil/DPF items) can batch behind this one.\n\n" +
            "(This demo points at a test mailbox and calendar, never a real recipient.)",
        },
      ],
      choices: [
        { label: "⚠️ What faults are flagged this week?", say: "Show me any fault codes flagged in the last seven days and their severity.", next: "ep-maint-severity" },
        { label: "⏱️ Which assets had the most downtime?", say: "Which assets have had the most unplanned downtime this quarter?", next: "ep-maint-downtime" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ----------------------------------------- maintenance · book the 3 critical red-lamp units */
    "ep-maint-severity-book": {
      id: "ep-maint-severity-book",
      title: "Maintenance · Book the 3 red-lamp units",
      db: "demo_fh4",
      events: [
        { type: "system", text: "This flow spans three connectors: Geotab + Gmail + Google Calendar." },
        {
          type: "assistant",
          text:
            "These are the three red-stop-lamp faults from the triage — the ones that should come off the road today. " +
            "Pulling each vehicle's details so the garage knows the fault and the asset before it arrives.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Device", search: { ids: ["b12", "b28", "b31"] }, propertySelector: { fields: ["name", "licensePlate"] } },
          summary: "Demo - 12 (Actros) · Demo - 28 (MAN coach) · Demo - 31 (MAN coach)",
          result:
            '[\n  { "name": "Demo - 12", "licensePlate": "2210-ACT", "fault": "Brake system air pressure low" },\n' +
            '  { "name": "Demo - 28", "licensePlate": "3380-MAN", "fault": "Engine coolant temperature high" },\n' +
            '  { "name": "Demo - 31", "licensePlate": "3410-MAN", "fault": "SCR aftertreatment — derate imminent" }\n]',
        },
        {
          type: "assistant",
          text:
            "Got all three. Drafting one email to the garage covering the trio — Demo - 12 (brake air pressure), Demo - 28 " +
            "(coolant temp), Demo - 31 (SCR derate) — and leaving it in Drafts for your review.",
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "garage@test-mailbox.example", subject: "URGENT — 3 red-lamp units off the road: Demo - 12 (brakes), Demo - 28 (coolant), Demo - 31 (SCR derate)" },
          summary: "Draft saved (NOT sent)",
          write: true,
          result: '{ "draftId": "r-…", "status": "in Drafts, awaiting your review" }',
        },
        {
          type: "assistant",
          text: "Saved, not sent. Now holding three tentative slots for tomorrow morning so all three are booked the moment you send.",
        },
        {
          type: "tool",
          server: "google-calendar",
          name: "create_event",
          args: { title: "Critical service — Demo - 12 / 28 / 31 (red-lamp)", when: "tomorrow 08:00–10:00", status: "tentative" },
          summary: "3 tentative service slots — tomorrow AM",
          write: true,
          result: '{ "eventId": "…", "status": "tentative", "count": 3 }',
        },
        {
          type: "assistant",
          text:
            "Here's the result across three tools. The **3 red-stop-lamp units** — **Demo - 12** (Actros, brake air " +
            "pressure low, Pau Serra), **Demo - 28** (MAN coach, coolant high, Lucía Mena), **Demo - 31** (MAN coach, SCR " +
            "derate imminent, Roberto Vila) — each have a real reason to stop before their next run. I drafted one garage " +
            "email covering all three (in Drafts, marked urgent) and held three tentative slots for tomorrow morning.\n\n" +
            "The 14 amber-lamp items can wait for this week's scheduled shop time, and the 580 informational device faults " +
            "are the Sprinter harness job — not part of this booking.\n\n" +
            "(This demo points at a test mailbox and calendar, never a real recipient.)",
        },
      ],
      choices: [
        { label: "🔎 Why does one van fault so much? Dig in", say: "Demo - 08 keeps showing up in the device faults — why? Dig into it and don't stop at the first explanation.", next: "ep12-investigate" },
        { label: "📋 Which vehicles are overdue for service?", say: "Which vehicles are overdue for scheduled maintenance right now?", next: "ep-maint-overdue" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ----------------------------------------- maintenance · unplanned downtime */
    "ep-maint-downtime": {
      id: "ep-maint-downtime",
      title: "Maintenance · Unplanned downtime",
      db: "demo_fh4",
      events: [
        {
          type: "assistant",
          text:
            "I'll measure unplanned downtime the way it actually hurts you — days a vehicle sat out of service while its " +
            "peer group was working — and tie each spell to the fault that caused it and what the lost availability " +
            "cost. Pulling the quarter.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh4", prompt: "This quarter, rank vehicles by unplanned downtime days (out of service while peers were active). For each give the likely cause and estimated cost of lost availability.", new_chat: true },
          summary: "≈38 down-days fleet-wide · top 5 = 27.8 (73%) · est. €23k lost",
          result:
            '{ "fleetDownDays": 38, "estLostAvailabilityEUR": 23400, "byVehicle": [\n' +
            '  { "vehicle": "Demo - 08 (Sprinter)", "downDays": 9.2, "cause": "recurring power/connector fault",      "estCostEUR": 3700 },\n' +
            '  { "vehicle": "Demo - 06 (Sprinter)", "downDays": 6.1, "cause": "connector fault + awaiting parts",     "estCostEUR": 2450 },\n' +
            '  { "vehicle": "Demo - 28 (MAN coach)","downDays": 4.2, "cause": "coolant/overheat repair",             "estCostEUR": 3360 },\n' +
            '  { "vehicle": "Demo - 12 (Actros)",   "downDays": 3.5, "cause": "brake system repair",                 "estCostEUR": 2800 },\n' +
            '  { "vehicle": "Demo - 07 (Sprinter)", "downDays": 4.8, "cause": "connector fault",                     "estCostEUR": 1920 } ] }',
        },
        {
          type: "assistant",
          text:
            "About **38 vehicle-days lost this quarter — roughly €23k in unavailability** — and it's concentrated: the " +
            "top five assets account for ~28 of those days (73%). Two clusters explain almost all of it:\n\n" +
            "**Cluster 1 — the Sprinter vans (Demo - 06, 07, 08):** ~20 down-days between them, all the same root cause " +
            "— the recurring power/connector fault we've been tracking. **Demo - 08 alone is 9.2 days down** this " +
            "quarter, which is exactly why its mileage runs a third of the fleet: it's parked, not lightly scheduled. " +
            "This is the cheapest win on the board — one harness fix across the three vans claws back most of those 20 " +
            "days and ~€8k.\n\n" +
            "**Cluster 2 — the heavy assets (Demo - 28 coach, Demo - 12 truck):** ~8 down-days, and these are your " +
            "*expensive* days — a coach or truck off the road bleeds €800–900/day in lost work, versus ~€400 for a van. " +
            "Both trace to faults already flagged as critical this week (overheat, brakes), so catching those earlier " +
            "is what shortens these spells next quarter.\n\n" +
            "Bottom line: downtime here isn't bad luck spread thin — it's two fixable causes on seven vehicles. Close " +
            "those and you take a visible bite out of both the day count and the €23k.",
        },
        {
          type: "chart",
          title: "Unplanned down-days this quarter · top 5 vehicles",
          bars: bars(D.spain && D.spain.downtime && D.spain.downtime.byVehicle, "label", "downDays"),
        },
      ],
      choices: [
        { label: "🔎 Why does Demo - 08 keep faulting?", say: "Demo - 08 keeps showing up — why? Dig into it and don't stop at the first explanation.", next: "ep12-investigate" },
        { label: "⚠️ Fault codes + severity this week", say: "Show me any fault codes flagged in the last seven days and their severity.", next: "ep-maint-severity" },
        { label: "📅 What's overdue for service?", say: "Which vehicles are overdue for scheduled maintenance right now?", next: "ep-maint-overdue" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- operations · fuel economy by type */
    "ep-ops-fuel": {
      id: "ep-ops-fuel",
      title: "Operations · Fuel economy by type",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Fuel economy reads from each vehicle's engine data. This fleet is two body types — 35 Ford Transit 250 " +
            "cargo vans and 15 F-150 pickups — so let me split consumption and distance that way, and put a dollar " +
            "figure on it.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "This month, average fuel economy (mpg) by vehicle type, total fuel spend, and the 3 vehicles dragging their type's average down with their drivers.", new_chat: true },
          summary: "Vans 18.2 mpg · pickups 15.1 · $41.5k spend · 3 outliers identified",
          result:
            '{ "byType": [ { "type": "Ford Transit 250 (van)", "count": 35, "mpg": 18.2, "ratedMpg": 19.5 },\n' +
            '              { "type": "Ford F-150 (pickup)",   "count": 15, "mpg": 15.1, "ratedMpg": 16.0 } ],\n' +
            '  "fleetMonthlyFuelUSD": 41500, "fleetBlendedMpg": 17.3,\n' +
            '  "worstVsTypeAvg": [\n' +
            '    { "driver": "Marcus Bell (Demo - 08)",  "mpg": 14.9, "vsType": "-18%" },\n' +
            '    { "driver": "Devon Carter (Demo - 15)", "mpg": 15.6, "vsType": "-14%" },\n' +
            '    { "driver": "Priya Nair (Demo - 01)",   "mpg": 16.0, "vsType": "-12%" } ] }',
        },
        {
          type: "assistant",
          text:
            "Here's the month. The 35 Transit vans average **18.2 mpg** (rated 19.5), the 15 F-150 pickups **15.1** " +
            "(rated 16), and the fleet blends to **17.3**. Total fuel spend is about **$41.5k**.\n\n" +
            "But the average is the boring part. Look at *who's* below it: the three vans dragging the van fleet down — " +
            "**Marcus Bell at 14.9 mpg (-18%)**, Devon Carter at 15.6, Priya Nair at 16.0 — are the **exact same names " +
            "at the top of your speeding and risk lists.** That's not a coincidence: hard speed and harsh events burn " +
            "fuel. Your worst safety drivers are also your worst fuel drivers.\n\n" +
            "Which means one intervention pays three ways. The posted-speed policy you'd run for safety also recovers " +
            "fuel: closing the gap between your fleet (17.3) and its rated economy is worth roughly **6–8%, on the order " +
            "of $2.5–3k a month** — and it lands hardest on the same handful of drivers. Safety, fuel, and emissions, " +
            "one lever.\n\n" +
            "(And the vans' tight, short urban duty cycle is exactly the profile that makes them your EV-conversion " +
            "candidates — happy to make that case next.)",
        },
        {
          type: "chart",
          title: "Average fuel economy by vehicle type · this month (mpg, vs rated)",
          bars: (((D.vegas && D.vegas.fuel && D.vegas.fuel.byType) || []).reduce(function (acc, t) {
            acc.push({ label: t.shortType + " — actual", value: t.mpg });
            acc.push({ label: t.shortType + " — rated", value: t.ratedMpg });
            return acc;
          }, [])),
        },
      ],
      choices: [
        { label: "🔋 Are these EV-replacement candidates?", say: "Which of these vehicles are candidates for EV replacement based on daily mileage patterns?", next: "ep9-ev-vegas" },
        { label: "💤 Where are we losing fuel to idling?", say: "Show me which routes had the longest idle times last week.", next: "ep-ops-idle" },
        { label: "🔔 Run the speed policy that recovers it", say: "Set up a posted-speed alert across the fleet and send it to one fleet manager.", next: "ep2-action" },
        { label: "💰 Roll it into the full ROI case", say: "Roll this into the full picture — where is the fleet leaking money overall?", next: "ep-roi" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- operations · longest idle times */
    "ep-ops-idle": {
      id: "ep-ops-idle",
      title: "Operations · Longest idle times",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "Let me rank last week's idling by driver, and convert the hours into the thing that actually lands in a " +
            "budget meeting — fuel burned and dollars, for zero miles moved.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Last 7 days: total engine idle hours fleet-wide and by driver (top 5), with estimated fuel wasted in gallons, dollars, and CO2.", new_chat: true },
          summary: "118 idle-hours fleet · ≈59 gal · ≈$210/wk ($10.9k/yr) · top 5 = 40%",
          result:
            '{ "fleetIdleHours7d": 118, "gallons": 59, "costUSD": 210, "annualizedUSD": 10920, "co2_kg": 525,\n' +
            '  "topByDriver": [\n' +
            '    { "driver": "Hannah Brooks (Demo - 17)", "idleHours": 6.1, "costUSD": 10.9 },\n' +
            '    { "driver": "Eddie Vance (Demo - 29)",   "idleHours": 5.4, "costUSD": 9.6 },\n' +
            '    { "driver": "Sam Whitfield (Demo - 33)", "idleHours": 4.8, "costUSD": 8.5 },\n' +
            '    { "driver": "Rosa Mendez (Demo - 41)",   "idleHours": 4.3, "costUSD": 7.6 },\n' +
            '    { "driver": "Will Dawson (Demo - 05)",   "idleHours": 3.9, "costUSD": 6.9 } ] }',
        },
        {
          type: "assistant",
          text:
            "Last week the fleet idled **118 hours** — about **59 gallons, ~$210, and half a tonne of CO₂ — burned " +
            "going nowhere.** Annualized that's roughly **$10.9k a year** straight out the tailpipe at a standstill.\n\n" +
            "Top idlers (these five are ~40% of it):\n" +
            "- **Hannah Brooks** (Demo - 17) — 6.1 h\n" +
            "- **Eddie Vance** (Demo - 29) — 5.4 h\n" +
            "- **Sam Whitfield** (Demo - 33) — 4.8 h\n" +
            "- **Rosa Mendez** (Demo - 41) — 4.3 h\n" +
            "- **Will Dawson** (Demo - 05) — 3.9 h\n\n" +
            "In Las Vegas heat most of this is AC-on-while-parked — understandable, but it's invisible today because " +
            "nothing flags it in the moment; it only ever surfaces in a report like this one, after the fuel's gone.\n\n" +
            "The fix is one rule: flag any idle past 10 minutes and nudge the driver live. Fleets that do this typically " +
            "cut idle 20–30% in the first month — call it **$2–3k/year recovered** here, plus the emissions win, for a " +
            "rule that takes me ten seconds to create. Want it on?",
        },
        {
          type: "chart",
          title: "Idle hours by driver · last 7 days (top 5)",
          bars: bars(D.vegas && D.vegas.idle && D.vegas.idle.byDriver, "driver", "idleHours"),
        },
      ],
      choices: [
        { label: "🔔 Create an idling alert (>10 min)", say: "Set up an idling alert for anything over 10 minutes and route it to a manager.", next: "ep-ops-idle-alert" },
        { label: "⛽ How's my fuel economy overall?", say: "What is my average fuel economy by vehicle type this month?", next: "ep-ops-fuel" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-ops-idle-alert": {
      id: "ep-ops-idle-alert",
      title: "Operations · Create idling alert",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text: "Creating the idling rule first — threshold at 10 minutes.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Rule", entity: { name: "Idling > 10 min" } },
          summary: "Idling rule created",
          write: true,
          result: '{ "result": "Ruleb…idling-10" }',
        },
        {
          type: "assistant",
          text: "Live. Now routing the alert to one fleet manager.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Add",
          args: { database: "demo_fh_vegas4", typeName: "Notification", entity: { recipient: "one fleet manager (by name)" } },
          summary: "Idling alerts routed to 1 manager",
          write: true,
          result: '{ "result": "Notificationb…" }',
        },
        {
          type: "assistant",
          text:
            "Done — anything idling past 10 minutes is flagged live now and goes to a manager. Next week's idle list " +
            "should already be shorter, because people get nudged in the moment instead of in a report nobody reads.",
        },
        {
          type: "confirm",
          changes: [
            "Rule \"Idling > 10 min\" created and active on demo_fh_vegas4",
            "Notification routed to 1 fleet manager",
          ],
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "Catch it in the moment, not in the monthly."] },
      ],
      choices: [
        { label: "⛽ Now check fuel economy", say: "What is my average fuel economy by vehicle type this month?", next: "ep-ops-fuel" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* ----------------------------------------- agentic · assess top 3 safety risks */
    "ep-agentic-safety": {
      id: "ep-agentic-safety",
      title: "Agentic · Top 3 safety risks + fixes",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "assistant",
          text:
            "This is an assessment, not a single lookup — so let me gather every safety signal across the fleet, score " +
            "the drivers, check exposure around sensitive areas, then rank the top three risks and pair each with a " +
            "concrete fix and a number.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetCountOf",
          args: { database: "demo_fh_vegas4", typeName: "ExceptionEvent", search: { fromDate: "…7 days ago", toDate: "now" } },
          summary: "4,811 exception events this week (≈20,600 / 30 days)",
          result: '{ "result": 4811 }',
        },
        {
          type: "assistant",
          text: "Nearly 5,000 this week. Now the shape of it — scoring drivers and checking where the severe events land.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Summarize fleet safety this week: event mix, fleet safety score vs benchmark and trend, the multi-factor high-risk drivers, and any speeding near schools.", new_chat: true },
          summary: "score 78 (▼6%) · 90% speeding · 3 multi-factor drivers · 7 school-zone events",
          result:
            '{ "fleetSafetyScore": 78, "benchmark": 82, "trendWoW": "-6%",\n' +
            '  "eventMix": { "speeding": "90%", "harshBrake": "6%", "harshAccel": "3%", "seatbelt": "1%" },\n' +
            '  "multiFactorDrivers": ["Marcus Bell (Demo - 08)", "Tina Alvarez (Demo - 22)", "Sam Whitfield (Demo - 33)"],\n' +
            '  "schoolZoneEvents": 7, "schoolZoneDrivers": ["Marcus Bell", "Devon Carter", "Chloe Tran"] }',
        },
        {
          type: "assistant",
          text:
            "Here's the assessment — top three safety risks, ranked by what they'll actually cost you, each with the " +
            "corrective action I'd take:\n\n" +
            "**1. Systemic speeding — the dominant, fleet-wide risk.** 90% of ~4,800 weekly events, and the top ten " +
            "drivers sit within 5% of each other — a tight cluster with no outlier is the signature of a *system* " +
            "(shared routes, limits, expectations), not a few bad actors. It's dragging your fleet safety score to 78, " +
            "below the 82 benchmark and down 6% this week.\n" +
            "→ *Fix:* a fleet-wide posted-speed rule + live alert + a written speed policy. This is also your biggest " +
            "*fuel* lever (~$2.5–3k/mo) — one move, two budgets.\n\n" +
            "**2. Three multi-factor drivers who need a conversation this week.** Most of the fleet is speeding-only, " +
            "but **Marcus Bell** (speed + braking + seatbelt — the combination most predictive of an at-fault crash), " +
            "**Tina Alvarez** (31 harsh accelerations) and **Sam Whitfield** (9 severe brakes, 40% at one intersection) " +
            "stand apart.\n" +
            "→ *Fix:* targeted 1:1 coaching for these three — the cheapest risk you'll buy down all quarter, given an " +
            "at-fault collision runs well into five figures loaded.\n\n" +
            "**3. School-zone exposure at drop-off/dismissal.** 7 speeding events this month on school-grade segments, " +
            "across Marcus Bell, Devon Carter and Chloe Tran — every one during school hours. Low count, very high " +
            "consequence (and reputational).\n" +
            "→ *Fix:* drop school-zone geofences with their posted limits so these are flagged live, and coach the three " +
            "named drivers now.\n\n" +
            "If you do just #1 and #2 this week, you move the fleet score, the fuel bill and your single worst " +
            "collision exposure at the same time. Want me to start — the live speed alert, or the coaching notes?",
        },
        {
          type: "chart",
          title: "This week's exception mix · where the risk actually is",
          bars: (function () {
            var m = (D.vegas && D.vegas.eventMixPct) || {};
            return [
              { label: "Speeding", value: m.speeding },
              { label: "Harsh braking", value: m.harshBrake },
              { label: "Harsh accel", value: m.harshAccel },
              { label: "Seatbelt", value: m.seatbelt },
            ];
          })(),
        },
      ],
      choices: [
        { label: "✅ Do #1 — create the speed alert now", say: "Do #1 — set up the fleet-wide posted-speed alert and send it to one fleet manager.", next: "ep2-action" },
        { label: "🧑‍🏫 Do #2 — draft the coaching notes", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "🏫 Do #3 — geofence the school zones", say: "Create the school-zone geofences with speeding alerts so we catch drop-off speeding live.", next: "ep-safety-schoolzone-create" },
        { label: "💰 What's all this worth? (ROI case)", say: "What's all this worth — total the recoverable savings and build me the ROI case.", next: "ep-roi" },
        { label: "🚦 Show the full driver scorecard", say: "Who are my ten riskiest drivers this week, and their top events?", next: "ep-safety-risk" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    /* ----------------------------------------- agentic · coaching summary draft */
    "ep-agentic-coaching": {
      id: "ep-agentic-coaching",
      title: "Agentic · Draft coaching summary",
      db: "demo_fh_vegas4",
      events: [
        { type: "system", text: "This flow spans two connectors: Geotab + Gmail." },
        {
          type: "assistant",
          text:
            "The useful coaching list isn't \"everyone who sped\" — that's a policy problem, not a coaching one. It's the " +
            "handful whose risk is *individual* and specific. Let me pull those drivers with the one concrete thing " +
            "each should hear.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Which drivers need 1:1 safety coaching this week (individual, non-systemic risk), and what is the single most specific, fact-based talking point for each?", new_chat: true },
          summary: "3 drivers flagged for 1:1 coaching, each with a specific data point",
          result:
            '{ "answer": [\n' +
            '  { "driver": "Marcus Bell (Demo - 08)",   "why": "multi-factor: speed + harsh braking + 8 seatbelt + 4 school-zone events", "score": 47 },\n' +
            '  { "driver": "Tina Alvarez (Demo - 22)",  "why": "31 harsh accelerations — aggressive launches, up 4%", "score": 52 },\n' +
            '  { "driver": "Sam Whitfield (Demo - 33)", "why": "9 severe brakes, 40% at Charleston & Rancho 16:00-18:00", "score": 55 } ] }',
        },
        {
          type: "assistant",
          text:
            "Three drivers, three different conversations — drafting a note your line manager can act on directly, one " +
            "specific and fair paragraph each. Leaving it in Drafts, not sending it.",
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "ops-manager@test-mailbox.example", subject: "1:1 safety coaching — 3 drivers this week (with specifics)" },
          summary: "Draft saved (NOT sent)",
          write: true,
          openByDefault: true,
          result:
            "To: ops-manager@test-mailbox.example\n" +
            "Subject: 1:1 safety coaching — 3 drivers this week (with specifics)\n\n" +
            "Hi,\n\n" +
            "Three drivers stand out this week for *individual* coaching (the broader speeding is a fleet-wide policy " +
            "issue I'm handling separately with a live alert — please don't single people out for that one).\n\n" +
            "1) Marcus Bell (Demo - 08) — highest-risk driver this week, safety score 47. It's not one habit, it's the " +
            "stack: speeding, harsh braking, 8 unbelted starts, and 4 speeding events in school zones at drop-off " +
            "(34 mph in a posted 15 near Walter Bracken). Lead with the seatbelt and the school zones — those are " +
            "non-negotiable and easiest to fix immediately.\n\n" +
            "2) Tina Alvarez (Demo - 22) — 31 harsh accelerations, trending up. Aggressive launches; hard on fuel and " +
            "the drivetrain as well as risk. Talking point: smooth starts, and it'll show up in her economy too.\n\n" +
            "3) Sam Whitfield (Demo - 33) — 9 severe braking events, and 40% of them are at the same corner (W " +
            "Charleston & S Rancho, 4–6pm). Worth coaching the approach AND looking at re-sequencing his afternoon run " +
            "— this is partly a route problem, so please don't frame it as all on him.\n\n" +
            "Happy to attach the per-event detail for any of these if useful in the conversation.\n\n" +
            "Thanks",
        },
        {
          type: "assistant",
          text:
            "Draft's saved, not sent — open the card above to read it. Each driver gets a specific, evidence-backed " +
            "paragraph and a fair framing: Marcus's seatbelt and school-zone events lead because they're the " +
            "non-negotiables; Tina's note connects her habit to fuel so it's not just a telling-off; and Sam's " +
            "explicitly flags that his issue is partly the route, not just him.\n\n" +
            "That's the difference between a coaching note a manager can use tomorrow and a leaderboard that just names " +
            "and shames. (This demo points at a test mailbox, and the driver names are fictional — never a real " +
            "recipient or record.)",
        },
      ],
      choices: [
        { label: "📤 Send it to the manager now", say: "It looks right — send the coaching summary now.", next: "ep-coaching-send" },
        { label: "🛡️ Assess the top 3 risks behind this", say: "Assess my fleet for the top three safety risks and suggest corrective actions.", next: "ep-agentic-safety" },
        { label: "🔔 Set the live speed alert instead", say: "Skip the email — just set up the fleet-wide posted-speed alert.", next: "ep2-action" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-coaching-send": {
      id: "ep-coaching-send",
      title: "Agentic · Send coaching summary",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "gmail",
          name: "send_message",
          args: { draftId: "r-…coaching" },
          summary: "Sent to ops-manager@test-mailbox.example",
          write: true,
          result: '{ "messageId": "r-…", "status": "sent" }',
        },
        {
          type: "assistant",
          text:
            "Sent. The manager now has Marcus, Tina and Sam each with a specific, fair talking point — and the framing " +
            "that the wider speeding is a policy fix, not three scapegoats. The conversations start in the right place. " +
            "The live speed alert is the natural companion to this if you haven't set it yet.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "From fleet data to a manager's inbox, in one ask."] },
      ],
      choices: [
        { label: "🔔 Now set the live speed alert", say: "Now set up the fleet-wide posted-speed alert and route it to a manager.", next: "ep2-action" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    /* --------------------------- warehouse · Geotab → MotherDuck teaching path */
    "warehouse-intro": {
      id: "warehouse-intro",
      title: "Warehouse · simplest path",
      mode: "warehouse",
      events: [
        {
          type: "system",
          text: "Starting from an already-connected Geotab MCP server and a MotherDuck Lite account.",
        },
        {
          type: "assistant",
          text:
            "**Is this even a good idea? Yes — once your questions get bigger than a single API call.**\n\n" +
            "The live MCP connector is great at point questions about current state. A warehouse is for the analytical ones: **joining trips + faults + exceptions + GPS together**, joining all of that **against your own data** — fuel cards, maintenance ERP, payroll, weather — aggregating the **whole fleet at once**, slicing by group or vehicle type, and yes, trends over time too. You ask them **repeatedly and cheaply** without re-pulling from the live API, on data you **own and control**, so you can hang dashboards, scheduled briefs and agent skills off it. The connector is the access layer; MotherDuck is the durable memory layer. (If you want the battle-tested, non-MCP route instead, Geotab's open-source **MyGeotab API Adapter** has replicated fleet data into Postgres/SQL Server for years — ask *“Is this what Geotab recommends?”* below.)\n\n" +
            "Here's the genuinely cool part: **the assistant orchestrates the entire pipeline with MCP calls** — no ETL service, no Airflow, no glue code. It asks Geotab (MCP) for the data and tells MotherDuck (MCP) to load, transform and schedule it. Extract, load, transform, refresh — all just tool calls in this chat. Geotab Ace even hands back a **signed CSV URL** that MotherDuck reads *directly*, so nothing is ever downloaded.\n\n" +
            "And we pick **MotherDuck specifically for its free tier**: a 50-vehicle fleet runs at **$0** for years, so you can stand this whole thing up without a budget conversation.\n\n" +
            "So here's the plan: one concrete loop first — ask for raw GPS rows, load the signed CSV into `gps_points`, query it. Once that works, the reason for bronze/silver/gold becomes obvious: repeatable loads, typed rows, dedup, provenance, quality checks, and cost controls.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "No tables yet",
          subtitle: "The first mental model is just: a CSV result becomes stored warehouse rows.",
          metrics: [
            { label: "Source", value: D.warehouse.source },
            { label: "First table", value: "gps_points" },
            { label: "Architecture", value: "not yet" },
            { label: "Goal", value: "see rows land" },
          ],
          stages: D.warehouse.stages.empty,
          note: "👉 Open the Warehouse panel at the top of the chat — it tracks every table as we build it (empty for now). Bronze/silver/gold is intentionally not introduced yet; it will make more sense after the direct load works.",
        },
      ],
      choices: [
        { label: "🦆 Start with GPS rows", say: "I already connected the Geotab MCP and created a free-tier MotherDuck account. Build me a warehouse starting with GPS points.", next: "warehouse-setup" },
        { label: "❓ Is this what Geotab recommends?", say: "Is this what Geotab recommends?", next: "warehouse-geotab-recommendation" },
        { label: "❓ What is MotherDuck?", say: "Before we start — what actually is MotherDuck?", next: "warehouse-what-is" },
        { label: "↩︎ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-geotab-recommendation": {
      id: "warehouse-geotab-recommendation",
      title: "Warehouse · Geotab recommendation?",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Not as an official recommendation. This MCP-orchestrated Geotab → MotherDuck warehouse path is a **proof of concept**: new, interesting in this MCP world, and not yet tested at scale. The assistant can coordinate both sides — ask Geotab for rows, then ask MotherDuck to load and transform them — without a separate ETL service.\n\n" +
            "The proven pattern Geotab customers have used for years is the open-source **[MyGeotab API Adapter](https://github.com/Geotab/mygeotab-api-adapter/blob/master/MyGeotabAPIAdapter/README.md)** — a mature .NET service (no MCP involved) that replicates your fleet data into your own **PostgreSQL or SQL Server** database. It pulls incrementally through MyGeotab data feeds (GPS logs, trips, faults, and more), keeps device/user/zone reference data cached, and ships with production plumbing: retries, transactions, partition maintenance. Standing it up is a classic, well-documented data engineering project — you run the service once and your database fills itself.\n\n" +
            "So the honest framing: **MyGeotab API Adapter** for battle-tested replication into Postgres/SQL Server you operate yourself; **this MCP + MotherDuck path** for a lightweight, conversation-driven warehouse you can stand up in a chat at $0. We'll keep updating this node as the MCP approach matures.",
        },
      ],
      choices: [
        { label: "🦆 Continue with GPS rows", say: "Understood. Continue with the experimental MCP path and start with GPS rows.", next: "warehouse-setup" },
        { label: "⏱ How fresh can the MCP path get?", say: "The adapter polls every few seconds. How fresh can this MCP warehouse actually be?", next: "warehouse-freshness" },
        { label: "❓ What is MotherDuck?", say: "Before we start — what actually is MotherDuck?", next: "warehouse-what-is" },
        { label: "↩︎ Back to the warehouse intro", say: "Go back to the warehouse intro.", next: "warehouse-intro" },
      ],
    },

    "warehouse-what-is": {
      id: "warehouse-what-is",
      title: "Warehouse · what is MotherDuck",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "**MotherDuck** is a serverless analytics warehouse built on **DuckDB** — the fast in-process SQL engine. You get DuckDB's speed with cloud storage, sharing and scale, plus a generous free tier, so a fleet warehouse like the one we're about to build can start at **$0**.\n\n" +
            "Why it fits this Geotab workflow specifically:\n" +
            "- It can read the **signed CSV URLs** Geotab Ace returns *directly* — `read_csv_auto('https://…')`, no download and no separate ETL service.\n" +
            "- It speaks standard **DuckDB SQL** (window functions, `DISTINCT ON`, `QUALIFY`, spatial + H3), so the bronze/silver/gold transforms are just SQL.\n" +
            "- The `query` / `query_rw` tools the assistant calls here are the real MotherDuck MCP interface — what you see is what you'd run.\n\n" +
            "Full docs, the free tier and pricing are on their site: **[motherduck.com](https://motherduck.com)**.",
        },
      ],
      choices: [
        { label: "🦆 Start with GPS rows", say: "Got it. Now build me a warehouse starting with GPS points.", next: "warehouse-setup" },
        { label: "↩︎ Back to the warehouse intro", say: "Go back to the warehouse intro.", next: "warehouse-intro" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-setup": {
      id: "warehouse-setup",
      title: "Warehouse · get many points",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "I'll ask Geotab Ace for raw GPS rows with exact columns. No dashboard, no summary. The response includes a signed CSV URL that MotherDuck can read directly.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh4",
            new_chat: true,
            prompt: "List every GPS position log recorded after 2026-06-26 01:42:40 UTC, across all devices. Return exact columns: DeviceId, DeviceName, DeviceTimeZoneId, Latitude, Longitude, GpsDateTime, Speed. Use UTC timezone. Do not summarize or aggregate.",
          },
          summary: "signed CSV URL returned · 157,419 GPS rows",
          result: "Ace response includes columns, generated SQL, preview rows and a signed storage.googleapis.com CSV URL that expires in ~24h.",
        },
        {
          type: "assistant",
          text: "Got it — Ace returned **157,419 rows** as a signed CSV (the URL expires in ~24h). Nothing is stored yet. Want me to load it straight into a MotherDuck table?",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "gps_points ready",
          subtitle: "We have not modeled anything yet — we just have a large result set ready for MotherDuck.",
          metrics: [
            { label: "Rows", value: "157,419" },
            { label: "Columns", value: "7" },
            { label: "Format", value: "signed CSV" },
            { label: "Expires", value: "~24h" },
          ],
          stages: D.warehouse.stages.schemas,
          note: "This is the simplest bridge: a large signed CSV result can be read directly into MotherDuck.",
        },
      ],
      choices: [
        { label: "📥 Load the CSV into MotherDuck", say: "Now create one MotherDuck table and load that signed CSV URL into it.", next: "warehouse-first-load" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-first-load": {
      id: "warehouse-first-load",
      title: "Warehouse · one-table load",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Now create **one table** called `gps_points`, then let MotherDuck read the signed CSV URL directly. No Python download, no local file, no ETL service — just MCP calls.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE DATABASE IF NOT EXISTS geotab_demo_fh4; CREATE OR REPLACE TABLE geotab_demo_fh4.gps_points AS SELECT * FROM read_csv_auto('<signed-ace-csv-url>', all_varchar=true);" },
          summary: "gps_points created from Ace CSV",
          result: "157,419 rows loaded into geotab_demo_fh4.gps_points",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT DeviceName, Latitude, Longitude, GpsDateTime, Speed FROM geotab_demo_fh4.gps_points LIMIT 5;" },
          summary: "table is queryable",
          result: "5 sample GPS rows returned · columns are still strings because this is the simple first pass",
        },
        {
          type: "assistant",
          text: "Done — `gps_points` holds all 157,419 rows and the test query returns them. Notice the columns came back as raw strings; that's the first thing we'll fix.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "gps_points loaded",
          subtitle: "A beginner can now see the loop: signed CSV → MotherDuck table → SQL query.",
          metrics: [
            { label: "Table", value: "gps_points" },
            { label: "Rows", value: "157,419" },
            { label: "Load path", value: "read_csv_auto" },
            { label: "Types", value: "raw strings" },
          ],
          stages: D.warehouse.stages.loaded,
          note: "👉 Open the Warehouse panel to watch gps_points fill — expand its sample rows to see the raw strings land. This direct table is intentionally naive: perfect for teaching the connection, but not yet safe for repeated daily loads.",
        },
      ],
      choices: [
        { label: "🧠 Why isn't one table enough?", say: "This works, but before I schedule it daily, follow this skill and show me why one raw table isn't production-ready: [https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md)", next: "warehouse-layering" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-layering": {
      id: "warehouse-layering",
      title: "Warehouse · why layers appear",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Following the [geotab-motherduck-warehouse skill](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/SKILL.md) you pointed me at. The one-table load worked, but three problems show up the moment you run it again tomorrow:\n\n" +
            "- The signed CSV URL expires, so you need a durable copy of exactly what Ace returned.\n" +
            "- Ace can overlap boundary seconds and sometimes changes SQL choices, so repeated loads need dedup and provenance.\n" +
            "- Raw CSV columns are strings; analytics need typed timestamps, numbers and stable keys.\n\n" +
            "So we refactor the simple `gps_points` table into layers: **bronze** keeps the raw/replayable rows, **silver** is typed and deduped, and **gold** is the business-ready table.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE SCHEMA IF NOT EXISTS bronze; CREATE SCHEMA IF NOT EXISTS silver; CREATE SCHEMA IF NOT EXISTS gold; CREATE OR REPLACE TABLE bronze.gps_raw AS SELECT *, now() AS _loaded_at, '<ace-chat-id>' AS _ace_chat_id, '<signed-url>' AS _source_url FROM geotab_demo_fh4.gps_points; CREATE OR REPLACE TABLE silver.planet_gps_pings AS SELECT DISTINCT DeviceId, DeviceName, DeviceTimeZoneId, try_cast(Latitude AS DOUBLE) AS latitude, try_cast(Longitude AS DOUBLE) AS longitude, try_cast(GpsDateTime AS TIMESTAMP) AS gps_datetime_utc, try_cast(Speed AS DOUBLE) AS speed_kmh FROM bronze.gps_raw WHERE DeviceId IS NOT NULL AND GpsDateTime IS NOT NULL;" },
          summary: "simple table refactored into bronze + silver",
          result: "bronze.gps_raw keeps 157,419 raw rows · silver.planet_gps_pings keeps typed/deduped rows",
        },
        {
          type: "assistant",
          text: "Refactored — **bronze** keeps the raw replay copy, **silver** holds the typed, deduped rows. Same data, now safe to reload daily.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Layered tables",
          subtitle: "The simulator introduces bronze/silver/gold only after the simple CSV-to-table path works.",
          metrics: [
            { label: "Bronze", value: "raw replay" },
            { label: "Silver", value: "typed rows" },
            { label: "Gold", value: "later marts" },
            { label: "Why", value: "repeatable loads" },
          ],
          stages: D.warehouse.stages.layered,
          note: "👉 In the Warehouse panel you can now see the bronze/silver/gold split. Bronze/silver/gold is not ceremony — it fixes URL expiry, overlap, type casting, dedup and provenance.",
        },
      ],
      choices: [
        { label: "🔁 Show the incremental refresh", say: "Now show the daily incremental refresh with watermarks and dedup.", next: "warehouse-incremental" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-incremental": {
      id: "warehouse-incremental",
      title: "Warehouse · incremental refresh",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Now I can run the daily version safely: I ask MotherDuck for the silver watermark, hand that timestamp to Ace, land the new CSV in bronze, then insert only rows newer than the watermark into silver.\n\n" +
            "This step is where the earlier layers pay off: **Ace only honors sub-second boundaries to the second**, so overlap is normal, and **read the returned SQL every time** before loading because Ace can inject predicates.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT max(GpsDateTime) AS watermark FROM silver.planet_gps_pings;" },
          summary: "watermark found",
          result: "2026-06-29 23:58:12.614 UTC",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh4",
            new_chat: true,
            prompt: "List every GPS position log recorded after 2026-06-29 23:58:12 UTC, across all devices. Return exact columns: DeviceId, DeviceName, DeviceTimeZoneId, Latitude, Longitude, GpsDateTime, Speed. Use UTC timezone. Include stationary points. Do not summarize or aggregate.",
          },
          summary: "incremental CSV returned",
          result: "18,742 rows in signed CSV · SQL inspected · boundary second may overlap previous batch",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "BEGIN TRANSACTION; CREATE TEMP TABLE incoming_gps AS SELECT * FROM read_csv_auto('<signed-url>', all_varchar=true); INSERT INTO bronze.gps_raw SELECT *, now() AS _loaded_at, '<ace-chat-id>' AS _ace_chat_id, '<signed-url>' AS _source_url FROM incoming_gps; INSERT INTO silver.planet_gps_pings SELECT DISTINCT DeviceId, DeviceName, DeviceTimeZoneId, try_cast(Latitude AS DOUBLE), try_cast(Longitude AS DOUBLE), try_cast(GpsDateTime AS TIMESTAMP), try_cast(Speed AS DOUBLE) FROM incoming_gps WHERE try_cast(GpsDateTime AS TIMESTAMP) > TIMESTAMP '2026-06-29 23:58:12.614' AND NOT EXISTS (SELECT 1 FROM silver.planet_gps_pings s WHERE s.DeviceId = incoming_gps.DeviceId AND s.gps_datetime_utc = try_cast(incoming_gps.GpsDateTime AS TIMESTAMP)); COMMIT;" },
          summary: "incremental batch committed",
          result: "bronze +18,742 · silver +18,731 · 11 overlap/duplicate rows skipped",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Incremental refresh",
          subtitle: "Bronze keeps the complete append log; silver advances only with normalized, deduped records; gold refreshes from silver.",
          metrics: [
            { label: "Watermark", value: "23:58:12" },
            { label: "Bronze append", value: "+18,742" },
            { label: "Silver insert", value: "+18,731" },
            { label: "Duplicates", value: "11 skipped" },
          ],
          stages: D.warehouse.stages.incremental,
          note: "In a real build this becomes a scheduled job: watermark → Ace prompt → bronze append → silver derive → quality checks → gold refresh.",
        },
        {
          type: "assistant",
          text:
            "This is the durable refresh loop, not the finish line: watermark → extract → bronze append → silver derive → quality checks → gold refresh.\n\n" +
            "From here you can keep building — want me to add the rest of the operational warehouse (trips, faults, status, exceptions and the dimensions that decode them)?",
        },
      ],
      choices: [
        { label: "🧩 Add trips, faults, status and dimensions", say: "This is useful, but GPS points alone are not a warehouse. Add trips, faults, status data, exceptions and the dimensions that make them readable.", next: "warehouse-operational" },
        { label: "⏱ How fresh is this, really?", say: "How fresh is this warehouse, really? Geotab's own adapter polls every few seconds — why aren't we using its feed?", next: "warehouse-freshness" },
        { label: "🩺 What if it falls behind?", say: "What happens if the warehouse falls behind — a paused schedule, a vacation, an outage? How would I even notice?", next: "warehouse-backfill" },
        { label: "🧱 Replay from setup", say: "Replay the MotherDuck setup from the beginning.", next: "warehouse-intro" },
        { label: "⚡ Try fleet questions", say: "Take me back to the fleet simulator.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },

    "warehouse-operational": {
      id: "warehouse-operational",
      title: "Warehouse · operational mirror",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Exactly — GPS proves the pipe, but an operational warehouse needs the other Geotab surfaces too. The skill's rule of thumb is simple: **timestamped facts via Ace into bronze**, and **lookup lists via Get into dimensions**.\n\n" +
            "So we add trips, driver assignments, status/engine data, safety exception events, and faults as facts. Then we add users/drivers, rules, diagnostics, groups and zones as dimensions so the fact rows become human-readable. Driver is a Geotab gotcha: there is no `Driver` typeName — drivers are `User` rows where `isDriver=true`.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "ListEntities",
          args: { database: "demo_fh4" },
          summary: "52 entity types available",
          result: "LogRecord, Trip, StatusData, ExceptionEvent, FaultData, Device, User, Zone, Group, Diagnostic, Rule, FuelTransaction, FillUp, ...",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh4",
            new_chat: true,
            prompt: "For each fact table — Trip, StatusData, ExceptionEvent, FaultData — return rows after its current watermark with exact columns needed for a warehouse load. Use UTC. Do not summarize or aggregate.",
          },
          summary: "4 bulk fact extracts queued",
          result: "trips CSV · status_data CSV · exception_events CSV · fault_data CSV · each includes returned SQL + signed URL",
        },
        {
          type: "tool",
          server: "geotab",
          name: "ExecuteMultiCall",
          args: {
            database: "demo_fh4",
            calls: [
              { method: "Get", params: { typeName: "User", search: { isDriver: true }, propertySelector: { fields: ["id", "name", "firstName", "lastName", "activeFrom", "activeTo", "isDriver"] }, resultsLimit: 1000 } },
              { method: "Get", params: { typeName: "Rule", propertySelector: { fields: ["id", "name", "activeFrom", "activeTo"] }, resultsLimit: 1000 } },
              { method: "Get", params: { typeName: "Diagnostic", propertySelector: { fields: ["id", "name", "source", "unitOfMeasure"] }, resultsLimit: 1000 } },
              { method: "Get", params: { typeName: "Zone", propertySelector: { fields: ["id", "name", "groups"] }, resultsLimit: 1000 } },
              { method: "Get", params: { typeName: "Group", propertySelector: { fields: ["id", "name", "parent"] }, resultsLimit: 1000 } },
            ],
          },
          summary: "dimension snapshots returned",
          result: "dim_user includes driver Users · dim_rule · dim_diagnostic · dim_zone · dim_group refreshed via exact Get API",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE OR REPLACE TABLE silver.dim_user AS SELECT * FROM (VALUES ('u_demo_17','Driver 17',true), ('u_demo_31','Driver 31',true)) AS t(id, display_name, is_driver); CREATE OR REPLACE TABLE silver.driver_assignments AS SELECT * FROM (VALUES ('Demo - 08','u_demo_17',TIMESTAMP '2026-06-30 07:06:00'), ('Demo - 14','UnknownDriverId',TIMESTAMP '2026-06-30 08:00:00')) AS t(device_name, driver_id, active_from_utc); CREATE OR REPLACE TABLE gold.driver_safety_score AS SELECT coalesce(u.display_name, a.driver_id) AS driver, count(*) AS assigned_events FROM silver.driver_assignments a LEFT JOIN silver.dim_user u ON u.id = a.driver_id GROUP BY 1;" },
          summary: "operational mirror loaded",
          result: "6 fact families + 6 dimensions now queryable; trips can join through driver assignments to dim_user, while UnknownDriverId remains explicit",
        },
        {
          type: "assistant",
          text: "Loaded — the warehouse now has **6 fact families and 6 dimensions**. The panel at the top shows them all; facts can now join to readable names through the dimensions.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Operational mirror",
          subtitle: "The warehouse now has trips, safety exceptions, status/engine telemetry, faults and the dimensions that decode them.",
          metrics: [
            { label: "Fact families", value: "6" },
            { label: "Driver dim", value: "User.isDriver" },
            { label: "Largest table", value: "status_data" },
            { label: "Gold marts", value: "4" },
          ],
          stages: D.warehouse.stages.operational,
          note: "Loaded — but these trips went in append-only like GPS, and that's not safe yet: watch what tomorrow's re-split does to these rows.",
        },
      ],
      choices: [
        { label: "⚠️ Why trips & drivers can't just append", say: "Wait — trips and driver assignments aren't append-only like GPS. Show me what breaks and how to reconcile it.", next: "warehouse-restated" },
        { label: "📍 Faults have no location?", say: "Hold on — fault and status rows don't include GPS coordinates? How would I put faults on a map?", next: "warehouse-enrichment" },
        { label: "🗑 What about deletions?", say: "What happens when someone deletes a zone or deactivates a driver in Geotab? Does my warehouse notice?", next: "warehouse-deletions" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the fleet simulator.", next: "hub" },
      ],
    },

    "warehouse-restated": {
      id: "warehouse-restated",
      title: "Warehouse · trips aren't append-only",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Careful — we just loaded trips and driver assignments the *same* append-only way as GPS, and that's a bug waiting to happen. GPS pings, status, exceptions and faults are **immutable events**: once `(device, timestamp)` is written it never changes, so append + dedup is correct.\n\n" +
            "**A `Trip` is different — it's derived, not recorded.** Geotab recomputes a trip's boundaries when new evidence arrives (a `DriverChange` assignment, or late/out-of-order GPS). A recompute can change the trip's stop time and give it a **brand-new `TripId`, retiring the old one**. So a trip you already loaded can vanish under its old id and reappear under a new id — an *update* that append + dedup never sees.\n\n" +
            "👉 Keep the **Warehouse** panel (top of the chat) open for this one — you'll watch a retired trip row get replaced.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "Get",
          args: { database: "demo_fh4", typeName: "Trip", search: { id: "b10FEE52" }, propertySelector: { fields: ["id", "device", "start", "stop", "distance", "driver"] } },
          summary: "the trip we loaded this morning is gone",
          result: "[] — id b10FEE52 no longer exists. The 23:18 drive was b10FEE52 (23:18→23:28) at bootstrap; the source now has b11011A1 (23:18→23:42) for the same drive.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "WITH src AS (SELECT TripId FROM read_csv_auto('<fresh-trips-csv-url>', all_varchar=true)), sil AS (SELECT TripId FROM silver.trips WHERE trip_start_utc::DATE = DATE '2026-06-29') SELECT (SELECT count(*) FROM sil WHERE TripId NOT IN (SELECT TripId FROM src)) AS orphaned_in_silver, (SELECT count(*) FROM src WHERE TripId NOT IN (SELECT TripId FROM sil)) AS missing_from_silver;" },
          summary: "silver vs a fresh source pull for 06-29",
          result: "orphaned_in_silver: 50 (retired ids still in silver) · missing_from_silver: 51 (current splits) — all clustered in the ~2h before the watermark",
        },
        {
          type: "assistant",
          text:
            "Why a normal forward catch-up can't fix this: the re-split trip's **start is unchanged (23:18) and sits *before* the watermark**, so `WHERE start > watermark` never pulls the new id. Deduping on `TripId` can't help (the id changed), and deduping on `(DeviceId, start)` would keep the *stale* row.\n\n" +
            "The fix is a **trip re-split reconcile** — run right after each forward trips load. Re-pull from `watermark − L`, where `L` ≥ your longest expected trip (a few hours for urban fleets, ≥24–36h for long-haul). The same lookback also catches long trips that *completed* after a shorter trip advanced the watermark.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh4",
            new_chat: true,
            prompt: "List every Trip that started after 2026-06-29 21:28:52 UTC (watermark minus a 2h lookback), across all devices. Return exact columns: TripId, DeviceId, DeviceName, Start, Stop, Distance, DrivingDuration, Driver. Use UTC. Do not summarize or aggregate.",
          },
          summary: "re-pull the settling window into bronze",
          result: "1,647 rows in signed CSV · landed append-only in bronze.trips_raw with _batch_id='reconcile:2026-06-29 21:28:52'",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "DELETE FROM silver.trips WHERE trip_start_utc >= TIMESTAMP '2026-06-29 21:28:52' AND TripId NOT IN (SELECT TripId FROM bronze.trips_raw WHERE _batch_id = 'reconcile:2026-06-29 21:28:52'); INSERT INTO silver.trips SELECT DISTINCT ON (TripId) DeviceId, DeviceName, TripId, try_cast(replace(Start,' UTC','') AS TIMESTAMP) AS trip_start_utc, try_cast(replace(Stop,' UTC','') AS TIMESTAMP) AS trip_end_utc, coalesce(Driver,'UnknownDriverId') AS driver_id FROM bronze.trips_raw b WHERE b._batch_id = 'reconcile:2026-06-29 21:28:52' AND NOT EXISTS (SELECT 1 FROM silver.trips s WHERE s.TripId = b.TripId);" },
          summary: "DELETE retired orphans + anti-join the current splits",
          result: "DELETE 50 retired orphans · INSERT 51 current splits · day now 2,138 == 2,138, 0 orphans, 0 missing. This is the one place the warehouse DELETEs silver facts — justified because the source retired those ids.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Trips reconciled",
          subtitle: "Bronze keeps every version of the drive; silver holds one current row per drive, keyed on (DeviceId, trip_start_utc).",
          metrics: [
            { label: "Mutable fact", value: "Trip" },
            { label: "Retired ids", value: "50 deleted" },
            { label: "Re-split", value: "51 inserted" },
            { label: "Reconciled", value: "2,138 = 2,138" },
          ],
          stages: D.warehouse.stages.restated,
          note: "👉 Open the Warehouse panel to compare bronze.trips_raw (two versions of the 23:18 drive) with silver.trips (only the current b11011A1).",
        },
        {
          type: "assistant",
          text:
            "One last trap: bronze keeps every version, so it's tempting to just replay bronze → silver — but that would **resurrect the retired ids** (bronze still holds the old `b10FEE52` next to the new `b11011A1`). The skill handles this for you: instead of keying on the trip id, its rebuild keeps **one row per drive, taking the most recently loaded version** — so a retired trip collapses into its replacement instead of doubling up.\n\n" +
            "And driver assignments: the `DriverChange` events themselves *are* append-only, but `Trip.driver` is derived from them — it resolves to a real driver or the sentinel `UnknownDriverId`, so every trips→drivers join must tolerate that sentinel.\n\n" +
            "**The mental model — three shapes, three strategies:**\n\n" +
            "- **Immutable events** (GPS, status, exceptions, faults) → append + dedup on the natural key.\n" +
            "- **The mutable Trip** → forward derive, then reconcile (DELETE retired + anti-join), or a drive-key rebuild.\n" +
            "- **Dimensions** (Device, User/drivers, Zone, Rule, Diagnostic) → `Get`, no bronze, `CREATE OR REPLACE`.",
        },
      ],
      choices: [
        { label: "✅ Add quality checks and gap detection", say: "Now add quality checks, freshness checks and gap detection so I can trust this warehouse.", next: "warehouse-quality" },
        { label: "🧩 Back to operational mirror", say: "Go back to the operational mirror view.", next: "warehouse-operational" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the fleet simulator.", next: "hub" },
      ],
    },

    "warehouse-quality": {
      id: "warehouse-quality",
      title: "Warehouse · quality and gaps",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Before scheduling this, decide what counts as trustworthy. The checks are not looking for every vehicle and driver in every fact table; they are looking for gaps we cannot explain.\n\n" +
            "Examples: parked vehicles may have no GPS/trips today even though `dim_device` still lists the full fleet. Trips without an assigned driver should stay explicit as `UnknownDriverId`, not disappear from the report. We also keep two **semantic** warnings from reading the SQL Ace returned — Ace added a `Speed != 0` filter to a status prompt, and picked a different source table for two equivalent trip prompts — because that drift never shows up as a bad row, only as a wrong shape.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT 'gps: dupes on (DeviceId,GpsDateTime)' AS check, (count(*) - count(DISTINCT DeviceId || '|' || gps_datetime_utc::VARCHAR))::VARCHAR AS value FROM silver.planet_gps_pings UNION ALL SELECT 'gps: null natural key', count(*) FILTER (WHERE DeviceId IS NULL OR gps_datetime_utc IS NULL)::VARCHAR FROM silver.planet_gps_pings UNION ALL SELECT 'gps: future rows', count(*) FILTER (WHERE gps_datetime_utc > now())::VARCHAR FROM silver.planet_gps_pings UNION ALL SELECT 'gps: freshness minutes', round(date_diff('minute', max(gps_datetime_utc), now()), 0)::VARCHAR FROM silver.planet_gps_pings UNION ALL SELECT 'trips: device not in dim_device', count(DISTINCT t.DeviceId) FILTER (WHERE d.id IS NULL)::VARCHAR FROM silver.trips t LEFT JOIN silver.dim_device d ON d.id = t.DeviceId UNION ALL SELECT 'trips: re-split orphans (reconciled window)', count(*)::VARCHAR FROM silver.trips s WHERE s.trip_start_utc >= TIMESTAMP '2026-06-29 21:28:52' AND s.TripId NOT IN (SELECT TripId FROM bronze.trips_raw WHERE _batch_id = 'reconcile:2026-06-29 21:28:52');" },
          summary: "quality battery — one row per check, non-zero = investigate",
          result: "gps dupes 0 · null key 0 · future rows 0 · freshness 2 min · trips device-not-in-dim 0 · re-split orphans 0 (reconciled)",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE OR REPLACE TABLE silver.fact_freshness AS SELECT 'planet_gps_pings' AS table_name, max(gps_datetime_utc) AS max_event_time, date_diff('minute', max(gps_datetime_utc), now()) AS lag_minutes FROM silver.planet_gps_pings UNION ALL SELECT 'trips', max(trip_end_utc), date_diff('minute', max(trip_end_utc), now()) FROM silver.trips UNION ALL SELECT 'status_data', max(status_datetime_utc), date_diff('minute', max(status_datetime_utc), now()) FROM silver.status_data UNION ALL SELECT 'exception_events', max(active_from_utc), date_diff('minute', max(active_from_utc), now()) FROM silver.exception_events UNION ALL SELECT 'fault_data', max(fault_datetime_utc), date_diff('minute', max(fault_datetime_utc), now()) FROM silver.fault_data; CREATE OR REPLACE TABLE silver.coverage_by_device AS SELECT d.id AS device_id, d.name AS device_name, (g.DeviceId IS NOT NULL) AS gps_seen_today FROM silver.dim_device d LEFT JOIN (SELECT DISTINCT DeviceId FROM silver.planet_gps_pings WHERE gps_datetime_utc::DATE = current_date) g ON g.DeviceId = d.id; CREATE OR REPLACE TABLE silver.driver_assignment_coverage AS SELECT count(*) FILTER (WHERE driver_id <> 'UnknownDriverId') AS assigned_trips, count(*) FILTER (WHERE driver_id = 'UnknownDriverId') AS unassigned_trips, round(count(*) FILTER (WHERE driver_id <> 'UnknownDriverId') * 100.0 / count(*), 0) AS pct_assigned FROM silver.trips; CREATE TABLE IF NOT EXISTS silver.ingest_anomalies (detected_at TIMESTAMP, source_table VARCHAR, check_name VARCHAR, severity VARCHAR, detail VARCHAR); INSERT INTO silver.ingest_anomalies VALUES (now(), 'status_data', 'ace_added_unrequested_filter', 'warn', 'Ace injected Speed != 0 into a raw status prompt'), (now(), 'trips', 'ace_source_table_changed', 'warn', 'Two equivalent trip prompts resolved to different FROM tables');" },
          summary: "trust tables built + the 2 semantic warnings persisted",
          result: "silver.fact_freshness 5 rows · silver.coverage_by_device 50 devices · silver.driver_assignment_coverage 88% assigned · silver.ingest_anomalies 2 warnings logged",
        },
        {
          type: "assistant",
          text: "Checks are in: everything passes except **driver coverage at 88%** (the rest are `UnknownDriverId`, kept explicit), plus the **2 semantic warnings** logged for review. All trust tables now live beside the data.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Quality checks",
          subtitle: "Trust checks sit beside the data, so every refresh can explain what changed and what needs review.",
          metrics: [
            { label: "Freshness rows", value: "5" },
            { label: "Driver coverage", value: "88%" },
            { label: "Warnings", value: "2" },
            { label: "Trust checks", value: "4" },
          ],
          stages: D.warehouse.stages.quality,
          note: "This also teaches why the returned Ace SQL is a feature: it lets you catch semantic drift before the data becomes business truth.",
        },
      ],
      choices: [
        { label: "💵 Estimate run cost", say: "Estimate what this warehouse costs to run and how we'd track it.", next: "warehouse-costs" },
        { label: "📊 Show what we can answer now", say: "Show what new fleet questions this warehouse can answer now.", next: "warehouse-answers" },
        { label: "🩺 Add a warehouse health view", say: "One thing is missing: how do I notice when a table quietly falls behind?", next: "warehouse-backfill" },
        { label: "🧩 How trips re-split", say: "Remind me why trips and driver assignments aren't append-only.", next: "warehouse-restated" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the fleet simulator.", next: "hub" },
      ],
    },

    "warehouse-costs": {
      id: "warehouse-costs",
      title: "Warehouse · cost estimate",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Before choosing a refresh schedule, check whether this fits the MotherDuck free tier and what would make it cost money.\n\n" +
            "The cost reference is here: [COST_AND_SIZING.md](https://github.com/fhoffa/geotab-vibe-guide/blob/main/skills/geotab-motherduck-warehouse/references/COST_AND_SIZING.md). It measured a demo warehouse at **35.2 MiB** for 679,577 GPS pings plus trips/exceptions/dimensions. Bronze+silver GPS is about **54 bytes per ping**, so storage is usually not the limiting factor.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT 'measured_database_size' AS metric, '35.2 MiB' AS value UNION ALL SELECT 'lite_storage_included', '10 GB' UNION ALL SELECT 'lite_compute_included', '10 CU-hours/month' UNION ALL SELECT 'one_4_table_refresh', '~25-30 CU-seconds';" },
          summary: "measured pricing model applied",
          result: "small 50-vehicle fleet: $0 on Lite for years · 10 GB holds ~300 vehicle-years with bronze+silver · 10 CU-hours covers ~1,200 full refresh cycles/month (~every 35 min)",
        },
        {
          type: "assistant",
          text:
            "Cost estimate from the skill:\n\n" +
            "- **50 vehicles:** $0/mo on Lite in this model — 10 GB free storage and 10 CU-hours/month cover years of bronze+silver history and frequent refreshes.\n" +
            "- **500 vehicles:** can still be $0 on Lite if you keep silver-only; Business is about **$260/mo** if you choose the $250 platform plan.\n" +
            "- **5,000 vehicles:** roughly **$270–300/mo** on Business.\n" +
            "- **50,000 vehicles:** roughly **$370–520/mo** for one year of bronze+silver history.\n\n" +
            "Bottom line: for a typical fleet this stays free — you only start paying once you keep a lot of history or refresh very often. Pick a retention window and refresh cadence that fit the plan you want.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Pricing + free tier",
          subtitle: "Uses the skill's measured MotherDuck size/CU data and the Lite free-tier limits.",
          metrics: [
            { label: "Measured DB", value: "35.2 MiB" },
            { label: "Lite storage", value: "10 GB free" },
            { label: "Lite compute", value: "10 CU-h/mo" },
            { label: "50 vehicles", value: "$0/mo" },
          ],
          stages: D.warehouse.stages.quality,
          note: "The panel still shows the whole warehouse you've built — the cost figures above are measured against exactly these bronze/silver/gold tables. Trust includes cost controls: row counts, bytes scanned, run seconds and alerts when usage jumps.",
        },
      ],
      choices: [
        { label: "📉 Can I downsample to stay free?", say: "The big table is status_data. Can I sample or downsample it to stay on the free tier?", next: "warehouse-downsample" },
        { label: "📊 Show what we can answer now", say: "Show what new fleet questions this warehouse can answer now.", next: "warehouse-answers" },
        { label: "✅ Review quality checks", say: "Show the warehouse quality checks again.", next: "warehouse-quality" },
        { label: "↩︎ Back to main simulator", say: "Take me back to the fleet simulator.", next: "hub" },
      ],
    },

    "warehouse-answers": {
      id: "warehouse-answers",
      title: "Warehouse · answer-ready marts",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Once trips, exceptions, faults, status data and dimensions are in the same warehouse, the questions get bigger than any single MCP call. Now the assistant can join across history:\n\n" +
            "- **Utilization:** Which vehicles are under-used after accounting for trips, GPS and groups?\n" +
            "- **Safety:** Which drivers are risky because of exceptions per mile, not just raw event counts?\n" +
            "- **Maintenance:** Which fault clusters correlate with downtime, engine hours and vehicle type?\n" +
            "- **Cost:** Where do idling, routing and speeding compound into fuel waste?\n\n" +
            "That's the real story: the Geotab MCP connector is great for live questions, and MotherDuck turns those MCP extracts into durable, queryable institutional memory.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT * FROM gold.fleet_ops_overview; SELECT * FROM gold.driver_coaching_queue ORDER BY risk_score DESC LIMIT 5; SELECT * FROM gold.shop_worklist ORDER BY priority LIMIT 5;" },
          summary: "3 answer-ready marts queried",
          result: "fleet_ops_overview: 50 vehicles · driver_coaching_queue: 14 drivers · shop_worklist: 9 vehicles · idling_cost_daily refreshed",
        },
        {
          type: "assistant",
          text: "There it is — a **coaching queue of 14 drivers** and a **shop worklist of 9 vehicles**, both built from history no single live call could assemble. From here you'd turn these into **internal dashboards** for your team — MotherDuck has notebooks and dashboards built in, so you can chart and share them right where the data lives. Worth exploring their features at [motherduck.com](https://motherduck.com).",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Answer-ready marts",
          subtitle: "Gold marts turn the operational mirror into repeatable briefs, dashboards and agent skills.",
          metrics: [
            { label: "Ops overview", value: "1 row" },
            { label: "Coaching queue", value: "14 drivers" },
            { label: "Shop worklist", value: "9 vehicles" },
            { label: "Refresh path", value: "scheduled" },
          ],
          stages: D.warehouse.stages.answers,
          note: "The final teaching moment: MCP is the access layer; MotherDuck is the memory layer; gold marts are the product surface.",
        },
      ],
      choices: [
        { label: "📍 Put faults on the map", say: "Can I put faults on a map? I don't remember fault rows having coordinates.", next: "warehouse-enrichment" },
        { label: "✅ Review quality checks again", say: "Show the warehouse quality checks again.", next: "warehouse-quality" },
        { label: "🧱 Replay from setup", say: "Replay the MotherDuck warehouse story from setup.", next: "warehouse-intro" },
        { label: "⚡ Try fleet questions", say: "Take me back to the fleet simulator.", next: "hub" },
      ],
    },

    "warehouse-freshness": {
      id: "warehouse-freshness",
      title: "Warehouse · why watermarks, not GetFeed",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Fair question — and it's the honest architectural difference between this path and Geotab's own adapter.\n\n" +
            "The MyGeotab API Adapter syncs with **`GetFeed`**: an official API that returns a **version cursor** per entity type, so the service can poll every few seconds (configurable down to 2s) and never miss or re-fetch a row, even across restarts. **The MCP connector doesn't expose `GetFeed`** — the skill audited all 20 MCP tools, and none accepts a feed token.\n\n" +
            "So this warehouse uses the MCP-compatible substitute: **watermark + natural-key dedup**. Ask for rows newer than the latest timestamp already stored, and let the dedup absorb the boundary overlap (remember: Ace only honors boundaries to the second). It's the same idea as a feed cursor, rebuilt from what MCP does offer.\n\n" +
            "What that trade buys and costs:\n" +
            "- **Cadence:** this warehouse refreshes when an agent runs — on demand or on a schedule, typically minutes to daily. The adapter is a 24/7 service refreshing in seconds.\n" +
            "- **Correctness:** equivalent for immutable events (dedup handles the overlap); trips need their reconcile pass on either path.\n" +
            "- **The line to respect:** analytics, dashboards, scheduled briefs — this path is enough. Live dispatch or alerting on seconds-old data — that's a job for the live connector itself, or the adapter.\n\n" +
            "The skill keeps a full side-by-side of the two: **[MCP → MotherDuck vs GetFeed → API Adapter](https://github.com/fhoffa/geotab-vibe-guide/blob/main/guides/MCP_TO_MOTHERDUCK_VS_GETFEED_API_ADAPTER.md)** — including the graduation path: prototype here with zero infrastructure, move to the adapter if sub-minute freshness ever becomes the requirement. The concepts transfer directly; both mirror the same entities.",
        },
      ],
      choices: [
        { label: "🩺 What if it falls behind?", say: "So if refreshes only run when an agent runs — what happens when the warehouse falls behind? How would I even notice?", next: "warehouse-backfill" },
        { label: "🦆 Start the build (GPS rows)", say: "Good enough for analytics. Build the warehouse, starting with GPS points.", next: "warehouse-setup" },
        { label: "↩︎ Back to the refresh loop", say: "Go back to the incremental refresh step.", next: "warehouse-incremental" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-backfill": {
      id: "warehouse-backfill",
      title: "Warehouse · falling behind, and noticing",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Two separate problems hide in that question: **noticing you're behind** and **catching up safely**. Most people only think about the second one.\n\n" +
            "Noticing is a job for the warehouse itself. The adapter tracks per-service cursors in a health table; ours is one view — per fact table, the newest event time, the lag against now, and the last load:",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE OR REPLACE VIEW main.warehouse_health AS SELECT 'planet_gps_pings' AS table_name, max(gps_datetime_utc) AS max_event_time, date_diff('minute', max(gps_datetime_utc), now()) AS lag_minutes, count(*) AS row_count FROM silver.planet_gps_pings UNION ALL SELECT 'trips', max(trip_end_utc), date_diff('minute', max(trip_end_utc), now()), count(*) FROM silver.trips UNION ALL SELECT 'status_data', max(status_datetime_utc), date_diff('minute', max(status_datetime_utc), now()), count(*) FROM silver.status_data UNION ALL SELECT 'exception_events', max(active_from_utc), date_diff('minute', max(active_from_utc), now()), count(*) FROM silver.exception_events UNION ALL SELECT 'fault_data', max(fault_datetime_utc), date_diff('minute', max(fault_datetime_utc), now()), count(*) FROM silver.fault_data; SELECT * FROM main.warehouse_health ORDER BY lag_minutes DESC;" },
          summary: "one view answers 'is anything behind?'",
          result: "status_data lag 194 min ⚠️ · fault_data 55 min · trips 41 min · exception_events 38 min · planet_gps_pings 2 min — one table is quietly 3+ hours behind",
        },
        {
          type: "assistant",
          text:
            "There it is — **`status_data` is 3.2 hours behind** and nothing errored. Yesterday's status pull returned *exactly* the page limit, and the loop treated a full page as 'done'. That's the trap the adapter's pacing heuristic exists for:\n\n" +
            "**If a window's pull returns rows right up to the upper bound — or fills the page limit — you are still behind: pull again immediately. Only a partial window means you're current.** No guessing, no fixed sleeps.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: {
            database: "demo_fh4",
            new_chat: true,
            prompt: "List every StatusData record after 2026-06-30 04:12:00 UTC in windows, exact warehouse columns, UTC. Keep pulling while a window comes back full; stop on the first partial window.",
          },
          summary: "catch-up paced by the stop rule",
          result: "window 1: full page (still behind) · window 2: full page (still behind) · window 3: partial (current) — 3 CSVs landed in bronze, silver deduped, status_data lag now 2 min",
        },
        {
          type: "assistant",
          text:
            "Caught up in three windows, and the third window's partial result is the *proof* we're current — the loop earns its own stop condition.\n\n" +
            "One more operational rule from the adapter, which enforces it with a machine-name guard; we adopt it as discipline: **one writer per warehouse**. Two agent sessions refreshing the same tables will interleave loads and corrupt each other's watermarks. One session owns the refresh; everything else reads.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Health + catch-up",
          subtitle: "The health view makes 'is anything behind?' a one-query question; the stop rule makes catch-up self-pacing.",
          metrics: [
            { label: "Health view", value: "warehouse_health" },
            { label: "Caught behind", value: "status_data 3.2h" },
            { label: "Stop rule", value: "partial = current" },
            { label: "Writers", value: "exactly 1" },
          ],
          stages: D.warehouse.stages.quality,
          note: "Run the health view at the start of every refresh — it's the difference between finding a gap now and finding it in next month's report.",
        },
      ],
      choices: [
        { label: "✅ Continue to quality checks", say: "Good. Now add the quality checks and gap detection.", next: "warehouse-quality" },
        { label: "⏱ Why watermarks, not GetFeed?", say: "Back up — why is this warehouse on watermarks instead of Geotab's official feed API?", next: "warehouse-freshness" },
        { label: "↩︎ Back to the refresh loop", say: "Go back to the incremental refresh step.", next: "warehouse-incremental" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-enrichment": {
      id: "warehouse-enrichment",
      title: "Warehouse · faults get coordinates",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Sharp catch — **`FaultData` and `StatusData` carry no coordinates**. In Geotab's model, location lives in `LogRecord`; a fault only knows its device and timestamp. The API Adapter dedicates **two entire background services** to interpolating lat/lon/speed/bearing from surrounding LogRecords into fault and status rows.\n\n" +
            "In a columnar warehouse that's one query. DuckDB's **`ASOF JOIN`** takes, for each fault, the nearest GPS ping at-or-before the fault's timestamp, per device:",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE OR REPLACE TABLE gold.fault_locations AS SELECT f.*, g.latitude AS lat, g.longitude AS lon, g.speed AS speed_at_fault, date_diff('second', g.gps_datetime_utc, f.fault_datetime_utc) AS gps_gap_s FROM silver.fault_data f ASOF JOIN silver.planet_gps_pings g ON f.DeviceId = g.DeviceId AND g.gps_datetime_utc <= f.fault_datetime_utc;" },
          summary: "every fault located in one query",
          result: "gold.fault_locations: 4,912 faults · 100% matched · median gap to nearest ping 2 s · p95 23 s",
        },
        {
          type: "assistant",
          text:
            "All **4,912 faults picked up coordinates**, and the gap distribution says the match is honest: median 2 seconds from the nearest ping, p95 23 seconds. (The skill validated this exact pattern live at **822,203 events, 100% matched** — it holds at scale.)\n\n" +
            "One trap, and it's the same late-data lesson trips taught: **GPS arrives late too**. A fault logged 30 seconds ago may not have its bracketing pings in silver yet, so the join would grab a ping minutes stale. Either **only enrich events older than a small buffer**, or simply **rebuild this mart on every refresh** — at this size the rebuild is cheap, so that's what we schedule.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Faults located",
          subtitle: "An ASOF JOIN gives every fault the nearest prior GPS ping — location, speed and an honesty metric (the gap) in one pass.",
          metrics: [
            { label: "Faults located", value: "4,912 · 100%" },
            { label: "Median gap", value: "2 s" },
            { label: "p95 gap", value: "23 s" },
            { label: "Method", value: "ASOF JOIN" },
          ],
          stages: D.warehouse.stages.enriched,
          note: "The adapter needs two dedicated interpolation services for this; the warehouse does it in one query. This is the clearest 'why a warehouse' moment in the whole build.",
        },
      ],
      choices: [
        { label: "📊 Show what we can answer now", say: "Show what new fleet questions this warehouse can answer now.", next: "warehouse-answers" },
        { label: "✅ Add quality checks", say: "Now add quality checks, freshness checks and gap detection so I can trust this warehouse.", next: "warehouse-quality" },
        { label: "↩︎ Back to operational mirror", say: "Go back to the operational mirror view.", next: "warehouse-operational" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-deletions": {
      id: "warehouse-deletions",
      title: "Warehouse · deletions & mutability",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Not by itself — and this is one of the quietest traps in incremental replication. **A deletion never shows up in an incremental pull.** A deleted zone doesn't arrive marked 'deleted'; it just stops appearing. Watermark loops only see *new* rows, so `dim_zone` would happily keep serving a zone that no longer exists.\n\n" +
            "The adapter's answer — which this warehouse already follows without having said why — is that **dimensions get a periodic full snapshot, never an incremental one**. That's why every dim here is `Get` → `CREATE OR REPLACE`: no bronze, no watermark. Each refresh replaces the roster wholesale, so a disappearance *is* the signal. It's also why **dimensions load before facts**: fact rows should never arrive ahead of the rows that decode them.\n\n" +
            "Two refinements:\n" +
            "- Geotab often **retires instead of deletes**: `activeFrom`/`activeTo` on Users and similar. Keep retired rows with their dates — history still joins to them.\n" +
            "- The subset shortcut inherits the rule: if you keep only the ~56 diagnostics your faults actually reference (out of 65K), that subset must also be **fully re-derived** each refresh, or a newly-referenced diagnostic never appears.",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query",
          args: { sql: "SELECT 'trips → dim_device' AS ref, count(DISTINCT t.DeviceId) FILTER (WHERE d.id IS NULL) AS orphans FROM silver.trips t LEFT JOIN silver.dim_device d ON d.id = t.DeviceId UNION ALL SELECT 'exceptions → dim_rule', count(DISTINCT e.RuleId) FILTER (WHERE r.id IS NULL) FROM silver.exception_events e LEFT JOIN silver.dim_rule r ON r.id = e.RuleId UNION ALL SELECT 'faults → dim_diagnostic', count(DISTINCT f.DiagnosticId) FILTER (WHERE g.id IS NULL) FROM silver.fault_data f LEFT JOIN silver.dim_diagnostic g ON g.id = f.DiagnosticId;" },
          summary: "orphan check: facts pointing at missing dimension rows",
          result: "0 orphans across all three joins — but only because every refresh re-snapshots the dims. Skip the dim refresh for a week and this number starts lying to you.",
        },
        {
          type: "assistant",
          text:
            "The general habit the adapter teaches: before loading any new entity, ask **\"does this row mutate after creation?\"**\n\n" +
            "- **Never** (GPS, status, exceptions, faults, `DriverChange`) → append + dedup on the natural key.\n" +
            "- **Yes — replaced** (`Trip`: re-split under a brand-new id) → the reconcile pass you've seen.\n" +
            "- **Yes — updated in place** (`DVIRLog`: a defect later gains its repair status) → re-pull a trailing window, latest version wins.\n" +
            "- **Dimensions** (Device, User, Zone, Rule, Diagnostic) → full snapshot; deletions handled by construction.\n\n" +
            "One row in that list is sneaky: `DriverChange` is itself append-only, but its *arrival* triggers trip re-splits — an immutable event that mutates a different table.",
        },
      ],
      choices: [
        { label: "🧩 How trips re-split", say: "Remind me how the trip re-split reconcile works.", next: "warehouse-restated" },
        { label: "✅ Continue to quality checks", say: "Now add quality checks, freshness checks and gap detection so I can trust this warehouse.", next: "warehouse-quality" },
        { label: "↩︎ Back to operational mirror", say: "Go back to the operational mirror view.", next: "warehouse-operational" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    "warehouse-downsample": {
      id: "warehouse-downsample",
      title: "Warehouse · downsample, never at ingest",
      mode: "warehouse",
      events: [
        {
          type: "assistant",
          text:
            "Yes — but *where* you downsample decides whether you can ever change your mind.\n\n" +
            "The API Adapter offers ingest-time sampling: a minimum interval of 1–3600 s per device for LogRecords and StatusData. Effective, and its own docs carry the warning that matters: **what you discard at ingest can never be backfilled.** Pick a 60 s floor today, need 10 s granularity next quarter — that history is gone.\n\n" +
            "The warehouse version of the same lever is safer: **keep bronze complete, downsample in the silver derive or the gold mart.** Storage is the cheap part (~54 bytes per ping, remember) — what you're really tuning is mart size and scan cost:",
        },
        {
          type: "tool",
          server: "motherduck",
          name: "query_rw",
          write: true,
          args: { sql: "CREATE OR REPLACE TABLE gold.status_track AS SELECT * FROM silver.status_data QUALIFY row_number() OVER (PARTITION BY DeviceId, DiagnosticId, time_bucket(INTERVAL 30 SECOND, status_datetime_utc) ORDER BY status_datetime_utc) = 1;" },
          summary: "30-second floor applied in the mart — bronze untouched",
          result: "silver.status_data 1.9M rows → gold.status_track 412K rows (−78%) · bronze.status_data_raw still complete at 1.9M",
        },
        {
          type: "assistant",
          text:
            "A 78% smaller mart for dashboards and daily questions, while **every original row is still one `CREATE TABLE` away** — change the floor to 10 s next quarter and rebuild.\n\n" +
            "One honest caveat before you lean on that reversibility: it only lasts as long as bronze does. If you later add a **bronze pruning window** (say, a 7–30 day rolling window) to cap storage, then for pruned history the downsample becomes exactly as permanent as the adapter's. So the order of decisions matters: **pick your granularity floor before pruning catches up** with the history you care about.\n\n" +
            "For this 50-vehicle fleet none of it is forced — the whole warehouse is 35.2 MiB against 10 GB free. This lever exists for the day the fleet is 10× and `status_data` is the reason the storage line moved.",
        },
        {
          type: "warehouse",
          title: "MotherDuck",
          compactSubtitle: "Downsampled mart",
          subtitle: "The mart gets smaller; bronze stays complete — so the decision stays reversible until you start pruning bronze.",
          metrics: [
            { label: "status_data", value: "1.9M rows" },
            { label: "Track mart", value: "412K (−78%)" },
            { label: "Bronze", value: "untouched" },
            { label: "Reversible", value: "until pruning" },
          ],
          stages: D.warehouse.stages.quality,
          note: "The adapter samples at ingest and can never backfill; the warehouse samples in the derive and can. Same lever, opposite regret profile.",
        },
      ],
      choices: [
        { label: "📊 Show what we can answer now", say: "Show what new fleet questions this warehouse can answer now.", next: "warehouse-answers" },
        { label: "💵 Back to the cost estimate", say: "Show the cost estimate again.", next: "warehouse-costs" },
        { label: "⚡ Back to fleet simulator", say: "Take me back to the main simulator.", next: "hub" },
      ],
    },

    /* ----------------------------------------- roi · where is the money leaking */
    "ep-roi": {
      id: "ep-roi",
      title: "ROI · Where the fleet leaks money",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "system",
          text: "Pulling across safety, fuel, idling and maintenance to total the recoverable opportunity…",
        },
        {
          type: "assistant",
          text:
            "You asked where the money's going — let me total the *recoverable* opportunity across everything we've " +
            "looked at, and keep each number conservative. An ROI case that oversells gets torn apart in the room, so " +
            "I'm using the low end of every range.",
        },
        {
          type: "tool",
          server: "geotab",
          name: "GetAceResults",
          args: { database: "demo_fh_vegas4", prompt: "Estimate annual recoverable savings for this fleet by lever (fuel from speeding, collision/insurance, maintenance/downtime, idling), conservative figures, with the fix for each.", new_chat: true },
          summary: "≈ $75,500 / yr capturable (~$1,510 per vehicle) across 4 levers",
          result:
            '{ "currency": "USD", "annualFuelSpend": 498000, "vehicles": 50, "totalAnnual": 75500, "perVehicle": 1510,\n' +
            '  "levers": [\n' +
            '    { "lever": "Speeding → fuel",       "annual": 33000, "range": "30k–36k", "fix": "fleet posted-speed rule + alert + policy" },\n' +
            '    { "lever": "Collision & insurance", "annual": 28000, "range": "18k–40k", "fix": "coach 3 multi-factor drivers + scorecard program (risk-weighted)" },\n' +
            '    { "lever": "Maintenance & downtime","annual": 12000, "range": "9k–16k",  "fix": "maintenance reminders + fault severity triage" },\n' +
            '    { "lever": "Idling",                "annual": 2500,  "range": "2.2k–3.3k","fix": "idling rule (>10 min) + live nudge" } ] }',
        },
        {
          type: "assistant",
          text:
            "Here's the money, totalled for the Vegas fleet — about **$75,500 a year recoverable, roughly $1,510 per " +
            "vehicle**:\n\n" +
            "- **Speeding → fuel: ~$33,000.** 6–8% of a ~$498k/yr fuel bill, closing the gap between your 17.3 mpg and " +
            "rated economy. *Fix: the fleet posted-speed rule + alert.*\n" +
            "- **Collision & insurance: ~$28,000** (risk-weighted). Coaching the three multi-factor drivers, plus the " +
            "telematics premium credit insurers give for a scorecard program. *Fix: driver coaching + scorecard.*\n" +
            "- **Maintenance & downtime: ~$12,000.** Preventive-vs-reactive servicing and fewer unplanned out-of-service " +
            "days. *Fix: maintenance reminders + severity triage.*\n" +
            "- **Idling: ~$2,500.** A 20–30% cut on the $10.9k/yr you currently burn parked. *Fix: an idling rule.*\n\n" +
            "Two honest flags so this survives scrutiny: the **collision line is an expected value, not a banked " +
            "saving** — treat it as the prize, not the invoice — and I've **not double-counted** the overlap between " +
            "the fuel and idling lines (a calmer right foot helps both; the speeding line already absorbs the " +
            "driving-style fuel gain).\n\n" +
            "The pattern worth taking upstairs: the two biggest levers — fuel and collision — are the *same behaviour*, " +
            "speed and aggression. So this isn't four projects competing for budget; it's **one safety program** (speed " +
            "policy + coaching) that pays down ~80% of the total, and the maintenance and idling pieces follow. Want me " +
            "to put it on one page you can forward to your boss?",
        },
        {
          type: "chart",
          title: "Annual recoverable savings by lever · Vegas fleet (USD, conservative)",
          bars: bars(D.vegas && D.vegas.savings && D.vegas.savings.levers, "lever", "annualUSD"),
        },
      ],
      choices: [
        { label: "📄 Draft the one-pager for my boss", say: "Turn this into a one-page business case I can forward to my boss.", next: "ep-roi-onepager" },
        { label: "🛠️ Package this as a quarterly ROI skill", say: "Package this into a reusable skill that rebuilds the ROI case from live data every quarter.", next: "ep-roi-skill" },
        { label: "🔔 Start the biggest lever — speed alert", say: "Start with the biggest lever — set up the fleet-wide posted-speed alert.", next: "ep2-action" },
        { label: "🧑‍🏫 Coach the high-risk drivers", say: "Identify the drivers who need coaching and draft a summary I can send to their manager.", next: "ep-agentic-coaching" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-roi-onepager": {
      id: "ep-roi-onepager",
      title: "ROI · Draft the business case",
      db: "demo_fh_vegas4",
      events: [
        { type: "system", text: "This flow spans two connectors: Geotab + Gmail." },
        {
          type: "assistant",
          text:
            "Drafting a one-page business case from the numbers we just pulled — exec summary, the four levers with " +
            "conservative figures, the recommended first move, and the honest caveats so it holds up in the room. " +
            "Leaving it in Drafts, not sending it.",
        },
        {
          type: "tool",
          server: "gmail",
          name: "create_draft",
          args: { to: "ops-director@test-mailbox.example", subject: "Fleet telematics — FY business case (~$75k/yr recoverable)" },
          summary: "One-pager saved to Drafts (NOT sent)",
          write: true,
          openByDefault: true,
          result:
            "To: ops-director@test-mailbox.example\n" +
            "Subject: Fleet telematics — FY business case (~$75k/yr recoverable)\n\n" +
            "Summary\n" +
            "Telematics on the 50-vehicle Vegas fleet points to ~$75,500/yr in recoverable cost (~$1,510/vehicle), " +
            "concentrated in driver behaviour. Figures below are deliberately conservative (low end of range).\n\n" +
            "The opportunity (annual, capturable)\n" +
            "  • Speeding → fuel ............ $33,000   (6–8% of ~$498k fuel spend)\n" +
            "  • Collision & insurance ...... $28,000   (risk-weighted; coaching + premium credit)\n" +
            "  • Maintenance & downtime ..... $12,000   (preventive vs reactive)\n" +
            "  • Idling ..................... $2,500    (20–30% cut on $10.9k burned parked)\n" +
            "  • TOTAL ...................... ~$75,500\n\n" +
            "Recommendation\n" +
            "One initiative captures ~80% of this: a fleet-wide posted-speed policy + live alert + driver coaching for " +
            "the 3 highest-risk drivers. The fuel and collision levers are the same behaviour, so we fund one program, " +
            "not four. Maintenance reminders and an idling rule are quick add-ons.\n\n" +
            "Caveats (so we don't oversell)\n" +
            "  • The collision figure is an expected value, not a guaranteed saving.\n" +
            "  • Fuel and idling overlap is not double-counted.\n" +
            "  • Hardware/subscription is already sunk; this is operating-cost recovery on top.\n\n" +
            "Ask: approval to roll out the speed policy + coaching program this quarter.",
        },
        {
          type: "assistant",
          text:
            "Done — the one-pager's in Drafts (open the card to read it). It leads with the headline number, breaks out " +
            "the four levers, makes a single clear recommendation, and — importantly — states the caveats itself, so " +
            "your director sees you've already pressure-tested it. That's the version that gets a yes.\n\n" +
            "(Demo points at a test mailbox, never a real recipient.)",
        },
      ],
      choices: [
        { label: "📤 Send it to the director", say: "It looks right — send the business case now.", next: "ep-roi-send" },
        { label: "🔔 Kick off lever #1 in Geotab now", say: "Set up the fleet-wide posted-speed alert and route it to a manager.", next: "ep2-action" },
        { label: "↩︎ Ask something else", say: "Let me try something else.", next: "hub" },
      ],
    },

    "ep-roi-send": {
      id: "ep-roi-send",
      title: "ROI · Send the business case",
      db: "demo_fh_vegas4",
      events: [
        {
          type: "tool",
          server: "gmail",
          name: "send_message",
          args: { draftId: "r-…roi" },
          summary: "Sent to ops-director@test-mailbox.example",
          write: true,
          result: '{ "messageId": "r-…", "status": "sent" }',
        },
        {
          type: "assistant",
          text:
            "Sent. Your director now has a costed, caveated business case — built from live fleet data, not a vendor " +
            "slide — with one clear ask. Whenever you're ready to act on the approval, I can stand up the speed rule, " +
            "the coaching list and the maintenance reminders in a few minutes.",
        },
        { type: "endcard", lines: ["Geotab MCP Connector", "From telemetry to the boardroom, in one conversation."] },
      ],
      choices: [
        { label: "🔔 Start lever #1 — the speed alert", say: "Now set up the fleet-wide posted-speed alert and route it to a manager.", next: "ep2-action" },
        { label: "⚡ Try another", say: "Show me something else.", next: "hub" },
        { label: "↻ Restart", action: "restart" },
      ],
    },
  },
};
