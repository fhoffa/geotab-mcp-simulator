#!/usr/bin/env node
/*
 * Stamps index.html's app.js/styles.css/data/conversations.js tags with a
 * ?v=<short-sha> of each file's own last commit, so GitHub Pages visitors
 * always get a fresh copy when one of them changes (browsers cache
 * unversioned <script src>/<link href> sub-resources well past index.html's
 * own cache lifetime). Run by .github/workflows/version-assets.yml on every
 * push to main that touches one of these files.
 */
"use strict";

const fs = require("fs");
const { execSync } = require("child_process");

const ASSETS = ["styles.css", "data/conversations.js", "app.js"];
const INDEX = "index.html";

let html = fs.readFileSync(INDEX, "utf8");

for (const asset of ASSETS) {
  const hash = execSync(`git log -1 --format=%h -- ${asset}`).toString().trim();
  const escaped = asset.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
  const re = new RegExp(`((?:href|src)=")${escaped}(?:\\?v=[0-9a-f]+)?(")`);
  if (!re.test(html)) throw new Error(`could not find a tag referencing ${asset} in ${INDEX}`);
  html = html.replace(re, `$1${asset}?v=${hash}$2`);
}

fs.writeFileSync(INDEX, html);
console.log("versioned: " + ASSETS.join(", "));
