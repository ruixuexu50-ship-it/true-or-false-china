import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const url = (path) => new URL(path, import.meta.url);
const read = (path) => readFileSync(url(path), "utf8");

test("home first frame shows the main question, setup, entries, and the living evidence object", () => {
  const componentPath = url("../src/components/home/QuestionSpaceHome.astro");
  assert.equal(existsSync(componentPath), true, "QuestionSpaceHome must exist");

  const page = read("../src/pages/index.astro");
  const component = read("../src/components/home/QuestionSpaceHome.astro");
  const uiStrings = read("../src/data/ui-strings.ts");

  assert.match(page, /import QuestionSpaceHome/);
  assert.match(page, /<QuestionSpaceHome coverTopic=\{coverTopic\}/);
  assert.match(component, /home\.titleLine1/);
  assert.match(component, /home\.titleLine2/);
  assert.match(component, /home\.deck/);
  assert.match(component, /home\.openTopic/);
  assert.match(component, /home\.route\.exploreAll/);
  assert.match(component, /home\.block\.question\.label/);
  assert.match(component, /\/ 01/);
  assert.match(component, /LivingEvidenceObject/);
  assert.match(component, /home\.typeCaseLabel/);
  assert.match(uiStrings, /"home\.typeCaseLabel": "CURRENT TOPIC COVER"/);
  assert.match(uiStrings, /"home\.typeCaseLabel": "当前主题封面"/);
});

test("home uses real current topic content for the cover without inventing facts", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");

  assert.match(component, /coverTopic\.category/);
  assert.match(component, /coverTopic\.openingQuestion/);
  assert.match(component, /coverTopic\.deck/);
  assert.doesNotMatch(component, /qr-route-working|foreign card|traveler-card/i);
});

test("home does not scroll-gate substantive content", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");

  assert.doesNotMatch(component, /data-emergence-step/);
  assert.doesNotMatch(component, /--scroll-progress/);
  assert.doesNotMatch(component, /case-intake|question-intake|rail-response/);
  assert.doesNotMatch(component, /IntersectionObserver/);
  assert.doesNotMatch(component, /data-brand-object/);
  assert.doesNotMatch(component, /data-route-block/);
  assert.doesNotMatch(component, /Knowledge Type Case|知识活字箱/i);
  assert.doesNotMatch(component, /Scroll to assemble|向下滚动，拼出/i);
});

test("the living evidence object invites play without blocking content", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");
  const leo = read("../src/components/experiences/LivingEvidenceObject.astro");

  assert.match(component, /LivingEvidenceObject/);
  assert.match(leo, /data-leo-object/);
  assert.match(leo, /cursor:\s*grab/);
  assert.match(leo, /tabindex="0"/);
  assert.match(leo, /aria-label/);
  assert.match(leo, /prefers-reduced-motion/);
  assert.doesNotMatch(leo, /WebGL|three\.js|<canvas/i);
});

test("the cover exposes at most one natural hotspot with real topic detail", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");
  const leo = read("../src/components/experiences/LivingEvidenceObject.astro");

  assert.match(leo, /data-leo-hotspot/);
  assert.match(component, /coverTopic\.deck/);
  assert.match(component, /hotspots:\s*\[/);
  const hotspotCount = (component.match(/data-leo-hotspot/g) ?? []).length;
  assert.ok(hotspotCount >= 0 && hotspotCount <= 1, `expected 0–1 hotspots in homepage config, got ${hotspotCount}`);
});

test("home supports reduced motion while keeping content intact", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");

  assert.match(component, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(component, /animation-(?:iteration-count):\s*infinite|\binfinite\b/);
});

