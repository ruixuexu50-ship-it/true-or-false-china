import assert from "node:assert/strict";
import test from "node:test";

import { topics } from "../src/data/topics.ts";
import { validateTopicPage } from "../src/lib/contracts.ts";
import { createReleasePlan } from "../src/lib/release-guard.ts";

test("every Topic has a stable topicId, a unique slug, and passes contract validation", () => {
  const topicIds = new Set(topics.map((topic) => topic.topicId));
  assert.equal(topicIds.size, topics.length, "topicId values must be unique");

  const slugs = new Set(topics.map((topic) => topic.slug));
  assert.equal(slugs.size, topics.length, "slugs must be unique");

  for (const topic of topics) {
    assert.equal(validateTopicPage(topic), topic, "must satisfy the TopicPage contract");
    assert.ok(
      ["draft", "locally-reviewed", "approved", "published"].includes(
        topic.releaseState,
      ),
      "releaseState must be a supported lifecycle state",
    );
    assert.ok(topic.sources.length >= 1, "every Topic needs at least one source");
    assert.equal(topic.transcript, undefined);
    assert.equal(topic.experience.music, undefined);
    assert.match(topic.experience.image?.src ?? "", /^\/images\//);
  }
});

test("local review plan generates a noindex route for every Topic", () => {
  const plan = createReleasePlan(
    { name: "Working Answers", isPlaceholderName: true },
    topics,
    { publicRelease: false },
  );
  const expected = topics.map((topic) => `/topics/${topic.slug}/`).sort();
  assert.deepEqual(
    plan.pages.map((page) => `/topics/${page.slug}/`).sort(),
    expected,
  );
  assert.ok(
    plan.pages.every((page) => page.robots === "noindex,nofollow"),
    "local review pages must stay noindex",
  );
});

test("keeps the culture page blocked from public release in structured data", () => {
  const culture = topics.find(
    (topic) => topic.slug === "chinamaxxing-inference",
  );
  assert.ok(culture);
  assert.equal(culture.review?.fixtureId, "DEMO-01");
  assert.equal(culture.review?.fictional, true);
  assert.deepEqual(culture.review?.publicBlockers.map((item) => item.id), [
    "B01",
    "B02",
    "B03",
    "B04",
    "B05",
    "B06",
    "B07",
    "B08",
    "B09",
    "B10",
  ]);
});
