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
  var mapBtn = document.getElementById("mapBtn");
  var mapOverlay = document.getElementById("mapOverlay");
  var mapBody = document.getElementById("mapBody");
  var mapClose = document.getElementById("mapClose");

  // timing (ms); halved-to-zero when the user clicks to skip a node's playback
  var T = { tool: 480, type: 620, system: 360, gap: 220 };
  var skip = false;
  var playToken = 0; // invalidates an in-flight playback when we jump elsewhere

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
  function scrollDown() { chatEl.scrollTop = chatEl.scrollHeight; window.scrollTo(0, document.body.scrollHeight); }
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
  function addBubble(role, text) {
    var row = el("div", "row " + role);
    row.appendChild(el("div", "avatar " + role, role === "user" ? "you" : "✳"));
    var b = el("div", "bubble");
    b.appendChild(el("div", "prose", renderMarkdown(text)));
    row.appendChild(b);
    chatEl.appendChild(row);
    scrollDown();
  }

  function addSystem(text) {
    var line = el("div", "system-line");
    line.appendChild(el("div", "prose", renderMarkdown(text)));
    chatEl.appendChild(line);
    scrollDown();
  }

  function addDbBadge(db) {
    var wrap = el("div", "row claude");
    wrap.appendChild(el("div", "avatar claude", "✳"));
    var b = el("div", "bubble");
    b.appendChild(el("span", "db-badge", "database · " + db));
    wrap.appendChild(b);
    chatEl.appendChild(wrap);
    scrollDown();
    return b; // subsequent tool cards append into this bubble
  }

  function addToolCard(ev, container) {
    var card = el("div", "tool-card");
    card.setAttribute("data-server", ev.server || "geotab");

    var head = el("button", "tool-head");
    head.type = "button";
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

    head.addEventListener("click", function () { card.classList.toggle("open"); });
    card.appendChild(head);
    card.appendChild(body);
    (container || chatEl).appendChild(card);
    scrollDown();
  }

  function addEndcard(lines) {
    var c = el("div", "endcard");
    c.appendChild(el("div", "ec-1", escapeHtml(lines[0] || "")));
    if (lines[1]) c.appendChild(el("div", "ec-2", escapeHtml(lines[1])));
    c.appendChild(el("div", "ec-foot", "Same connector also works in Microsoft Copilot, ChatGPT, Block Goose, Cursor & Windsurf · geotab.com"));
    chatEl.appendChild(c);
    scrollDown();
  }

  function addChart(ev) {
    var max = (ev.bars || []).reduce(function (m, b) { return Math.max(m, b.value || 0); }, 0) || 1;
    var card = el("div", "chart-card");
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
    row.appendChild(el("div", "avatar claude", "✳"));
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
    if (history.replaceState) history.replaceState(null, "", "#" + id);

    var toolContainer = null;
    if (node.db) toolContainer = addDbBadge(node.db);

    for (var k = 0; k < (node.events || []).length; k++) {
      if (myToken !== playToken) return; // superseded
      var ev = node.events[k];
      if (ev.type === "tool") {
        await wait(T.tool);
        if (myToken !== playToken) return;
        addToolCard(ev, ev.server === "geotab" ? toolContainer : null);
      } else if (ev.type === "claude") {
        var typer = showTyping();
        await wait(T.type);
        typer.remove();
        if (myToken !== playToken) return;
        addBubble("claude", ev.text);
      } else if (ev.type === "system") {
        await wait(T.system);
        if (myToken !== playToken) return;
        addSystem(ev.text);
      } else if (ev.type === "chart") {
        await wait(T.tool);
        if (myToken !== playToken) return;
        addChart(ev);
      } else if (ev.type === "endcard") {
        await wait(T.gap);
        if (myToken !== playToken) return;
        addEndcard(ev.lines || []);
      } else if (ev.type === "media") {
        await wait(T.tool);
        if (myToken !== playToken) return;
        addMedia(ev);
      }
      await wait(T.gap);
    }
    if (myToken !== playToken) return;

    if (node.choices && node.choices.length) renderChoices(node.choices);
    else if (node.next) { await wait(T.gap); if (myToken === playToken) playNode(node.next); }
  }

  function renderChoices(choices) {
    trayEl.innerHTML = "";
    trayEl.appendChild(el("div", "tray-hint", "Pick a reply — this is a simulator, so we suggest the questions:"));
    choices.forEach(function (c, idx) {
      var btn = el("button", "chip" + (idx === 0 && c.next ? " primary" : "") + (c.action ? " subtle" : ""));
      btn.type = "button";
      btn.textContent = c.label;
      btn.addEventListener("click", function () { onChoice(c); });
      trayEl.appendChild(btn);
    });
    scrollDown();
  }

  function onChoice(c) {
    if (c.action === "restart") { restart(); return; }
    if (c.action === "map") { openMap(); return; }
    if (c.say || c.label) addBubble("user", c.say || c.label);
    if (c.next) playNode(c.next);
  }

  /* ----------------------------------------------------------- story map */
  function buildMapOrder() {
    // BFS from start for a readable order + depth
    var order = [], depth = {}, seen = {}, q = [GRAPH.start];
    depth[GRAPH.start] = 0;
    while (q.length) {
      var id = q.shift();
      if (seen[id] || !NODES[id]) continue;
      seen[id] = true; order.push(id);
      var n = NODES[id];
      var outs = [];
      (n.choices || []).forEach(function (c) { if (c.next) outs.push(c.next); });
      if (n.next) outs.push(n.next);
      outs.forEach(function (t) { if (depth[t] == null) depth[t] = depth[id] + 1; if (!seen[t]) q.push(t); });
    }
    // include any orphan nodes too
    Object.keys(NODES).forEach(function (id) { if (!seen[id]) { order.push(id); depth[id] = 0; } });
    return { order: order, depth: depth };
  }

  function openMap() {
    var info = buildMapOrder();
    mapBody.innerHTML = "";
    info.order.forEach(function (id) {
      var n = NODES[id];
      var d = Math.min(info.depth[id] || 0, 2);
      var wrap = el("div", d ? "map-depth-" + d : "");
      var btn = el("button", "map-node");
      btn.type = "button";
      btn.innerHTML = '<div class="mn-title">' + escapeHtml(n.title || id) + '</div><div class="mn-id">' + escapeHtml(id) + "</div>";
      btn.addEventListener("click", function () { closeMap(); restartTo(id); });
      wrap.appendChild(btn);

      var edges = [];
      (n.choices || []).forEach(function (c) {
        if (c.next && NODES[c.next]) edges.push((NODES[c.next].title || c.next));
        else if (c.action) edges.push("(" + c.action + ")");
      });
      if (n.next && NODES[n.next]) edges.push((NODES[n.next].title || n.next) + " · auto");
      if (edges.length) {
        wrap.appendChild(el("div", "map-edges", '<span class="arrow">→</span> ' + edges.map(escapeHtml).join(' &nbsp;·&nbsp; ')));
      }
      mapBody.appendChild(wrap);
    });
    mapOverlay.classList.remove("hidden");
  }
  function closeMap() { mapOverlay.classList.add("hidden"); }

  /* ------------------------------------------------------------- controls */
  function clearChat() { chatEl.innerHTML = ""; trayEl.innerHTML = ""; }
  function restart() { playToken++; clearChat(); playNode(GRAPH.start); }
  function restartTo(id) { playToken++; clearChat(); playNode(id); }

  restartBtn.addEventListener("click", restart);
  mapBtn.addEventListener("click", openMap);
  mapClose.addEventListener("click", closeMap);
  mapOverlay.addEventListener("click", function (e) { if (e.target === mapOverlay) closeMap(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMap(); });
  // click the transcript while it's playing to fast-forward
  chatEl.addEventListener("click", function (e) {
    if (e.target.closest(".tool-head")) return; // let card toggles work
    skip = true;
  });

  /* ---------------------------------------------------------------- boot */
  checkGraph();
  var hash = (location.hash || "").replace(/^#/, "");
  playNode(NODES[hash] ? hash : GRAPH.start);
})();
