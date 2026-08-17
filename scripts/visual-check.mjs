// Visual self-check: screenshot the new homepage at desktop and
// mobile widths, both locales, plus the new library pages.
// Run: NODE_PATH=<managed workspace>/node_modules node scripts/visual-check.mjs
import puppeteer from "puppeteer-core";

import { fileURLToPath } from "node:url";
const BASE = "http://localhost:8080";
const OUT = fileURLToPath(new URL("./visual-check-output/", import.meta.url));

const shots = [
  { name: "en-home-1440", url: "/", width: 1440, height: 1000 },
  { name: "en-home-768", url: "/", width: 768, height: 1024 },
  { name: "en-home-390", url: "/", width: 390, height: 844 },
  { name: "zh-home-1440", url: "/zh/", width: 1440, height: 1000 },
  { name: "zh-home-768", url: "/zh/", width: 768, height: 1024 },
  { name: "zh-home-390", url: "/zh/", width: 390, height: 844 },
  { name: "en-transcripts-1440", url: "/transcripts/", width: 1440, height: 1000 },
  { name: "en-checklists-390", url: "/checklists/", width: 390, height: 844 },
  { name: "zh-checklists-1440", url: "/zh/checklists/", width: 1440, height: 1000 },
  { name: "en-topic-1440", url: "/topics/qr-payment-stack/", width: 1440, height: 1000 },
  { name: "en-topic-390", url: "/topics/qr-payment-stack/", width: 390, height: 844 },
];

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
});

import { mkdirSync } from "node:fs";
mkdirSync(OUT, { recursive: true });

const consoleErrors = [];
for (const shot of shots) {
  const page = await browser.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`${shot.name}: ${msg.text()}`);
  });
  page.on("pageerror", (err) => consoleErrors.push(`${shot.name}: ${err.message}`));
  await page.setViewport({ width: shot.width, height: shot.height });
  await page.goto(BASE + shot.url, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}${shot.name}.png`, fullPage: false });
  // Also a full-page capture for the homepage to check section rhythm.
  if (shot.url === "/" || shot.url === "/zh/") {
    await page.screenshot({ path: `${OUT}${shot.name}-full.png`, fullPage: true });
  }
  await page.close();
  console.log("shot", shot.name);
}
await browser.close();
console.log("console errors:", consoleErrors.length ? consoleErrors : "none");
