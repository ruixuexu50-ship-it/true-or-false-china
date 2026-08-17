import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("owner review data covers the page shells and every registered Topic", async () => {
  const { ownerReviews } = await import("../src/data/owner-review.ts");
  const { allTopics } = await import("../src/data/topics.ts");

  // Page shells always need review copy.
  for (const shellKey of ["home", "explore"]) {
    assert.ok(
      ownerReviews[shellKey],
      `owner review copy missing for page shell: ${shellKey}`,
    );
  }

  // Every Topic declares its own ownerReviewKey; that key must resolve to
  // real review copy. Adding a Topic without its review copy fails here
  // loudly instead of silently inheriting another Topic's words.
  const topicKeys = new Set(allTopics.map((topic) => topic.ownerReviewKey));
  for (const key of topicKeys) {
    assert.ok(
      ownerReviews[key],
      `owner review copy missing for ownerReviewKey: ${key}`,
    );
  }

  for (const review of Object.values(ownerReviews)) {
    assert.ok(review.titleZh.length >= 4);
    assert.ok(review.literalZh.length >= 10);
    assert.ok(review.intentZh.length >= 10);
    assert.ok(review.changeHintZh.length >= 10);
  }
});

test("owner review drawer is collapsed, Chinese, and explicitly private", () => {
  const source = read("../src/components/OwnerReviewDrawer.astro");

  assert.match(source, /<details class="owner-review"/);
  assert.doesNotMatch(source, /<details[^>]*open/);
  assert.match(source, /lang="zh-CN"/);
  assert.match(source, /仅本地可见/);
  assert.match(source, /不是访客文案/);
});

test("shared layout renders the owner drawer only behind the local-review gate", () => {
  const source = read("../src/layouts/SiteLayout.astro");

  assert.match(source, /ownerReviewKey\?: OwnerReviewKey/);
  assert.match(source, /showLocalReviewIndicator && ownerReviewKey/);
  assert.match(source, /<OwnerReviewDrawer reviewKey=\{ownerReviewKey\}/);
});

test("home, Explore, and every Topic page select the correct review copy", () => {
  const home = read("../src/pages/index.astro");
  const explore = read("../src/pages/explore/index.astro");
  const topicView = read("../src/components/TopicPageView.astro");

  assert.match(home, /ownerReviewKey="home"/);
  assert.match(explore, /ownerReviewKey="explore"/);
  assert.match(topicView, /ownerReviewKey=\{topic\.ownerReviewKey\}/);
});
