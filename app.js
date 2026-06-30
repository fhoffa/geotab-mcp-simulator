/*
 * app.js — the conversation engine.
 *
 * Walks the graph in data/conversations.js: plays each node's events with
 * typing/tool delays, then offers the node's choices. No dependencies, no build.
 */
(function () {
  "use strict";

  var GRAPH = window.CONVERSATIONS;
  var NODES = GRAPH.nodes;

  var chatEl = document.getElementById("chat");
  var emptyStateEl = document.getElementById("emptyState");
  var trayEl = document.getElementById("tray");
  var motherduckPane = document.getElementById("motherduckPane");
  var motherduckPaneToggle = document.getElementById("motherduckPaneToggle");
  var motherduckPaneTitle = document.getElementById("motherduckPaneTitle");
  var motherduckPaneSubtitle = document.getElementById("motherduckPaneSubtitle");
  var motherduckPaneSummary = document.getElementById("motherduckPaneSummary");
  var motherduckPaneBody = document.getElementById("motherduckPaneBody");
  var connEl = document.getElementById("connStatus");
  var restartBtn = document.getElementById("restartBtn");
  var landingOverlay = document.getElementById("landingOverlay");
  var startSimBtn = document.getElementById("startSimBtn");
  var startWarehouseBtn = document.getElementById("startWarehouseBtn");
  var tryRealOverlay = document.getElementById("tryRealOverlay");
  var tryRealBtn = document.getElementById("tryRealBtn");
  var tryRealBtnLanding = document.getElementById("tryRealBtnLanding");
  var tryRealClose = document.getElementById("tryRealClose");
  var settingsBtn = document.getElementById("settingsBtn");
  var settingsOverlay = document.getElementById("settingsOverlay");
  var settingsClose = document.getElementById("settingsClose");
  var speedModeLabel = document.getElementById("speedModeLabel");
  var speedOptionBtns = Array.prototype.slice.call(document.querySelectorAll(".speed-option"));
  var aboutBtn = document.getElementById("aboutBtn");
  var aboutOverlay = document.getElementById("aboutOverlay");
  var aboutClose = document.getElementById("aboutClose");

  // timing profiles (ms). xfast preserves the current demo pace; realistic uses
  // measured connector timings from live demo_fh4 calls. API read timing comes
  // from adjusted connector round-trip estimates; Ace timing uses server-side
  // prompt-received → final-message timestamps captured from GetAceResults.
  // Tool events can still opt into exact recorded timing with measuredMs /
  // durationMs / latencyMs.
  var SPEED_KEY = "geotabMcpSimulatorSpeed";
  var SPEEDS = {
    xfast: {
      label: "xfast",
      base: { tool: 360, think: 380, system: 300, gap: 200 },
      toolWrite: 260,
      toolWeb: 340,
      thinkWord: 14,
      thinkMin: 450,
      thinkMax: 1700,
      stream: { chunk: 6, tick: 40 },
      user: { chunk: 2, tick: 24 },
    },
    realistic: {
      label: "realistic",
      base: { tool: 1200, think: 800, system: 300, gap: 400 },
      toolApiReadMedium: 2200,
      toolWrite: 2800,
      toolAceSimple: 33000,
      toolAceHeavy: 48000,
      toolWeb: 2500,
      thinkWord: 50,
      thinkMin: 500,
      thinkMax: 3000,
      stream: { chunk: 20, tick: 50 },
      user: { chunk: 15, tick: 40 },
    },
  };
  var speedMode = readSpeedMode();
  var skip = false;
  var playToken = 0; // invalidates an in-flight playback when we jump elsewhere
  var warehousePointerShown = false; // chat pointer to the pane: show once, then update silently
  var currentNodeId = null; // last id pushed to location.hash by playNode
  var REAL_ACCOUNT_HASH = "connect-real"; // shareable deep link straight to the "connect real account" overlay
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function jitter(ms) { return Math.round(ms * (0.85 + Math.random() * 0.3)); } // +/-15%, feels less robotic
  function wordCount(text) { return ((text || "").trim().match(/\S+/g) || []).length; }
  function hasSpeedMode(mode) {
    return Object.prototype.hasOwnProperty.call(SPEEDS, mode);
  }
  function timing() { return hasSpeedMode(speedMode) ? SPEEDS[speedMode] : SPEEDS.xfast; }
  function readSpeedMode() {
    try {
      var stored = window.localStorage && window.localStorage.getItem(SPEED_KEY);
      return hasSpeedMode(stored) ? stored : "xfast";
    } catch (_) {
      return "xfast";
    }
  }
  function writeSpeedMode(mode) {
    try { if (window.localStorage) window.localStorage.setItem(SPEED_KEY, mode); } catch (_) {}
  }
  function explicitMeasuredDelay(ev) {
    var ms = ev.measuredMs || ev.durationMs || ev.latencyMs;
    return typeof ms === "number" && isFinite(ms) && ms > 0 ? ms : null;
  }
  function isAceTool(ev) { return ev && ev.name === "GetAceResults"; }
  function isAceHeavy(ev) {
    if (ev.aceHeavy === true) return true;
    if (ev.aceHeavy === false) return false;
    var prompt = ((ev.args && ev.args.prompt) || "").toLowerCase();
    return prompt.length > 120 || /rank|score|breakdown|quarter|estimate|summarize|coaching|downtime|fuel|idle|savings|risk/.test(prompt);
  }
  function isMediumApiRead(ev) {
    if (!ev || ev.server !== "geotab" || ev.write || isAceTool(ev)) return false;
    if (ev.name === "GetCountOf" || ev.name === "GetHosRuleSets" || ev.name === "authenticate") return false;
    if (ev.name === "Get") {
      var typeName = ev.args && ev.args.typeName;
      return typeName !== "Device" && typeName !== "User" && typeName !== "Zone";
    }
    return ev.name === "DecodeVins" || ev.name === "GetPostedRoadSpeedsForDevice" ||
      ev.name === "SearchMedia" || ev.name === "ExecuteMultiCall";
  }
  function isExternalIntegration(ev) {
    return ev && (ev.server === "gmail" || ev.server === "google-calendar" || ev.server === "salesforce");
  }
  function updateSpeedUi() {
    if (speedModeLabel) speedModeLabel.textContent = timing().label;
    speedOptionBtns.forEach(function (btn) {
      var active = btn.getAttribute("data-speed") === speedMode;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-checked", active ? "true" : "false");
    });
  }
  function setSpeedMode(mode) {
    if (!hasSpeedMode(mode)) mode = "xfast";
    speedMode = mode;
    writeSpeedMode(mode);
    updateSpeedUi();
  }

  // "thinking" pause before the assistant starts streaming a reply — longer answers
  // get a longer beat, like the model taking more time to plan them.
  function thinkDelay(text) {
    var t = timing();
    return jitter(clamp(t.base.think + wordCount(text) * t.thinkWord, t.thinkMin, t.thinkMax));
  }
  // round-trip latency for a tool call. In realistic mode, use measured buckets:
  // small API reads ≈1.2s, medium reads ≈2.2s, writes ≈2.8s, Ace ≈33–48s.
  function toolDelay(ev) {
    var t = timing();
    var measured = speedMode === "realistic" ? explicitMeasuredDelay(ev) : null;
    if (measured != null) return jitter(clamp(measured, 450, 120000));
    if (speedMode === "realistic") {
      if (isAceTool(ev)) return jitter(isAceHeavy(ev) ? t.toolAceHeavy : t.toolAceSimple);
      if (ev.server === "web") return jitter(t.toolWeb);
      if (ev.write || isExternalIntegration(ev)) return jitter(t.toolWrite);
      if (isMediumApiRead(ev)) return jitter(t.toolApiReadMedium);
      return jitter(t.base.tool);
    }
    var d = t.base.tool;
    if (ev.write) d += t.toolWrite;
    if (ev.server === "web") d += t.toolWeb;
    if (ev.server === "motherduck") d += 220;
    return jitter(d);
  }
  function timedDelay(kind) { return jitter(timing().base[kind]); }

  /* ----------------------------------------------------------- integrity */
  function checkGraph() {
    var problems = [];
    Object.keys(NODES).forEach(function (id) {
      var n = NODES[id];
      (n.choices || []).forEach(function (c) {
        if (c.next && !NODES[c.next]) problems.push(id + " → missing node '" + c.next + "'");
      });
      if (n.next && !NODES[n.next]) problems.push(id + " → missing node '" + n.next + "'");
    });
    if (problems.length) console.error("[graph] broken links:\n" + problems.join("\n"));
    else console.info("[graph] ok — " + Object.keys(NODES).length + " nodes, all links resolve.");
  }

  /* --------------------------------------------------------- tiny markdown */
  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function safeHref(url) {
    // only allow http(s) links; escapeHtml() already neutralized quotes, but a
    // javascript:/data: URL would still execute without this scheme check.
    return /^https?:\/\//i.test(url) ? url : "#";
  }
  function inline(s) {
    return s
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, url) {
        return '<a href="' + safeHref(url) + '" target="_blank" rel="noopener">' + text + "</a>";
      });
  }
  function renderMarkdown(text) {
    var lines = escapeHtml(text).split("\n");
    var html = "";
    var i = 0;
    function flushList(tag, items) {
      html += "<" + tag + ">" + items.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</" + tag + ">";
    }
    while (i < lines.length) {
      var line = lines[i];
      if (/^\s*$/.test(line)) { i++; continue; }
      var h = line.match(/^(#{1,3})\s+(.*)$/);
      if (h) { var lvl = h[1].length; html += "<h" + lvl + ">" + inline(h[2]) + "</h" + lvl + ">"; i++; continue; }
      if (/^>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, "")); i++; }
        html += "<blockquote>" + inline(quote.join(" ")) + "</blockquote>";
        continue;
      }
      if (/^-\s+/.test(line)) {
        var ul = [];
        while (i < lines.length && /^-\s+/.test(lines[i])) { ul.push(lines[i].replace(/^-\s+/, "")); i++; }
        flushList("ul", ul);
        continue;
      }
      if (/^\d+\.\s+/.test(line)) {
        var ol = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { ol.push(lines[i].replace(/^\d+\.\s+/, "")); i++; }
        flushList("ol", ol);
        continue;
      }
      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,3}\s|>\s?|-\s+|\d+\.\s+)/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      html += "<p>" + para.map(inline).join("<br>") + "</p>";
    }
    return html;
  }

  /* --------------------------------------------------------------- helpers */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function scrollDown() {
    // smooth while playing normally so motion tracks content arriving; snap
    // instantly once the user fast-forwards (or asks for reduced motion)
    var behavior = skip || reduceMotion ? "auto" : "smooth";
    chatEl.scrollTo({ top: chatEl.scrollHeight, behavior: behavior });
    window.scrollTo({ top: document.body.scrollHeight, behavior: behavior });
  }
  function wait(ms) {
    // playNode() already re-checks playToken after every wait(), and the click
    // handler flips `skip` synchronously — so a single short poll loop is enough
    // to fast-forward mid-wait without a second timer.
    return new Promise(function (res) {
      var elapsed = 0;
      var step = 40;
      var iv = setInterval(function () {
        elapsed += step;
        if (skip || elapsed >= ms) { clearInterval(iv); res(); }
      }, step);
    });
  }

  /* ----------------------------------------------------------- renderers */
  function addBubbleShell(role) {
    var row = el("div", "row " + role);
    row.appendChild(el("div", "avatar " + role, role === "user" ? "you" : ""));
    var b = el("div", "bubble");
    var prose = el("div", "prose");
    b.appendChild(prose);
    row.appendChild(b);
    chatEl.appendChild(row);
    scrollDown();
    return prose;
  }

  function addBubble(role, text) {
    var prose = addBubbleShell(role);
    prose.innerHTML = renderMarkdown(text);
    scrollDown();
  }

  // reveals text in growing chunks, checking playToken/skip between each so a
  // restart or fast-forward can cut it short. `caret` shows a blinking cursor
  // mid-reveal (for the user "typing"); without it the chunk is re-parsed as
  // markdown each tick (for assistant streamed replies).
  async function revealText(prose, text, myToken, opts) {
    // hold screen-reader announcements until the message settles — otherwise the
    // per-tick innerHTML rewrites spam the #chat aria-live region with fragments.
    chatEl.setAttribute("aria-busy", "true");
    for (var i = opts.chunk; i < text.length; i += opts.chunk) {
      if (myToken !== playToken) { chatEl.setAttribute("aria-busy", "false"); return false; }
      if (skip) break;
      var shown = text.slice(0, i);
      prose.innerHTML = opts.caret ? escapeHtml(shown) + '<span class="caret"></span>' : renderMarkdown(shown);
      scrollDown();
      await wait(opts.jitterTick ? jitter(opts.tick) : opts.tick);
    }
    if (myToken !== playToken) { chatEl.setAttribute("aria-busy", "false"); return false; }
    prose.innerHTML = renderMarkdown(text);
    chatEl.setAttribute("aria-busy", "false"); // settled — now it's announced once
    scrollDown();
    return true;
  }

  function streamProse(prose, text, myToken) {
    var t = timing().stream;
    return revealText(prose, text, myToken, { chunk: t.chunk, tick: t.tick });
  }

  // human-ish typing cadence: a couple of characters at a time, irregular
  // pacing, cursor blinking at the end of what's been "typed" so far.
  // The bubble is pinned to its max allowed width (the same cap CSS gives
  // .row.user .bubble) up front, like a roomy text box, so it doesn't grow
  // narrow-to-wide as characters are typed; it shrinks back to fit the
  // final text once typing finishes.
  function typeUserText(prose, text, myToken) {
    var bubble = prose.parentElement;
    var row = bubble.parentElement;
    var maxWidth = row.getBoundingClientRect().width * 0.8; // matches .row.user .bubble's max-width: 80%
    bubble.style.width = Math.floor(maxWidth) + "px";
    var t = timing().user;
    return revealText(prose, text, myToken, { chunk: t.chunk, tick: t.tick, jitterTick: true, caret: true }).then(function (ok) {
      bubble.style.width = "";
      return ok;
    });
  }

  function addSystem(text) {
    var line = el("div", "system-line");
    line.appendChild(el("div", "prose", renderMarkdown(text)));
    chatEl.appendChild(line);
    scrollDown();
  }

  function addDbBadge(db) {
    var wrap = el("div", "row assistant");
    wrap.appendChild(el("div", "avatar assistant", ""));
    var b = el("div", "bubble");
    b.appendChild(el("span", "db-badge", "database · " + db));
    wrap.appendChild(b);
    chatEl.appendChild(wrap);
    scrollDown();
    return b; // subsequent tool cards append into this bubble
  }

  function showToolPending(ev, container) {
    var row = el("div", "tool-pending");
    row.setAttribute("data-server", ev.server || "geotab");
    row.appendChild(el("span", "tool-dot pending"));
    row.appendChild(el("span", "tool-pending-label", "Calling " + (ev.server || "geotab") + "." + ev.name + "…"));
    (container || chatEl).appendChild(row);
    scrollDown();
    return row;
  }

  function addToolCard(ev, container) {
    var card = el("div", "tool-card");
    card.setAttribute("data-server", ev.server || "geotab");

    var head = el("button", "tool-head");
    head.type = "button";
    head.setAttribute("aria-expanded", ev.openByDefault ? "true" : "false");
    head.setAttribute("aria-label", "Tool call " + (ev.server || "geotab") + "." + ev.name + " — show request and response");
    head.appendChild(el("span", "tool-dot"));
    head.appendChild(el("span", "tool-server", ev.server || "geotab"));
    head.appendChild(el("span", "tool-name", ev.name));
    if (ev.write) head.appendChild(el("span", "tool-badge", "action"));
    var sum = el("span", "tool-summary", "→ " + escapeHtml(ev.summary || "done"));
    head.appendChild(sum);
    head.appendChild(el("span", "tool-caret", "▶"));

    var body = el("div", "tool-body");
    body.appendChild(el("div", "lbl", "Request"));
    body.appendChild(el("pre", null, escapeHtml(JSON.stringify(ev.args || {}, null, 2))));
    if (ev.result != null) {
      body.appendChild(el("div", "lbl", "Response"));
      body.appendChild(el("pre", null, escapeHtml(ev.result)));
    }

    head.addEventListener("click", function () {
      var open = card.classList.toggle("open");
      head.setAttribute("aria-expanded", open ? "true" : "false");
    });
    card.appendChild(head);
    card.appendChild(body);
    if (ev.openByDefault) card.classList.add("open");
    (container || chatEl).appendChild(card);
    scrollDown();
  }

  function addConfirmCard(ev) {
    var c = el("div", "confirm-card");
    c.appendChild(el("div", "cf-head", "✅ Done — here's what changed in MyGeotab" + (ev.simulated !== false ? " (simulated)" : "")));
    var list = el("ul", "cf-list");
    (ev.changes || []).forEach(function (line) { list.appendChild(el("li", null, escapeHtml(line))); });
    c.appendChild(list);
    chatEl.appendChild(c);
    scrollDown();
  }

  function addEndcard(lines) {
    var c = el("div", "endcard");
    c.appendChild(el("div", "ec-1", escapeHtml(lines[0] || "")));
    if (lines[1]) c.appendChild(el("div", "ec-2", escapeHtml(lines[1])));
    c.appendChild(el("div", "ec-foot", "Same connector works in Microsoft Copilot, ChatGPT, Cursor, Windsurf, and other MCP clients · geotab.com"));
    // turn the moment of impact into a next step: jump to the "connect for real" guide
    var cta = el("button", "ec-cta", "Try this with your own fleet →");
    cta.type = "button";
    cta.addEventListener("click", openTryReal);
    c.appendChild(cta);
    chatEl.appendChild(c);
    scrollDown();
  }

  function tableHasRows(t) {
    var rows = String((t && t.rows) || "").toLowerCase();
    return !!rows && !/^\s*(0|0\s+rows|empty|none)\s*$/.test(rows);
  }

  function fallbackWarehouseSample(t) {
    if (!tableHasRows(t)) return [];
    var name = String(t.name || "table");
    var base = { sample_key: "demo", rows: String(t.rows || "") };
    if (/gps|pings/.test(name)) return [
      { device: "Demo - 02", event_time: "2026-06-30 08:14:22", speed: "48 km/h", lat: "39.4699", lon: "-0.3763" },
      { device: "Demo - 14", event_time: "2026-06-30 08:14:25", speed: "0 km/h", lat: "39.4731", lon: "-0.3808" }
    ];
    if (/trip/.test(name)) return [
      { device: "Demo - 08", trip_start: "2026-06-30 07:10", driver_id: "u_demo_17", distance_km: "18.4", duration_min: "31" }
    ];
    if (/driver_assignment|driver_assignments|driver_changes/.test(name)) return [
      { device: "Demo - 08", driver_id: "u_demo_17", active_from: "2026-06-30 07:06", source: "DriverChange" },
      { device: "Demo - 14", driver_id: "UnknownDriverId", active_from: "2026-06-30 08:00", source: "unassigned" }
    ];
    if (/status_data/.test(name)) return [
      { device: "Demo - 21", diagnostic: "EngineSpeed", event_time: "2026-06-30 08:12", value: "1420" }
    ];
    if (/exception/.test(name)) return [
      { device: "Demo - 31", rule: "Posted speed", event_time: "2026-06-30 08:03", severity: "review" }
    ];
    if (/fault/.test(name)) return [
      { device: "Demo - 08", diagnostic: "Engine coolant temp", event_time: "2026-06-29 21:44", fault_state: "active" }
    ];
    if (/dim_user/.test(name)) return [
      { user_id: "u_demo_17", display_name: "Driver 17", home_group: "Valencia" }
    ];
    if (/dim_rule/.test(name)) return [
      { rule_id: "r_posted_speed", name: "Posted speed", active: "true" }
    ];
    if (/dim_diagnostic/.test(name)) return [
      { diagnostic_id: "d_engine_speed", name: "EngineSpeed", unit: "rpm" }
    ];
    if (/daily_device_km/.test(name)) return [
      { date: "2026-06-30", device: "Demo - 02", km: "142.8" }
    ];
    if (/driver_safety_score|coaching/.test(name)) return [
      { driver: "Driver 31", score: "72", reason: "speed exceptions per km" }
    ];
    if (/maintenance|shop_worklist/.test(name)) return [
      { device: "Demo - 08", priority: "P2", reason: "fault cluster + downtime" }
    ];
    if (/idling/.test(name)) return [
      { date: "2026-06-30", group: "Valencia", estimated_cost_usd: "38" }
    ];
    if (/freshness/.test(name)) return [
      { table_name: "silver.planet_gps_pings", max_event_time: "2026-06-30 08:15", lag_minutes: "2" }
    ];
    if (/coverage/.test(name)) return [
      { device: "Demo - 02", gps_seen: "true", expected_today: "true" }
    ];
    if (/anomal/.test(name)) return [
      { check_name: "returned_sql_filter", severity: "warn", status: "needs review" }
    ];
    if (/fleet_ops_overview/.test(name)) return [
      { vehicles: "50", active_today: "26", open_faults: "9", coaching_queue: "14" }
    ];
    if (/storage|compute|refresh|query_cost|load_runs|row_counts|cost/.test(name)) return [
      { measure: name, value: String(t.rows || ""), source: "measured/estimated" }
    ];
    return [base];
  }

  function renderWarehouseSample(t) {
    var rows = (t.sample && t.sample.length) ? t.sample : fallbackWarehouseSample(t);
    if (!rows.length) return null;
    var details = el("details", "warehouse-sample");
    details.appendChild(el("summary", "warehouse-sample-toggle", "Sample rows"));
    var scroll = el("div", "warehouse-sample-scroll");
    // One grid for header + every data cell, so columns share tracks and always
    // line up (separate per-row grids size their columns independently and drift).
    var grid = el("div", "warehouse-sample-grid");
    var cols = Object.keys(rows[0] || {});
    grid.style.setProperty("--warehouse-sample-cols", cols.length);
    cols.forEach(function (c) { grid.appendChild(el("span", "warehouse-sample-cell warehouse-sample-head", escapeHtml(c))); });
    rows.forEach(function (r) {
      cols.forEach(function (c) { grid.appendChild(el("span", "warehouse-sample-cell", escapeHtml(String(r[c] == null ? "" : r[c])))); });
    });
    scroll.appendChild(grid);
    details.appendChild(scroll);
    return details;
  }

  function renderWarehouseBody(ev, body) {
    body.innerHTML = "";
    if (ev.metrics && ev.metrics.length) {
      var metrics = el("div", "warehouse-metrics");
      ev.metrics.forEach(function (m) {
        var metric = el("div", "warehouse-metric");
        metric.appendChild(el("span", "warehouse-metric-label", escapeHtml(m.label || "")));
        metric.appendChild(el("strong", null, escapeHtml(String(m.value || ""))));
        metrics.appendChild(metric);
      });
      body.appendChild(metrics);
    }

    var stages = el("div", "warehouse-stages");
    (ev.stages || []).forEach(function (stage) {
      var stageEl = el("div", "warehouse-stage warehouse-stage-" + (stage.kind || "default") + (stage.active ? " active" : ""));
      var title = el("div", "warehouse-stage-title");
      title.appendChild(el("span", "warehouse-stage-dot"));
      title.appendChild(el("strong", null, escapeHtml(stage.name || "Stage")));
      if (stage.status) title.appendChild(el("span", "warehouse-stage-status", escapeHtml(stage.status)));
      stageEl.appendChild(title);
      var tableList = el("div", "warehouse-tables");
      (stage.tables || []).forEach(function (t) {
        var row = el("div", "warehouse-table-row");
        row.appendChild(el("code", null, escapeHtml(t.name || "table")));
        row.appendChild(el("span", "warehouse-row-count", escapeHtml(t.rows || "0 rows")));
        if (t.note) row.appendChild(el("span", "warehouse-table-note", escapeHtml(t.note)));
        var sample = renderWarehouseSample(t);
        if (sample) row.appendChild(sample);
        tableList.appendChild(row);
      });
      stageEl.appendChild(tableList);
      stages.appendChild(stageEl);
    });
    body.appendChild(stages);

    if (ev.note) body.appendChild(el("div", "warehouse-note", escapeHtml(ev.note)));
  }

  function setMotherduckPaneOpen(open) {
    if (!motherduckPane || !motherduckPaneToggle) return;
    motherduckPane.classList.toggle("collapsed", !open);
    motherduckPaneToggle.setAttribute("aria-expanded", open ? "true" : "false");
    motherduckPaneToggle.setAttribute("aria-label", (open ? "Hide" : "Show") + " MotherDuck warehouse state");
  }

  function addWarehousePane(ev) {
    if (!motherduckPane || !motherduckPaneBody) return;
    var tableCount = (ev.stages || []).reduce(function (n, stage) { return n + ((stage.tables || []).length); }, 0);
    var topMetric = ev.metrics && ev.metrics.length ? String(ev.metrics[0].value || "") : "";
    var summary = ev.summary || (tableCount ? tableCount + " tables" : topMetric || "updated");

    motherduckPane.classList.remove("hidden");
    if (motherduckPaneTitle) motherduckPaneTitle.textContent = ev.title === "MotherDuck" ? "Warehouse" : (ev.title || "Warehouse");
    if (motherduckPaneSubtitle) motherduckPaneSubtitle.textContent = ev.compactSubtitle || ev.subtitle || "Updated";
    if (motherduckPaneSummary) motherduckPaneSummary.textContent = summary;
    renderWarehouseBody(ev, motherduckPaneBody);

    // The pane is persistent and collapsed by default: the transcript stays clean,
    // but the latest MotherDuck state is always one click away. Point the user to
    // it once, then let it update silently (a per-event "updated" line is noise).
    setMotherduckPaneOpen(false);
    if (!warehousePointerShown) {
      addSystem("Open the **MotherDuck** panel at the top to see your tables and schemas.");
      warehousePointerShown = true;
    }
  }

  function addChart(ev) {
    var max = (ev.bars || []).reduce(function (m, b) { return Math.max(m, b.value || 0); }, 0) || 1;
    var card = el("div", "chart-card");
    // text alternative so the bar chart isn't invisible to screen readers
    card.setAttribute("role", "img");
    card.setAttribute("aria-label",
      (ev.title ? ev.title + ": " : "Chart: ") +
      (ev.bars || []).map(function (b) { return b.label + " " + b.value; }).join(", "));
    if (ev.title) card.appendChild(el("div", "chart-title", escapeHtml(ev.title)));
    (ev.bars || []).forEach(function (b) {
      var row = el("div", "chart-row");
      row.appendChild(el("span", "chart-label", escapeHtml(b.label)));
      var track = el("span", "chart-track");
      var fill = el("span", "chart-fill");
      fill.style.width = Math.round(((b.value || 0) / max) * 100) + "%";
      fill.appendChild(el("span", "chart-val", String(b.value)));
      track.appendChild(fill);
      row.appendChild(track);
      card.appendChild(row);
    });
    chatEl.appendChild(card);
    scrollDown();
  }

  function svgPathFromPoints(points) {
    return "M" + points.map(function (pt) { return pt[0] + " " + pt[1]; }).join(" L");
  }

  function drawMapAreas(canvas, areas) {
    if (!areas || !areas.length) return;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "map-area-svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    areas.forEach(function (a) {
      var shape;
      if (a.d) {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("d", a.d);
      } else if (a.points && a.points.length) {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        shape.setAttribute("points", a.points.map(function (pt) { return pt[0] + "," + pt[1]; }).join(" "));
      } else {
        shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        shape.setAttribute("x", a.x || 0);
        shape.setAttribute("y", a.y || 0);
        shape.setAttribute("width", a.w || 8);
        shape.setAttribute("height", a.h || 6);
        if (a.rx != null) shape.setAttribute("rx", a.rx);
      }
      shape.setAttribute("class", "map-area map-area-" + (a.kind || "block"));
      if (a.rotate) shape.setAttribute("transform", "rotate(" + a.rotate + " " + ((a.x || 0) + (a.w || 0) / 2) + " " + ((a.y || 0) + (a.h || 0) / 2) + ")");
      svg.appendChild(shape);
    });
    canvas.appendChild(svg);
  }

  function drawMapRoads(canvas, roads) {
    if (!roads || !roads.length) return;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "map-road-svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    roads.forEach(function (r) {
      var d = r.d || (r.points && r.points.length ? svgPathFromPoints(r.points) : null);
      if (!d) return;
      var kind = r.kind || "local";
      var casing = document.createElementNS("http://www.w3.org/2000/svg", "path");
      casing.setAttribute("class", "map-road-casing map-road-casing-" + kind);
      casing.setAttribute("d", d);
      svg.appendChild(casing);

      var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "map-road map-road-" + kind);
      path.setAttribute("d", d);
      svg.appendChild(path);

      if (r.label) {
        var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        var x = r.labelX != null ? r.labelX : 50;
        var y = r.labelY != null ? r.labelY : 50;
        txt.setAttribute("class", "map-road-label");
        txt.setAttribute("x", x);
        txt.setAttribute("y", y);
        if (r.labelRotate) txt.setAttribute("transform", "rotate(" + r.labelRotate + " " + x + " " + y + ")");
        txt.textContent = r.label;
        svg.appendChild(txt);
      }
    });
    canvas.appendChild(svg);
  }

  function drawMapIntersections(canvas, intersections) {
    if (!intersections || !intersections.length) return;
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "map-intersection-svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    intersections.forEach(function (i) {
      var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("class", "map-intersection map-intersection-" + (i.kind || "major"));
      c.setAttribute("cx", i.x || 0);
      c.setAttribute("cy", i.y || 0);
      c.setAttribute("r", i.r || 1.1);
      svg.appendChild(c);
    });
    canvas.appendChild(svg);
  }

  function addMap(ev) {
    var card = el("div", "map-card");
    var labeledPins = (ev.pins || []).filter(function (p) { return p.label; });
    // text alternative — the SVG zone + pins convey data screen readers can't see
    card.setAttribute("role", "img");
    card.setAttribute("aria-label",
      (ev.title ? ev.title + ". " : "Map. ") +
      (ev.zone && ev.zone.label ? "Zone: " + ev.zone.label + ". " : "") +
      (ev.summary ? ev.summary + ". " : "") +
      (labeledPins.length ? "Markers: " + labeledPins.map(function (p) { return p.label; }).join(", ") + "." : ""));
    if (ev.title) card.appendChild(el("div", "map-title", escapeHtml(ev.title)));
    var canvas = el("div", "map-canvas" + (ev.mapStyle ? " map-canvas-" + ev.mapStyle : ""));
    var chrome = el("div", "map-chrome", '<span>Street map</span><span class="map-zoom">＋ −</span>');
    chrome.setAttribute("aria-hidden", "true");
    canvas.appendChild(chrome);
    drawMapAreas(canvas, ev.areas || []);
    if (ev.zone && ev.zone.points && ev.zone.points.length) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "map-zone-svg");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      var poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("class", "map-zone-shape");
      poly.setAttribute("points", ev.zone.points.map(function (pt) { return pt[0] + "," + pt[1]; }).join(" "));
      svg.appendChild(poly);
      canvas.appendChild(svg);
    }
    drawMapRoads(canvas, ev.roads || []);
    drawMapIntersections(canvas, ev.intersections || []);
    if (ev.zone && ev.zone.label) {
      var zoneTag = el("div", "map-zone-label", escapeHtml(ev.zone.label));
      zoneTag.style.left = (ev.zone.labelX != null ? ev.zone.labelX : 50) + "%";
      zoneTag.style.top = (ev.zone.labelY != null ? ev.zone.labelY : 50) + "%";
      canvas.appendChild(zoneTag);
    }
    (ev.pins || []).forEach(function (p) {
      var pin = el("div", "map-pin map-pin-" + (p.status || "free") + (p.compact ? " map-pin-compact" : ""));
      pin.style.left = (p.x || 0) + "%";
      pin.style.top = (p.y || 0) + "%";
      if (p.title || p.label) pin.setAttribute("title", p.title || p.label);
      pin.appendChild(el("span", "map-dot"));
      if (p.label) {
        var tagHtml = escapeHtml(p.label || "") + (p.value != null ? ' <span class="map-tag-val">· ' + escapeHtml(String(p.value)) + "mi</span>" : "");
        pin.appendChild(el("span", "map-tag", tagHtml));
      }
      canvas.appendChild(pin);
    });
    card.appendChild(canvas);
    var scale = el("div", "map-scale", "200 m");
    scale.setAttribute("aria-hidden", "true");
    canvas.appendChild(scale);
    if (ev.summary) card.appendChild(el("div", "map-summary", escapeHtml(ev.summary)));
    card.appendChild(el("div", "map-disclosure", ev.disclosure ? escapeHtml(ev.disclosure) : "Illustrative overlay on © OpenStreetMap contributors, © CARTO basemap · not live tracking"));
    chatEl.appendChild(card);
    scrollDown();
  }

  function addMedia(ev) {
    var card = el("div", "media-card");
    if (ev.illustrative) {
      card.appendChild(
        el("div", "media-disclosure", "Illustrative reconstruction · AI-generated, not a live MCP capture")
      );
    }
    // Default to the fallback: a <video> with a missing/bad source doesn't reliably fire
    // an "error" event (no-source resource selection often just leaves networkState at
    // NETWORK_NO_SOURCE), so fail toward the safe state and only swap in the video once
    // it actually has data.
    var fallback = el(
      "div",
      "media-fallback show",
      escapeHtml(ev.fallbackText || "Clip not found — see media/README.md to generate and drop it in.")
    );
    var vid = document.createElement("video");
    vid.className = "media-video hidden";
    vid.controls = true;
    vid.preload = "metadata";
    if (ev.poster) vid.poster = ev.poster;
    vid.src = ev.src;
    vid.addEventListener("loadeddata", function () {
      vid.classList.remove("hidden");
      fallback.classList.remove("show");
    });

    card.appendChild(vid);
    card.appendChild(fallback);
    if (ev.caption) card.appendChild(el("div", "media-caption", escapeHtml(ev.caption)));
    chatEl.appendChild(card);
    scrollDown();
  }

  function showTyping() {
    var row = el("div", "row assistant typing-row");
    row.appendChild(el("div", "avatar assistant", ""));
    var b = el("div", "bubble");
    b.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    row.appendChild(b);
    chatEl.appendChild(row);
    scrollDown();
    return row;
  }

  /* --------------------------------------------------------- play a node */
  function setConn(connected) {
    if (connected) { connEl.textContent = "Connected · Geotab"; connEl.className = "conn-pill conn-on"; }
    else { connEl.textContent = "Not connected"; connEl.className = "conn-pill conn-off"; }
  }

  async function playNode(id) {
    var node = NODES[id];
    if (!node) return;
    var myToken = ++playToken;
    skip = false;
    trayEl.innerHTML = "";
    if (emptyStateEl) { emptyStateEl.remove(); emptyStateEl = null; }
    setConn(id !== "connect");
    if (node.mode === "warehouse") connEl.textContent = "Connected · Geotab + MotherDuck";
    currentNodeId = id;
    if (history.replaceState) history.replaceState(null, "", "#" + id);

    var toolContainer = null;

    for (var k = 0; k < (node.events || []).length; k++) {
      if (myToken !== playToken) return; // superseded
      var ev = node.events[k];
      if (ev.type === "tool") {
        if (ev.server === "geotab" && node.db && !toolContainer) toolContainer = addDbBadge(node.db);
        var toolTarget = ev.server === "geotab" && toolContainer ? toolContainer : null;
        var pending = showToolPending(ev, toolTarget);
        await wait(toolDelay(ev));
        pending.remove();
        if (myToken !== playToken) return;
        addToolCard(ev, toolTarget);
      } else if (ev.type === "assistant") {
        toolContainer = null; // next run of tool calls gets its own badge, in order
        var typer = showTyping();
        await wait(thinkDelay(ev.text));
        typer.remove();
        if (myToken !== playToken) return;
        var prose = addBubbleShell("assistant");
        if (!(await streamProse(prose, ev.text, myToken))) return;
      } else if (ev.type === "system") {
        toolContainer = null;
        await wait(timedDelay("system"));
        if (myToken !== playToken) return;
        addSystem(ev.text);
      } else if (ev.type === "warehouse") {
        toolContainer = null;
        await wait(timedDelay("tool"));
        if (myToken !== playToken) return;
        addWarehousePane(ev);
      } else if (ev.type === "chart") {
        toolContainer = null;
        await wait(timedDelay("tool"));
        if (myToken !== playToken) return;
        addChart(ev);
      } else if (ev.type === "map") {
        toolContainer = null;
        await wait(timedDelay("tool"));
        if (myToken !== playToken) return;
        addMap(ev);
      } else if (ev.type === "confirm") {
        toolContainer = null;
        await wait(timedDelay("tool"));
        if (myToken !== playToken) return;
        addConfirmCard(ev);
      } else if (ev.type === "endcard") {
        toolContainer = null;
        await wait(timedDelay("gap"));
        if (myToken !== playToken) return;
        addEndcard(ev.lines || []);
      } else if (ev.type === "media") {
        toolContainer = null;
        await wait(timedDelay("tool"));
        if (myToken !== playToken) return;
        addMedia(ev);
      }
      await wait(timedDelay("gap"));
    }
    if (myToken !== playToken) return;

    if (node.choices && node.choices.length) renderChoices(node.choices);
    else if (node.next) { await wait(timedDelay("gap")); if (myToken === playToken) playNode(node.next); }
  }

  function renderChoices(choices) {
    trayEl.innerHTML = "";
    trayEl.appendChild(el("div", "tray-hint", "Choose a suggested prompt to continue the simulator:"));
    var lastGroup = null;
    choices.forEach(function (c, idx) {
      if (c.group && c.group !== lastGroup) {
        trayEl.appendChild(el("div", "tray-group", escapeHtml(c.group)));
        lastGroup = c.group;
      }
      var primary = c.recommended || (idx === 0 && c.next);
      var btn = el("button", "chip" + (primary ? " primary" : "") + (c.action ? " subtle" : ""));
      btn.type = "button";
      btn.innerHTML = (c.recommended ? '<span class="chip-badge">Start here</span>' : "") + escapeHtml(c.label);
      btn.addEventListener("click", function () { onChoice(c); });
      trayEl.appendChild(btn);
    });
    trayEl.scrollTop = 0;
    scrollDown();
  }

  async function onChoice(c) {
    if (c.action === "restart") { restart(); return; }
    var myToken = playToken; // still the node whose choices are showing
    trayEl.innerHTML = ""; // one shot — no double-clicking another chip mid-type
    if (c.say || c.label) {
      var prose = addBubbleShell("user");
      if (!(await typeUserText(prose, c.say || c.label, myToken))) return;
    }
    if (myToken !== playToken) return;
    if (c.next) playNode(c.next);
  }

  // --- modal focus management: move focus in on open, trap Tab inside the
  // panel, and restore focus to the trigger on close (a11y for the dialogs).
  var lastFocused = null;
  function focusables(overlay) {
    return Array.prototype.slice.call(
      overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter(function (e) { return !e.disabled && e.offsetParent !== null; });
  }
  function openOverlay(overlay, trigger) {
    lastFocused = trigger || document.activeElement;
    overlay.classList.remove("hidden");
    var f = focusables(overlay);
    (f[0] || overlay).focus();
  }
  function closeOverlay(overlay) {
    if (overlay.classList.contains("hidden")) return;
    overlay.classList.add("hidden");
    if (overlay === settingsOverlay && settingsBtn) settingsBtn.setAttribute("aria-expanded", "false");
    var target =
      lastFocused && typeof lastFocused.focus === "function" && lastFocused.offsetParent !== null
        ? lastFocused
        : tryRealBtn; // visible fallback if the original trigger is now hidden (e.g. landing CTA)
    target.focus();
  }
  // the visible (non-hidden) overlay, if any — for Escape + tab-trap targeting
  function activeOverlay() {
    var all = [landingOverlay, settingsOverlay, tryRealOverlay, aboutOverlay];
    for (var i = 0; i < all.length; i++) if (!all[i].classList.contains("hidden")) return all[i];
    return null;
  }

  function closeLanding() { closeOverlay(landingOverlay); }
  function openSettings() {
    if (settingsBtn) settingsBtn.setAttribute("aria-expanded", "true");
    openOverlay(settingsOverlay, settingsBtn);
  }
  function closeSettings() { closeOverlay(settingsOverlay); }
  function openTryReal() {
    var trigger = document.activeElement;
    closeLanding();
    openOverlay(tryRealOverlay, trigger);
  }
  function closeTryReal() {
    closeOverlay(tryRealOverlay);
    // a deep link (#connect-real) shouldn't stick around in the address bar once dismissed
    if (location.hash.replace(/^#/, "") === REAL_ACCOUNT_HASH && history.replaceState && currentNodeId) {
      history.replaceState(null, "", "#" + currentNodeId);
    }
  }
  function openAbout() { openOverlay(aboutOverlay); }
  function closeAbout() { closeOverlay(aboutOverlay); }

  /* ------------------------------------------------------------- controls */
  function clearChat() {
    chatEl.innerHTML = "";
    trayEl.innerHTML = "";
    warehousePointerShown = false;
    if (motherduckPane) motherduckPane.classList.add("hidden", "collapsed");
  }
  function restart() { playToken++; clearChat(); playNode(GRAPH.start); }

  restartBtn.addEventListener("click", restart);
  startSimBtn.addEventListener("click", closeLanding);
  if (startWarehouseBtn) startWarehouseBtn.addEventListener("click", function () { closeLanding(); playToken++; clearChat(); playNode("warehouse-intro"); });
  if (motherduckPaneToggle) motherduckPaneToggle.addEventListener("click", function () { setMotherduckPaneOpen(motherduckPane.classList.contains("collapsed")); });
  settingsBtn.addEventListener("click", openSettings);
  settingsClose.addEventListener("click", closeSettings);
  settingsOverlay.addEventListener("click", function (e) { if (e.target === settingsOverlay) closeSettings(); });
  speedOptionBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { setSpeedMode(btn.getAttribute("data-speed")); });
  });
  tryRealBtn.addEventListener("click", openTryReal);
  tryRealBtnLanding.addEventListener("click", openTryReal);
  tryRealClose.addEventListener("click", closeTryReal);
  tryRealOverlay.addEventListener("click", function (e) { if (e.target === tryRealOverlay) closeTryReal(); });
  aboutBtn.addEventListener("click", openAbout);
  aboutClose.addEventListener("click", closeAbout);
  aboutOverlay.addEventListener("click", function (e) { if (e.target === aboutOverlay) closeAbout(); });
  document.addEventListener("keydown", function (e) {
    var open = activeOverlay();
    if (!open) return;
    if (e.key === "Escape") { closeOverlay(open); return; }
    if (e.key === "Tab") {
      // keep focus inside the open dialog
      var f = focusables(open);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // click anywhere while it's playing to fast-forward — not just the chat column,
  // so a click in the desktop margins during a long paragraph still skips. Ignore
  // clicks on interactive controls (choices, links, card/pane toggles, settings).
  document.addEventListener("click", function (e) {
    if (e.target.closest("button, a, input, textarea, select, label, summary, .tool-head, .motherduck-pane, .overlay")) return;
    skip = true;
  });

  /* ---------------------------------------------------------------- boot */
  updateSpeedUi();
  checkGraph();
  var hash = (location.hash || "").replace(/^#/, "");
  var hasNodeHash = !!NODES[hash];
  if (hasNodeHash) closeLanding();
  playNode(hasNodeHash ? hash : GRAPH.start);
  if (hash === REAL_ACCOUNT_HASH) {
    openTryReal();
    // playNode already rewrote the hash to the underlying node; put the deep link back
    // so refreshing or copying the URL while the overlay is open returns here, not to the start.
    if (history.replaceState) history.replaceState(null, "", "#" + REAL_ACCOUNT_HASH);
  }
})();
