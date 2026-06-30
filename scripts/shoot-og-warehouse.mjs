/*
 * shoot-og-warehouse.mjs — render scripts/og-warehouse-card.html to
 * assets/og-warehouse.png (1200x630) for warehouse.html's social card.
 * Local build step. Requires: playwright-core + Google Chrome.
 *   node scripts/shoot-og-warehouse.mjs
 */
import { chromium } from "playwright-core";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const card = pathToFileURL(join(__dirname, "og-warehouse-card.html")).href;
const out = join(__dirname, "..", "assets", "og-warehouse.png");

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(card, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("wrote", out);
