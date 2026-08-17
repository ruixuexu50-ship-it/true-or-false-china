import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { topics } from "../src/data/topics.ts";

function matchingSlugs(query) {
  const normalizedQuery = query.trim().toLowerCase();

  return topics
    .filter((topic) =>
      [
        topic.openingQuestion,
        topic.deck,
        topic.category,
        ...(topic.searchTerms ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    )
    .map((topic) => topic.slug);
}

// Search behavior is asserted as inclusion, not as an exhaustive result
// list: adding a third Topic that also matches a term must not break these.

test("the promised payment search term finds the QR payment Topic", () => {
  assert.ok(matchingSlugs("payment").includes("qr-payment-stack"));
});

test("the promised meme search term finds the culture Topic", () => {
  assert.ok(matchingSlugs("meme").includes("chinamaxxing-inference"));
});

test("the promised evidence search term finds the evidence-led Topics", () => {
  const matches = matchingSlugs("evidence");
  assert.ok(matches.includes("qr-payment-stack"));
  assert.ok(matches.includes("chinamaxxing-inference"));
});

test("an unmatched search term still produces the no-results condition", () => {
  assert.deepEqual(matchingSlugs("definitely-not-a-topic"), []);
});

test("Explore renders each Topic's structured search terms into its search index", () => {
  const exploreSource = readFileSync(
    new URL("../src/components/ExploreView.astro", import.meta.url),
    "utf8",
  );

  assert.match(exploreSource, /topic\.searchTerms/);
});
