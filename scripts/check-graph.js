#!/usr/bin/env node
/*
 * check-graph.js — CI gate for data/conversations.js.
 *
 * Loads the graph the same way the browser does (data/conversations.js sets
 * `window.CONVERSATIONS`, no module exports) and fails the build — non-zero
 * exit code — on any broken `next`/`choices[].next` reference or any node
 * unreachable from `start`. app.js's own checkGraph() only console.errors,
 * so a broken link can otherwise ship silently.
 */
"use strict";

var path = require("path");

global.window = {};
// sample-data.js must load first (browser loads it before conversations.js):
// conversation charts/results ground on window.SAMPLE_DATA.
require(path.join(__dirname, "..", "data", "sample-data.js"));
require(path.join(__dirname, "..", "data", "conversations.js"));

var GRAPH = global.window.CONVERSATIONS;
var NODES = GRAPH.nodes;
var problems = [];
var VALID_EVENT_TYPES = {
  user: 1,
  assistant: true,
  system: true,
  endcard: true,
  tool: true,
  chart: true,
  warehouse: true,
  media: true,
  map: true,
  confirm: true,
};

Object.keys(NODES).forEach(function (id) {
  var n = NODES[id];
  (n.choices || []).forEach(function (c) {
    if (c.next && !NODES[c.next]) {
      problems.push(id + " → missing node '" + c.next + "' (via choice '" + (c.label || "") + "')");
    }
    // a choice must lead somewhere: a node link or a known action
    if (!c.next && !c.action) {
      problems.push(id + " → choice '" + (c.label || "") + "' has neither 'next' nor 'action'");
    }
    if (c.action && c.action !== "restart" && c.action !== "map" && c.action !== "video") {
      problems.push(id + " → choice '" + (c.label || "") + "' has unknown action '" + c.action + "'");
    }
  });
  if (n.next && !NODES[n.next]) problems.push(id + " → missing node '" + n.next + "'");

  // structural content assertions — catch authoring mistakes (a malformed event
  // renders as a blank/broken bubble in the browser with no other warning).
  (n.events || []).forEach(function (ev, i) {
    var where = id + " event[" + i + "] (" + (ev.type || "?") + ")";
    if (!ev.type) problems.push(where + " → missing 'type'");
    else if (!VALID_EVENT_TYPES[ev.type]) {
      problems.push(where + " → unknown event type '" + ev.type + "'");
    }
    if (ev.type === "tool" && (!ev.name || !ev.server)) {
      problems.push(where + " → tool event needs both 'name' and 'server'");
    }
    if (ev.type === "assistant" && !(ev.text && ev.text.trim())) {
      problems.push(where + " → assistant event needs non-empty 'text'");
    }
    if (ev.type === "endcard" && !(Array.isArray(ev.lines) && ev.lines.length)) {
      problems.push(where + " → endcard needs a non-empty 'lines' array");
    }
  });

  // a node must offer a way forward: choices, an auto-advance, or be intentionally terminal
  if ((!n.choices || !n.choices.length) && !n.next) {
    problems.push(id + " → dead end: no 'choices' and no 'next'");
  }
});

var seen = {};
var queue = [GRAPH.start];
while (queue.length) {
  var id = queue.shift();
  if (seen[id]) continue;
  seen[id] = true;
  var n = NODES[id];
  if (!n) continue;
  (n.choices || []).forEach(function (c) {
    if (c.next) queue.push(c.next);
  });
  if (n.next) queue.push(n.next);
}

Object.keys(NODES).forEach(function (id) {
  if (!seen[id]) problems.push(id + " → unreachable from start ('" + GRAPH.start + "')");
});

if (!NODES[GRAPH.start]) problems.push("start node '" + GRAPH.start + "' does not exist");

// docs/CONVERSATION-MAP.md is the GitHub-readable version of this graph, and it
// has rotted silently before (stuck at 60 nodes while the graph grew to 78).
// The node table is machine-derived, so the machine writes it: `--fix-map`
// regenerates it in place (CI runs this on every PR and commits the result;
// see .github/workflows/check-graph.yml), `--map-table` prints it to stdout,
// and the default run still fails on drift as the backstop for forks/local.
var fs = require("fs");
var MAP_DOC = path.join(__dirname, "..", "docs", "CONVERSATION-MAP.md");

