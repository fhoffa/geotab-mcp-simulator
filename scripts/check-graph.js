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
require(path.join(__dirname, "..", "data", "conversations.js"));

var GRAPH = global.window.CONVERSATIONS;
var NODES = GRAPH.nodes;
var problems = [];

Object.keys(NODES).forEach(function (id) {
  var n = NODES[id];
  (n.choices || []).forEach(function (c) {
    if (c.next && !NODES[c.next]) {
      problems.push(id + " → missing node '" + c.next + "' (via choice '" + (c.label || "") + "')");
    }
  });
  if (n.next && !NODES[n.next]) problems.push(id + " → missing node '" + n.next + "'");
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
