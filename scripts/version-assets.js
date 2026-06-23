#!/usr/bin/env node
/*
 * Stamps index.html's app/CSS/data/image references with ?v=<content-hash>,
 * so GitHub Pages visitors always fetch fresh sub-resources when files change.
 */
"use strict";

const fs = require("fs");
const { execSync } = require("child_process");

const ASSETS = [
  "styles.css",
  "data/sample-data.js",
  "data/conversations.js",
  "app.js",
  "assets/geotab-mark.png",
  "assets/og-image.png",
];
const INDEX = "index.html";
const SITE = "https://fhoffa.github.io/geotab-mcp-simulator/";

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
}
function versionFor(path) {
  return execSync(`git hash-object -- ${path}`).toString().trim().slice(0, 7);
}

let html = fs.readFileSync(INDEX, "utf8");
const site = escapeRe(SITE);
for (const asset of ASSETS) {
  const hash = versionFor(asset);
  const escaped = escapeRe(asset);
  const re = new RegExp(`((?:href|src|content)=\"(?:${site})?)${escaped}(?:\\?v=[0-9a-f]+)?(\")`, "g");
  re.lastIndex = 0;
  if (!re.test(html)) throw new Error(`could not find a tag referencing ${asset} in ${INDEX}`);
  re.lastIndex = 0;
  html = html.replace(re, `$1${asset}?v=${hash}$2`);
}

fs.writeFileSync(INDEX, html);
console.log("versioned: " + ASSETS.join(", "));
