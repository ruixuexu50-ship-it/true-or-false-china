import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("desktop home leads with the hero proposition and the knowledge cabinet", () => {
  const page = read("../src/pages/index.astro");
  const hero = read("../src/components/home/HomeHero.astro");
  const uiStrings = read("../src/data/ui-strings.ts");

  assert.match(page, /<HomeHero/);
  assert.match(page, /<HomeSections/);
  assert.doesNotMatch(page, /featured\.experience\.image|qr-route-working|Continue the question/);
  assert.match(hero, /@media \(min-width: 62rem\)/);
  assert.match(hero, /\.hero\s*\{[\s\S]*background:/);
  assert.match(hero, /\.hero__inner\s*\{[\s\S]*grid-template-columns:/);
  assert.match(hero, /KnowledgeCabinet/);
  assert.match(hero, /home\.headline/);
  assert.match(hero, /home\.ctaPrimary/);
  assert.match(uiStrings, /"home\.headline": "Start with what matters\.",/);
  assert.match(uiStrings, /"home\.methodStrip": "Question → Evidence → Mechanism → Boundary → Impact"/);
  assert.doesNotMatch(hero, /data-route-block/);
});

test("desktop Topic heroes share the stage while long reading sections remain bounded", () => {
  const source = read("../src/components/TopicShell.astro");

  assert.match(source, /@media \(min-width: 64rem\)/);
  assert.match(source, /\.topic-hero\s*\{[\s\S]*min-height: calc\(100vh -/);
  assert.match(source, /\.hero-copy h1\s*\{[\s\S]*font-size: clamp\(/);
  assert.match(source, /\.working-answer,[\s\S]*max-width:/);
  assert.doesNotMatch(source, /grid-template-columns: minmax\(34rem,[\s\S]*minmax\(24rem,/);
});

test("local feedback cannot fall back to a query-string submission without JavaScript", () => {
  const source = read("../src/components/FeedbackForm.astro");
  const uiStrings = read("../src/data/ui-strings.ts");

  assert.match(source, /<fieldset data-feedback-fields disabled>/);
  assert.match(source, /button type="button" data-check-question/);
  assert.doesNotMatch(source, /button type="submit"/);
  assert.match(source, /fields\.disabled = false/);
  // The honest no-JS message is localized; the component renders the string
  // key and the canonical English copy keeps the "nothing submitted" promise.
  assert.match(source, /<noscript>[\s\S]*feedback\.noscript/);
  assert.match(uiStrings, /Nothing can be submitted/);
});

test("claim toggles expose the panels they control", () => {
  const source = read("../src/components/experiences/ChinamaxxingExperience.astro");

  assert.match(source, /aria-controls=\{`claim-panel-\$\{item\.id\}`\}/);
  assert.match(source, /id=\{`claim-panel-\$\{item\.id\}`\}/);
});
