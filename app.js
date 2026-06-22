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
  var trayEl = document.getElementById("tray");
  var connEl = document.getElementById("connStatus");
  var restartBtn = document.getElementById("restartBtn");
  var shareBtn = document.getElementById("shareBtn");
  var landingOverlay = document.getElementById("landingOverlay");
  var startSimBtn = document.getElementById("startSimBtn");
  var tryRealOverlay = document.getElementById("tryRealOverlay");
  var tryRealBtn = document.getElementById("tryRealBtn");
  var tryRealBtnLanding = document.getElementById("tryRealBtnLanding");
  var tryRealClose = document.getElementById("tryRealClose");
  var aboutBtn = document.getElementById("aboutBtn");
  var aboutOverlay = document.getElementById("aboutOverlay");
  var aboutClose = document.getElementById("aboutClose");

  // timing (ms) — baselines, scaled per-event below so a long answer or a
  // slower call (writes, web fetches) takes a believable beat longer than a
  // quick read; halved-to-zero when the user clicks to skip a node's playback
  var BASE = { tool: 360, think: 380, system: 300, gap: 200 };
  var skip = false;
  var playToken = 0; // invalidates an in-flight playback when we jump elsewhere
  var currentNodeId = null; // last id pushed to location.hash by playNode
  var REAL_ACCOUNT_HASH = "connect-real"; // shareable deep link straight to the "connect real account" overlay
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function jitter(ms) { return Math.round(ms * (0.85 + Math.random() * 0.3)); } // +/-15%, feels less robotic
  function wordCount(text) { return ((text || "").trim().match(/\S+/g) || []).length; }

  // "thinking" pause before Claude starts streaming a reply — longer answers
  // get a longer beat, like the model taking more time to plan them.
  function thinkDelay(text) { return jitter(clamp(BASE.think + wordCount(text) * 14, 450, 1700)); }
  // round-trip latency for a tool call — writes and external (web) fetches
  // run a bit slower than a plain read, like a real MCP call would.
  function toolDelay(ev) {
    var d = BASE.tool;
    if (ev.write) d += 260;
    if (ev.server === "web") d += 340;
    return jitter(d);
  }

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
  // markdown each tick (for Claude's streamed replies).
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
    return revealText(prose, text, myToken, { chunk: 6, tick: 40 });
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
    return revealText(prose, text, myToken, { chunk: 2, tick: 24, jitterTick: true, caret: true }).then(function (ok) {
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
    var wrap = el("div", "row claude");
    wrap.appendChild(el("div", "avatar claude", ""));
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
    c.appendChild(el("div", "ec-badge", "Simulator note — not part of the reply"));
    c.appendChild(el("div", "ec-1", escapeHtml(lines[0] || "")));
    if (lines[1]) c.appendChild(el("div", "ec-2", escapeHtml(lines[1])));
    c.appendChild(el("div", "ec-foot", "Same connector also works in Microsoft Copilot, ChatGPT, Block Goose, Cursor & Windsurf · geotab.com"));
    // turn the moment of impact into a next step: jump to the "connect for real" guide
    var cta = el("button", "ec-cta", "🔌 Try this with your own fleet");
    cta.type = "button";
    cta.addEventListener("click", openTryReal);
    c.appendChild(cta);
    chatEl.appendChild(c);
    scrollDown();
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

  function addMap(ev) {
    var card = el("div", "map-card");
    // text alternative — the SVG zone + pins convey data screen readers can't see
    card.setAttribute("role", "img");
    card.setAttribute("aria-label",
      (ev.title ? ev.title + ". " : "Map. ") +
      (ev.zone && ev.zone.label ? "Zone: " + ev.zone.label + ". " : "") +
      ((ev.pins || []).length ? "Vehicles: " + ev.pins.map(function (p) { return p.label; }).join(", ") + "." : ""));
    if (ev.title) card.appendChild(el("div", "map-title", escapeHtml(ev.title)));
    var canvas = el("div", "map-canvas");
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
      if (ev.zone.label) {
        var zoneTag = el("div", "map-zone-label", escapeHtml(ev.zone.label));
        zoneTag.style.left = (ev.zone.labelX != null ? ev.zone.labelX : 50) + "%";
        zoneTag.style.top = (ev.zone.labelY != null ? ev.zone.labelY : 50) + "%";
        canvas.appendChild(zoneTag);
      }
    }
    (ev.pins || []).forEach(function (p) {
      var pin = el("div", "map-pin map-pin-" + (p.status || "free"));
      pin.style.left = (p.x || 0) + "%";
      pin.style.top = (p.y || 0) + "%";
      pin.appendChild(el("span", "map-dot"));
      var tagHtml = escapeHtml(p.label || "") + (p.value != null ? ' <span class="map-tag-val">· ' + escapeHtml(String(p.value)) + "mi</span>" : "");
      pin.appendChild(el("span", "map-tag", tagHtml));
      canvas.appendChild(pin);
    });
    card.appendChild(canvas);
    card.appendChild(el("div", "map-disclosure", "🗺️ Illustrative map — relative positions, not to scale"));
    chatEl.appendChild(card);
    scrollDown();
  }

  function addMedia(ev) {
    var card = el("div", "media-card");
    if (ev.illustrative) {
      card.appendChild(
        el("div", "media-disclosure", "🎬 Illustrative reconstruction — AI-generated, not a live MCP capture")
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
    var row = el("div", "row claude typing-row");
    row.appendChild(el("div", "avatar claude", ""));
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
    setConn(id !== "connect");
    currentNodeId = id;
    if (history.replaceState) history.replaceState(null, "", "#" + id);

    var toolContainer = null;

    for (var k = 0; k < (node.events || []).length; k++) {
      if (myToken !== playToken) return; // superseded
      var ev = node.events[k];
      if (ev.type === "tool") {
        if (ev.server === "geotab" && !toolContainer) toolContainer = addDbBadge(node.db);
        var toolTarget = ev.server === "geotab" ? toolContainer : null;
        var pending = showToolPending(ev, toolTarget);
        await wait(toolDelay(ev));
        pending.remove();
        if (myToken !== playToken) return;
        addToolCard(ev, toolTarget);
      } else if (ev.type === "claude") {
        toolContainer = null; // next run of tool calls gets its own badge, in order
        var typer = showTyping();
        await wait(thinkDelay(ev.text));
        typer.remove();
        if (myToken !== playToken) return;
        var prose = addBubbleShell("claude");
        if (!(await streamProse(prose, ev.text, myToken))) return;
      } else if (ev.type === "system") {
        toolContainer = null;
        await wait(jitter(BASE.system));
        if (myToken !== playToken) return;
        addSystem(ev.text);
      } else if (ev.type === "chart") {
        toolContainer = null;
        await wait(jitter(BASE.tool));
        if (myToken !== playToken) return;
        addChart(ev);
      } else if (ev.type === "map") {
        toolContainer = null;
        await wait(jitter(BASE.tool));
        if (myToken !== playToken) return;
        addMap(ev);
      } else if (ev.type === "confirm") {
        toolContainer = null;
        await wait(jitter(BASE.tool));
        if (myToken !== playToken) return;
        addConfirmCard(ev);
      } else if (ev.type === "endcard") {
        toolContainer = null;
        await wait(jitter(BASE.gap));
        if (myToken !== playToken) return;
        addEndcard(ev.lines || []);
      } else if (ev.type === "media") {
        toolContainer = null;
        await wait(jitter(BASE.tool));
        if (myToken !== playToken) return;
        addMedia(ev);
      }
      await wait(jitter(BASE.gap));
    }
    if (myToken !== playToken) return;

    if (node.choices && node.choices.length) renderChoices(node.choices);
    else if (node.next) { await wait(jitter(BASE.gap)); if (myToken === playToken) playNode(node.next); }
  }

  function renderChoices(choices) {
    trayEl.innerHTML = "";
    trayEl.appendChild(el("div", "tray-hint", "Pick a reply — this is a simulator, so we suggest the questions:"));
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
    var target =
      lastFocused && typeof lastFocused.focus === "function" && lastFocused.offsetParent !== null
        ? lastFocused
        : tryRealBtn; // visible fallback if the original trigger is now hidden (e.g. landing CTA)
    target.focus();
  }
  // the visible (non-hidden) overlay, if any — for Escape + tab-trap targeting
  function activeOverlay() {
    var all = [landingOverlay, tryRealOverlay, aboutOverlay];
    for (var i = 0; i < all.length; i++) if (!all[i].classList.contains("hidden")) return all[i];
    return null;
  }

  function closeLanding() { closeOverlay(landingOverlay); }
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
  // copy a deep link to the current node (the hash already tracks playback in
  // playNode via replaceState) so people can share "look at *this* answer".
  function shareLink() {
    var url = location.href;
    var done = function () {
      var prev = shareBtn.textContent;
      shareBtn.textContent = "✓ Link copied";
      setTimeout(function () { shareBtn.textContent = prev; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { window.prompt("Copy this link:", url); });
    } else {
      window.prompt("Copy this link:", url);
    }
  }

  function clearChat() { chatEl.innerHTML = ""; trayEl.innerHTML = ""; }
  function restart() { playToken++; clearChat(); playNode(GRAPH.start); }

  restartBtn.addEventListener("click", restart);
  shareBtn.addEventListener("click", shareLink);
  startSimBtn.addEventListener("click", closeLanding);
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
  // click the transcript while it's playing to fast-forward
  chatEl.addEventListener("click", function (e) {
    if (e.target.closest(".tool-head")) return; // let card toggles work
    skip = true;
  });

  /* ---------------------------------------------------------------- boot */
  checkGraph();
  var hash = (location.hash || "").replace(/^#/, "");
  playNode(NODES[hash] ? hash : GRAPH.start);
  if (hash === REAL_ACCOUNT_HASH) {
    openTryReal();
    // playNode already rewrote the hash to the underlying node; put the deep link back
    // so refreshing or copying the URL while the overlay is open returns here, not to the start.
    if (history.replaceState) history.replaceState(null, "", "#" + REAL_ACCOUNT_HASH);
  }
})();