function mapTable() {
  var lines = [
    "## Nodes (" + Object.keys(NODES).length + ")",
    "",
    "| id | title | database | leads to |",
    "|---|---|---|---|",
  ];
  Object.keys(NODES).forEach(function (id) {
    var n = NODES[id];
    var targets = [];
    if (n.next) targets.push("`" + n.next + "` (auto)");
    (n.choices || []).forEach(function (c) {
      if (c.next && targets.indexOf("`" + c.next + "`") < 0) targets.push("`" + c.next + "`");
      else if (c.action === "restart" && targets.indexOf("restart") < 0) targets.push("restart");
    });
    lines.push("| `" + id + "` | " + (n.title || "") + " | " + (n.db || "—") + " | " + (targets.join(", ") || "—") + " |");
  });
  return lines.join("\n");
}

if (process.argv.indexOf("--map-table") >= 0) {
  console.log(mapTable());
  process.exit(0);
}

if (process.argv.indexOf("--fix-map") >= 0) {
  var docNow = fs.readFileSync(MAP_DOC, "utf8");
  // the table block: the "## Nodes (N)" heading plus every consecutive |-row
  var tableBlock = /## Nodes \(\d+\)\n\n(\|[^\n]*\n)+/;
  if (!tableBlock.test(docNow)) {
    console.error("[check-graph] --fix-map: could not find the node table in " + MAP_DOC);
    process.exit(1);
  }
  var docFixed = docNow.replace(tableBlock, function () { return mapTable() + "\n"; });
  if (docFixed === docNow) {
    console.log("[check-graph] map table already current.");
  } else {
    fs.writeFileSync(MAP_DOC, docFixed);
    console.log("[check-graph] map table regenerated in " + MAP_DOC + ".");
  }
  process.exit(0);
}