test("mobile keeps the object as a bounded, non-dominating block", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");
  const leo = read("../src/components/experiences/LivingEvidenceObject.astro");

  assert.match(component, /@media \(max-width:/);
  assert.match(component, /\.cover-stage\s*\{[\s\S]*max-width:/);
  assert.match(leo, /touch-action:\s*pan-y/);
  assert.match(leo, /@media \(max-width: 38rem\)/);
});

test("home links resolve through the locale-aware prefix", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");

  assert.match(component, /hrefPrefix/);
  assert.match(component, /\$\{hrefPrefix\}\/topics\/\$\{coverTopic\.slug\}\//);
  assert.match(component, /\$\{hrefPrefix\}\/explore\//);
});

test("the playable desk renders three real-semantic objects with distinct verbs", () => {
  const component = read("../src/components/home/QuestionSpaceHome.astro");
  const desk = read("../src/components/home/PlayableDesk.astro");

  assert.match(component, /<PlayableDesk locale=\{locale\} readUrl=\{exploreUrl\} \/>/);
  assert.match(desk, /data-desk-object="news"/);
  assert.match(desk, /data-desk-object="env"/);
  assert.match(desk, /data-desk-object="clap"/);
  // distinct verbs, one shared world
  assert.match(desk, /desk\.read\.verb/);
  assert.match(desk, /desk\.do\.verb/);
  assert.match(desk, /desk\.watch\.verb/);
  assert.match(desk, /is-unfold/);
  assert.match(desk, /is-open/);
  assert.match(desk, /is-clapped/);
  assert.match(desk, /--obj-shadow/);
  assert.match(desk, /--obj-ink/);
});

test("the playable desk keeps text semantics and honest prototype states", () => {
  const desk = read("../src/components/home/PlayableDesk.astro");

  // every object carries text semantics nearby
  assert.match(desk, /desk\.read\.subtitle/);
  assert.match(desk, /desk\.do\.subtitle/);
  assert.match(desk, /desk\.watch\.subtitle/);
  // READ links to the real collection; DO/WATCH are honest prototypes
  assert.match(desk, /href=\{readUrl\}/);
  assert.match(desk, /desk\.do\.inProgress/);
  assert.match(desk, /desk\.watch\.inProgress/);
});

test("the playable desk is enhancement, not a navigation dependency", () => {
  const desk = read("../src/components/home/PlayableDesk.astro");

  // no scroll-gating / observers / WebGL
  assert.doesNotMatch(desk, /data-emergence-step|--scroll-progress|IntersectionObserver/);
  // no actual 3D engine usage (the header comment mentioning "WebGL" is prose, not code)
  assert.doesNotMatch(desk, /import .*three|new THREE|<canvas/);
  // attention budget: idle life only on the newspaper
  assert.match(desk, /desk-object--news\.is-idle/);
  assert.match(desk, /@media \(prefers-reduced-motion: reduce\)/);
  // reduced motion disables idle + keeps nav
  assert.match(desk, /animation:\s*none/);
});

test("the accepted QR homepage survives only as a local noindex archive", () => {
  const componentPath = url("../src/components/home/QrHomeArchive.astro");
  const fixedRoutePath = url("../src/pages/lab/qr-home-v1.astro");
  const routePath = url("../src/pages/lab/[slug].astro");
  assert.equal(existsSync(componentPath), true, "QrHomeArchive must exist");
  assert.equal(existsSync(fixedRoutePath), false, "the archive cannot be an unconditional route");
  assert.equal(existsSync(routePath), true, "the gated QR archive route must exist");

  const component = read("../src/components/home/QrHomeArchive.astro");
  const route = read("../src/pages/lab/[slug].astro");

  assert.match(route, /import \{ isPublicRelease \}/);
  assert.match(route, /export function getStaticPaths/);
  assert.match(route, /if \(isPublicRelease\) return \[\]/);
  // The archive slug is explicit experiment config, not a magic literal in
  // the route file.
  assert.match(route, /params: \{ slug: qrHomeArchiveExperiment\.slug \}/);
  const siteConfig = read("../src/data/site.ts");
  assert.match(siteConfig, /slug: "qr-home-v1"/);
  assert.match(route, /robots="noindex,nofollow"/);
  assert.match(route, /showLocalReviewIndicator=\{true\}/);
  assert.match(route, /ownerReviewKey="qr"/);
  assert.match(route, /<QrHomeArchive featured=\{lead\} second=\{second\}/);
  assert.match(component, /featured\.openingQuestion/);
  assert.match(component, /featured\.experience\.image/);
  assert.match(component, /Continue the question/);
  assert.match(component, /data-tiktok-handoff/);
  assert.match(component, /second\.openingQuestion/);
});
