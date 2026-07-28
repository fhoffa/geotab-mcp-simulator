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

if (problems.length) {
  console.error("[check-graph] " + problems.length + " problem(s):\n" + problems.join("\n"));
  process.exit(1);
}

console.log("[check-graph] ok — " + Object.keys(NODES).length + " nodes, all links resolve, all reachable from '" + GRAPH.start + "'.");