var mapDoc = "";
try { mapDoc = fs.readFileSync(MAP_DOC, "utf8"); } catch (e) { /* doc optional */ }
if (mapDoc) {
  var countMatch = mapDoc.match(/## Nodes \((\d+)\)/);
  var nodeCount = Object.keys(NODES).length;
  if (countMatch && Number(countMatch[1]) !== nodeCount) {
    problems.push(
      "docs/CONVERSATION-MAP.md says " + countMatch[1] + " nodes but the graph has " + nodeCount +
      " — run: node scripts/check-graph.js --fix-map (CI does this automatically on PRs)"
    );
  }
  Object.keys(NODES).forEach(function (id) {
    if (mapDoc.indexOf("`" + id + "`") < 0) {
      problems.push(
        "docs/CONVERSATION-MAP.md is missing node `" + id +
        "` — run: node scripts/check-graph.js --fix-map (CI does this automatically on PRs)"
      );
    }
  });
}

// ------------------------------------------------------------- translations
// data/i18n/<lang>.js overlays swap display strings into the graph by position
// (see the locale block at the top of app.js). They rot silently: a reworded
// English node keeps showing yesterday's Spanish. So each overlay node carries
// "h", a hash of the English it translates; a mismatch fails here until the
// translation is updated and restamped with `--stamp-i18n`.
var I18N_DIR = path.join(__dirname, "..", "data", "i18n");
var LOCALES = ["es-419", "es-ES"]; // es-ES is a sparse layer over es-419
var BASE_LOCALE = "es-419"; // must translate every node and every UI key

// Per event type: the display fields an overlay may translate, and the subset
// the base locale must translate. Everything else (tool names, args, results,
// ids, styling) never changes with the language.
var EVENT_FIELDS = {
  assistant: { all: ["text"], req: ["text"] },
  user: { all: ["text"], req: ["text"] },
  system: { all: ["text"], req: ["text"] },
  endcard: { all: ["lines"], req: ["lines"] },
  tool: { all: ["summary"], req: ["summary"] },
  chart: { all: ["title", "bars"], req: ["title"] },
  map: { all: ["title", "summary", "layerLabel", "disclosure", "zone", "pins"], req: ["title", "summary"] },
  media: { all: ["caption", "fallbackText"], req: ["caption", "fallbackText"] },
  confirm: { all: ["changes"], req: ["changes"] },
  warehouse: { all: ["compactSubtitle", "note", "stages"], req: ["compactSubtitle", "note"] },
};
var CHOICE_FIELDS = ["group", "label", "say"];

// The English text a node's translation depends on, as one string.
function englishOf(n) {
  var parts = [];
  (n.events || []).forEach(function (ev, i) {
    var spec = EVENT_FIELDS[ev.type];
    if (!spec) return;
    spec.all.forEach(function (k) {
      var v = ev[k];
      if (v == null) return;
      if (k === "bars" || k === "pins") v = v.map(function (x) { return x.label; });
      else if (k === "zone") v = v.label;
      else if (k === "stages") v = v.map(function (st) {
        return [st.name].concat((st.tables || []).map(function (t) { return t.note || ""; }));
      });
      parts.push(i + "." + k + "=" + JSON.stringify(v));
    });
  });
  (n.choices || []).forEach(function (c, i) {
    CHOICE_FIELDS.forEach(function (k) { if (c[k] != null) parts.push("c" + i + "." + k + "=" + c[k]); });
  });
  return parts.join("\n");
}
// FNV-1a, 32-bit — stable and dependency-free; this is change detection, not security.
function fnv(s) {
  var h = 0x811c9dc5;
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return ("0000000" + h.toString(16)).slice(-8);
}

function localeFile(lang) { return path.join(I18N_DIR, lang + ".js"); }
global.window.SIM_I18N = {};
LOCALES.forEach(function (lang) {
  if (fs.existsSync(localeFile(lang))) require(localeFile(lang));
  else problems.push("data/i18n/" + lang + ".js is missing");
});
var I18N = global.window.SIM_I18N;

if (process.argv.indexOf("--stamp-i18n") >= 0) {
  LOCALES.forEach(function (lang) {
    var file = localeFile(lang);
    if (!fs.existsSync(file)) return;
    var src = fs.readFileSync(file, "utf8"), stamped = 0;
    Object.keys((I18N[lang] || {}).nodes || {}).forEach(function (id) {
      if (!NODES[id]) return;
      var head = new RegExp('(\\n  "' + id.replace(/[-]/g, "\\$&") + '": \\{\\n)(    h: "[0-9a-f]{8}",\\n)?');
      if (!head.test(src)) {
        console.error("[check-graph] --stamp-i18n: can't find node '" + id + "' in " + file + ' (expected `  "' + id + '": {` on its own line)');
        process.exit(1);
      }
      var next = src.replace(head, function (m, open) { return open + '    h: "' + fnv(englishOf(NODES[id])) + '",\n'; });
      if (next !== src) stamped++;
      src = next;
    });
    fs.writeFileSync(file, src);
    console.log("[check-graph] " + lang + ": " + stamped + " node hash(es) updated.");
  });
  process.exit(0);
}

LOCALES.forEach(function (lang) {
  var loc = I18N[lang];
  if (!loc) return problems.push("data/i18n/" + lang + ".js didn't register window.SIM_I18N['" + lang + "']");
  var isBase = lang === BASE_LOCALE;
  var nodes = loc.nodes || {};
  if (isBase) {
    Object.keys(NODES).forEach(function (id) {
      if (!nodes[id]) problems.push(lang + ": node '" + id + "' is untranslated");
    });
  }
  Object.keys(nodes).forEach(function (id) {
    var t = nodes[id], n = NODES[id], where = lang + " " + id;
    if (!n) return problems.push(where + " → no such node in data/conversations.js (orphan translation)");
    if (t.h !== fnv(englishOf(n))) {
      problems.push(where + " → " + (t.h ? "stale: the English changed since this was translated" : "missing 'h'") +
        " — update the translation, then run: node scripts/check-graph.js --stamp-i18n");
    }
    var evs = t.events || [], chs = t.choices || [];
    if (evs.length > (n.events || []).length) problems.push(where + " → " + evs.length + " events, English has " + (n.events || []).length);
    if (chs.length > (n.choices || []).length) problems.push(where + " → " + chs.length + " choices, English has " + (n.choices || []).length);
    (n.events || []).forEach(function (ev, i) {
      var spec = EVENT_FIELDS[ev.type], o = evs[i], at = where + " event[" + i + "] (" + ev.type + ")";
      if (o && !spec) return problems.push(at + " → this event type has no translatable fields");
      if (!spec) return;
      // An explicit null tool slot means "nothing to translate" — summaries
      // that are pure values ("50", a VIN, a model name).
      if (isBase && !(o === null && ev.type === "tool")) {
        spec.req.forEach(function (k) {
          if (ev[k] != null && (!o || o[k] == null)) problems.push(at + " → '" + k + "' is untranslated");
        });
      }
      if (!o) return;
      Object.keys(o).forEach(function (k) {
        var v = o[k], en = ev[k];
        if (spec.all.indexOf(k) < 0) return problems.push(at + " → '" + k + "' is not a translatable field");
        if (v == null) return;
        if (en == null) return problems.push(at + " → translates '" + k + "' but the English event has none");
        if (Array.isArray(en) && k !== "stages") {
          if (!Array.isArray(v) || v.length !== en.length) problems.push(at + " → '" + k + "' needs " + en.length + " entries");
        } else if (k === "stages") {
          if (!Array.isArray(v) || v.length > en.length) return problems.push(at + " → 'stages' has more entries than the English");
          v.forEach(function (st, j) {
            if (st && st.notes && st.notes.length > (en[j].tables || []).length) {
              problems.push(at + " → stages[" + j + "].notes has more entries than that stage's tables");
            }
          });
        } else if (typeof v !== "string") {
          problems.push(at + " → '" + k + "' should be a string");
        }
      });
      // Inline code (tool names, SQL, ids) and link targets are never translated.
      spec.all.forEach(function (k) {
        if (typeof ev[k] !== "string" || typeof o[k] !== "string") return;
        (ev[k].match(/`[^`]+`|\]\([^)]+\)/g) || []).forEach(function (frag) {
          if (o[k].indexOf(frag) < 0) problems.push(at + " → '" + k + "' lost " + frag);
        });
      });
    });
    (n.choices || []).forEach(function (c, i) {
      var o = chs[i], at = where + " choice[" + i + "]";
      if (isBase) {
        CHOICE_FIELDS.forEach(function (k) {
          if (c[k] != null && (!o || o[k] == null)) problems.push(at + " → '" + k + "' is untranslated");
        });
      }
      if (!o) return;
      Object.keys(o).forEach(function (k) {
        if (CHOICE_FIELDS.indexOf(k) < 0) problems.push(at + " → '" + k + "' is not a translatable field");
        else if (c[k] == null && o[k] != null) problems.push(at + " → translates '" + k + "' but the English choice has none");
      });
    });
  });
});

// UI strings: every key the page or app.js asks for must exist in the base
// locale, and every key a locale defines must still be asked for somewhere.
var ROOT = path.join(__dirname, "..");
var appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
var htmlSrc = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
var uiUsed = {};
var m, reTr = /\btr\(([^;]*)/g, reKey = /data-i18n="([\w.]+)"/g, reAttr = /data-i18n-attr="([^"]+)"/g;
// tr("a.b") or tr(cond ? "a.b" : "a.c")
while ((m = reTr.exec(appSrc))) {
  (m[1].match(/"[a-z]+\.[\w.]+"/g) || []).forEach(function (q) { uiUsed[q.slice(1, -1)] = "app.js"; });
}
while ((m = reKey.exec(htmlSrc))) uiUsed[m[1]] = "index.html";
while ((m = reAttr.exec(htmlSrc))) {
  m[1].split(";").forEach(function (pair) { uiUsed[(pair.split(":")[1] || "").trim()] = "index.html"; });
}
var uiEnMatch = appSrc.match(/var UI_EN = (\{[\s\S]*?\n {2}\});/);
var UI_EN = uiEnMatch ? Function("return " + uiEnMatch[1])() : {};
if (!uiEnMatch) problems.push("app.js: couldn't find the UI_EN table");
Object.keys(uiUsed).forEach(function (k) {
  if (uiUsed[k] === "app.js" && UI_EN[k] == null) problems.push("app.js: tr(\"" + k + "\") has no English in UI_EN");
});
LOCALES.forEach(function (lang) {
  var ui = (I18N[lang] || {}).ui || {};
  if (lang === BASE_LOCALE) {
    Object.keys(uiUsed).forEach(function (k) {
      if (ui[k] == null) problems.push(lang + ": UI string '" + k + "' (" + uiUsed[k] + ") is untranslated");
    });
  }
  Object.keys(ui).forEach(function (k) {
    if (!uiUsed[k]) problems.push(lang + ": UI string '" + k + "' isn't used by app.js or index.html");
  });
});

if (problems.length) {
  console.error("[check-graph] " + problems.length + " problem(s):\n" + problems.join("\n"));
  process.exit(1);
}

console.log("[check-graph] ok — " + Object.keys(NODES).length + " nodes, all links resolve, all reachable from '" + GRAPH.start + "'.");
