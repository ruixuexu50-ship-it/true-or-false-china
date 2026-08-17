import type { TopicPage } from "./contracts.ts";

export interface SiteIdentity {
  name: string;
  isPlaceholderName: boolean;
}

export interface ReleasePage {
  slug: string;
  robots: "noindex,nofollow" | "index,follow";
  showLocalReviewIndicator: boolean;
}

export interface ReleasePlan {
  mode: "local-review" | "public";
  pages: ReleasePage[];
  assets: string[];
}

function assertUniqueTopicPaths(topics: TopicPage[]) {
  const slugs = new Set<string>();
  const paths = new Set<string>();
  for (const topic of topics) {
    const slug = topic.slug;
    const path = `/topics/${slug}/`;
    if (slugs.has(slug) || paths.has(path)) {
      throw new Error("Release plans require unique Topic slugs and Astro paths");
    }
    slugs.add(slug);
    paths.add(path);
  }
}

function publicAssetsFor(topics: TopicPage[]): string[] {
  const assets = new Set<string>();
  for (const topic of topics) {
    if (topic.experience.character.asset?.src) {
      assets.add(topic.experience.character.asset.src);
    }
    if (topic.experience.image?.src) assets.add(topic.experience.image.src);
    if (topic.experience.music?.src) assets.add(topic.experience.music.src);
    for (const state of topic.experience.visualStates) {
      if (state.image?.src) assets.add(state.image.src);
    }
  }
  return [...assets];
}

export function createReleasePlan(
  site: SiteIdentity,
  topics: TopicPage[],
  options: { publicRelease: boolean },
): ReleasePlan {
  assertUniqueTopicPaths(topics);

  if (!options.publicRelease) {
    return {
      mode: "local-review",
      pages: topics.map((topic) => ({
        slug: topic.slug,
        robots: "noindex,nofollow",
        showLocalReviewIndicator: true,
      })),
      assets: publicAssetsFor(topics),
    };
  }

  if (site.isPlaceholderName || site.name.trim().length === 0) {
    throw new Error("Public release requires a non-placeholder public name");
  }

  const publicTopics = topics.filter(
    (topic) =>
      topic.releaseState === "approved" || topic.releaseState === "published",
  );

  return {
    mode: "public",
    pages: publicTopics.map((topic) => ({
      slug: topic.slug,
      robots: "index,follow",
      showLocalReviewIndicator: false,
    })),
    assets: publicAssetsFor(publicTopics),
  };
}
