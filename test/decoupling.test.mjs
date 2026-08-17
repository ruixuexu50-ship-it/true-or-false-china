import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

// These tests guard the decoupling rules, not the current content:
// a third Topic, a renamed slug, or a swapped experience must never require
// editing array positions, slug branches, or slug-keyed registries.

test("no source file derives Topic identity from array position", () => {
  const files = [
    "../src/pages/index.astro",
    "../src/pages/zh/index.astro",
    "../src/pages/lab/[slug].astro",
    "../src/components/home/HomeHero.astro",
    "../src/components/home/HomeSections.astro",
    "../src/components/home/QrHomeArchive.astro",
    "../src/components/TopicShell.astro",
    "../src/components/ExploreView.astro",
  ].map(read);

  for (const source of files) {
    assert.doesNotMatch(source, /topics\[0\]|topics\[1\]/);
    assert.doesNotMatch(source, /const \[(firstTopic|featured|second)(,\s*(secondTopic|second))?\] = topics/);
  }
});

test("no source file branches on a specific Topic slug for content or presentation", () => {
  const files = [
    "../src/components/TopicShell.astro",
    "../src/components/home/HomeSections.astro",
    "../src/components/TopicPageView.astro",
  ].map(read);

  for (const source of files) {
    assert.doesNotMatch(source, /\.topic--[a-z]/, "slug-keyed CSS branching");
    assert.doesNotMatch(
      source,
      /slug === ["']|slug\) === ["']/,
      "slug equality branching",
    );
  }
});

test("experience registry is keyed by implementationId, and every Topic resolves", async () => {
  // registry.ts imports .astro components, so it cannot be imported by Node
  // directly; its keys are read from source instead.
  const registrySource = read("../src/components/experiences/registry.ts");
  const registryKeys = [
    ...registrySource.matchAll(/^\s{2}"([a-z0-9-]+)":\s*[A-Z]/gm),
  ].map((match) => match[1]);
  assert.ok(registryKeys.length >= 1, "registry keys must be readable");

  const { allTopics } = await import("../src/data/topics.ts");
  for (const topic of allTopics) {
    assert.ok(
      registryKeys.includes(topic.experience.implementationId),
      `no experience registered for implementationId: ${topic.experience.implementationId}`,
    );
    assert.ok(
      !registryKeys.includes(topic.slug),
      `registry must not be keyed by slug: ${topic.slug}`,
    );
  }
});

test("experience scripts attach by implementationId, not by slug", () => {
  const experiences = [
    "../src/components/experiences/QrPaymentExperience.astro",
    "../src/components/experiences/ChinamaxxingExperience.astro",
  ].map(read);

  for (const source of experiences) {
    assert.match(source, /data-experience=\{topic\.experience\.implementationId\}/);
    assert.match(source, /\[data-experience-root\]\[data-experience='/);
    assert.doesNotMatch(source, /\[data-experience-root\]\[data-topic='/);
  }
});

test("Explore categories are derived from Topic data, not hardcoded options", () => {
  const source = read("../src/components/ExploreView.astro");

  assert.match(source, /new Set\(visibleTopics\.map\(\(topic\) => topic\.category\)\)/);
  assert.doesNotMatch(source, /<option value="everyday-systems">/);
  assert.doesNotMatch(source, /<option value="internet-culture">/);
});

test("homepage cover and lab archive resolve Topics from explicit config", () => {
  const home = read("../src/pages/index.astro");
  const lab = read("../src/pages/lab/[slug].astro");
  const siteConfig = read("../src/data/site.ts");

  assert.match(siteConfig, /homeCoverTopicId/);
  assert.match(siteConfig, /qrHomeArchiveExperiment/);
  assert.match(home, /getTopicById\(homeCoverTopicId, "en"\)/);
  assert.match(lab, /getTopicById\(qrHomeArchiveExperiment\.leadTopicId, "en"\)/);
});
