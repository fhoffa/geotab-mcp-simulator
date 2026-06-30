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
    if (c.action && c.action !== "restart" && c.action !== "map") {
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

if (problems.length) {
  console.error("[check-graph] " + problems.length + " problem(s):\n" + problems.join("\n"));
  process.exit(1);
}

console.log("[check-graph] ok — " + Object.keys(NODES).length + " nodes, all links resolve, all reachable from '" + GRAPH.start + "'.");
