import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("desktop home is a first-frame-loaded cover with a living evidence object", () => {
  const page = read("../src/pages/index.astro");
  const source = read("../src/components/home/QuestionSpaceHome.astro");
  const uiStrings = read("../src/data/ui-strings.ts");

  assert.match(page, /<QuestionSpaceHome coverTopic=\{coverTopic\}/);
  assert.doesNotMatch(page, /featured|qr-route-working|Continue the question/);
  assert.match(source, /@media \(min-width: 48rem\)/);
  assert.match(source, /\.question-space\s*\{[\s\S]*background:/);
  assert.match(source, /\.question-space__grid\s*\{[\s\S]*grid-template-columns:/);
  assert.match(source, /\.cover-stage\s*\{/);
  assert.match(source, /LivingEvidenceObject/);
  assert.match(source, /PlayableDesk/);
  assert.match(source, /home\.typeCaseLabel/);
  assert.match(uiStrings, /"home\.typeCaseLabel": "CURRENT TOPIC COVER"/);
  assert.match(uiStrings, /"desk\.read\.verb": "READ"/);
  assert.match(uiStrings, /"desk\.do\.verb": "DO"/);
  assert.match(uiStrings, /"desk\.watch\.verb": "WATCH"/);
  assert.doesNotMatch(source, /data-route-block/);
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
