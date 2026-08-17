import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const url = (path) => new URL(path, import.meta.url);
const read = (path) => readFileSync(url(path), "utf8");

test("home hero states the proposition, method, and both CTAs", () => {
  const hero = read("../src/components/home/HomeHero.astro");
  const uiStrings = read("../src/data/ui-strings.ts");

  assert.match(hero, /home\.kicker/);
  assert.match(hero, /home\.headline/);
  assert.match(hero, /home\.deck/);
  assert.match(hero, /home\.methodStrip/);
  assert.match(hero, /home\.ctaPrimary/);
  assert.match(hero, /home\.ctaSecondary/);
  assert.match(hero, /KnowledgeCabinet/);
  // The headline proposition is the calm editorial one, not the old
  // "sole truth" campaign line.
  assert.match(uiStrings, /"home\.headline": "Start with what matters\.",/);
  assert.match(uiStrings, /"home\.headline": "从真正重要的问题开始。",/);
  assert.doesNotMatch(hero, /data-emergence-step|--scroll-progress|IntersectionObserver/);
});

test("the hero shows only real metadata — no invented numbers", () => {
  const page = read("../src/pages/index.astro");
  const hero = read("../src/components/home/HomeHero.astro");

  // releasedCount / latestReviewDate are derived from the real release
  // plan and Topic records upstream, never hardcoded in the hero.
  assert.match(page, /getReleasePlan\("en"\)/);
  assert.match(page, /releasedTopics\.length/);
  assert.match(page, /lastReviewed/);
  assert.doesNotMatch(hero, /\b\d+\s*(members|users|subscribers|sources)\b/i);
});

test("the knowledge cabinet renders five real drawers with real semantics", () => {
  const cabinet = read("../src/components/home/KnowledgeCabinet.astro");
  const libraries = read("../src/data/libraries.ts");

  assert.match(cabinet, /data-cabinet/);
  assert.match(cabinet, /data-drawer/);
  assert.match(cabinet, /getLibraries\(locale\)/);
  // 3D is pure CSS transforms + a few lines of pointer JS — no engine.
  assert.match(cabinet, /transform-style:\s*preserve-3d/);
  assert.match(cabinet, /perspective:\s*1500px/);
  assert.doesNotMatch(cabinet, /import .*three|new THREE|<canvas/);
  // Drawer entries come from the shared single source of truth.
  assert.match(libraries, /getLibraries/);
  assert.match(libraries, /externalLinks\.discordUrl/);
  assert.match(libraries, /externalLinks\.tiktokUrl/);
});

test("entries without a real URL render locked, never fake-linked", () => {
  const cabinet = read("../src/components/home/KnowledgeCabinet.astro");
  const sections = read("../src/components/home/HomeSections.astro");

  assert.match(cabinet, /drawer--locked/);
  assert.match(cabinet, /cabinet\.comingSoon/);
  assert.match(cabinet, /aria-disabled="true"/);
  assert.match(sections, /lib-entry__link--soon/);
  // href only renders when entry.href exists
  assert.match(cabinet, /entry\.href \?/);
});

test("the cabinet is keyboard-operable and respects reduced motion", () => {
  const cabinet = read("../src/components/home/KnowledgeCabinet.astro");

  // Drawers are real links → keyboard operable natively; focus styling
  // must be visible.
  assert.match(cabinet, /:focus-visible/);
  assert.match(cabinet, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(cabinet, /prefers-reduced-motion/); // pointer tilt gated in JS
  // Mobile fallback: no forced perspective, descriptions inline.
  assert.match(cabinet, /@media \(max-width: 47\.99rem\)/);
  assert.match(cabinet, /perspective:\s*none/);
});

test("the homepage sections follow the browsing path without fake stats", () => {
  const sections = read("../src/components/home/HomeSections.astro");

  assert.match(sections, /now\.kicker/); // currently investigating
  assert.match(sections, /lib\.kicker/); // five libraries
  assert.match(sections, /method\.kicker/); // method & trust
  assert.match(sections, /featured\.kicker/); // read next
  assert.match(sections, /community\.kicker/); // community
  // Trust points are checkable practices, not invented metrics.
  assert.match(sections, /method\.trust\.1/);
  assert.doesNotMatch(sections, /\b\d+[km]?\+?\s*(readers|members|views|followers)\b/i);
});

test("the currently-investigating section uses real Topic data", () => {
  const sections = read("../src/components/home/HomeSections.astro");
  const page = read("../src/pages/index.astro");

  assert.match(sections, /investigateTopic\.openingQuestion/);
  assert.match(sections, /investigateTopic\.lastReviewed/);
  assert.match(sections, /investigateHref/);
  // Topic still resolved from explicit config, never array position.
  assert.match(page, /getTopicById\(homeCoverTopicId, "en"\)/);
});

test("the featured section only links Topics the build actually emits", () => {
  const page = read("../src/pages/index.astro");
  const sections = read("../src/components/home/HomeSections.astro");

  assert.match(page, /releasedSlugs\.includes/);
  assert.match(sections, /releasedTopics\.length > 0/);
  assert.match(sections, /featured\.zhPending/); // honest zh fallback
});

test("library index routes exist for both libraries and both locales", () => {
  for (const path of [
    "../src/pages/transcripts/index.astro",
    "../src/pages/checklists/index.astro",
    "../src/pages/zh/transcripts/index.astro",
    "../src/pages/zh/checklists/index.astro",
  ]) {
    assert.equal(existsSync(url(path)), true, `${path} must exist`);
  }
  const transcripts = read("../src/pages/transcripts/index.astro");
  const checklists = read("../src/pages/zh/checklists/index.astro");
  assert.match(transcripts, /variant="transcripts"/);
  assert.match(transcripts, /robots=\{isPublicRelease \? "index,follow" : "noindex,nofollow"\}/);
  assert.match(checklists, /variant="checklists"/);
  // The transcripts page is honest about having no scripts yet.
  const libraryIndex = read("../src/components/library/LibraryIndex.astro");
  assert.match(libraryIndex, /ts\.empty/);
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
