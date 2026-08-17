export const RELEASE_STATES = [
  "draft",
  "locally-reviewed",
  "approved",
  "published",
] as const;

export type ReleaseState = (typeof RELEASE_STATES)[number];

export interface JudgmentNote {
  recommendation: string;
  importance: string;
  audienceSignal: string[];
  evidence: string[];
  counterSignal: string[];
  unknowns: string[];
  webPayoff: string;
  nextTest: string;
}

export interface CharacterMetadata {
  id: string;
  name: string;
  description: string;
  original: true;
  asset?: {
    src: string;
    alt: string;
    status?: "local-review" | "approved";
  };
}

export interface ExperiencePack {
  // Stable implementation identity for the experience registry. Decoupled
  // from the Topic slug so a slug can change without breaking the registry.
  implementationId: string;
  palette: {
    background: string;
    ink: string;
    accent: string;
    secondary?: string;
    highlight?: string;
    // Hero text color on top of `background`. Per-Topic presentation owned
    // by the data, so a light-background Topic never needs a slug-keyed CSS
    // override in TopicShell. Defaults to white when omitted.
    heroInk?: string;
  };
  character: CharacterMetadata;
  visualStates: Array<{
    id: string;
    label: string;
    image?: {
      src: string;
      alt: string;
    };
  }>;
  interaction: {
    id: string;
    type: string;
    changesUnderstanding: string;
  };
  motionLogic: string;
  // Substantive content rendered by the experience (e.g. the fictional
  // fixture's own words). This is part of "what this Topic says", so it
  // lives in the Topic data — never hardcoded inside a UI component.
  fixtureQuote?: string;
  image?: {
    src: string;
    alt: string;
    status?: "local-review" | "approved";
  };
  music?: {
    src: string;
    title: string;
  };
}

// A single, attributable content claim. The substance lives here (Topic Core),
// never duplicated inside a UI component. `sourceIds` must resolve to sources.
export interface ClaimRecord {
  id: string;
  claim: string;
  status: string;
  reveal: string;
  sourceIds: string[];
}

// A named interpretive lens. Also substantive truth owned by Topic Core.
export interface FramingRecord {
  id: string;
  title: string;
  body: string;
  boundary: string;
  sourceIds: string[];
}

export interface TopicPage {
  // Stable identity. Decoupled from slug/title/array position.
  topicId: string;
  slug: string;
  // The language variant of this Topic. The same `topicId` can appear in
  // multiple locales; only the localized prose differs.
  locale: "en" | "zh";
  releaseState: ReleaseState;
  // Localization status for machine-translated content. `DRAFT_TRANSLATION`
  // must not be treated as human-approved. Optional for the canonical source.
  translationState?: "DRAFT_TRANSLATION" | "APPROVED";
  openingQuestion: string;
  // Per-Topic localized UI copy (moved out of components, see PROTOTYPE-ASSUMPTIONS A5/A6).
  shareText: string;
  primaryActionLabel: string;
  deeperTitle: string;
  judgment: JudgmentNote;
  answerLayers: Array<{
    id: string;
    prompt: string;
    payoff: string;
  }>;
  explanation: string[];
  transcript?: Array<{
    speaker: string;
    text: string;
  }>;
  sources: Array<{
    id: string;
    title: string;
    url: string;
    role: string;
    publisher?: string;
    date?: string;
    caveat?: string;
  }>;
  relatedRabbitHoles: Array<{
    id: string;
    label: string;
    href: string;
    note?: string;
  }>;
  revisions: Array<{
    version: number;
    date: string;
    note: string;
  }>;
  claims?: ClaimRecord[];
  framings?: FramingRecord[];
  experience: ExperiencePack;
}

export type OptionalModule = "transcript" | "image" | "music";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }
}

function requireRecord(value: unknown, field: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new TypeError(`${field} must be an object`);
}

function requireNonEmptyArray(value: unknown, field: string): asserts value is unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new TypeError(`${field} must be a non-empty array`);
  }
}

function requireStringArray(value: unknown, field: string) {
  requireNonEmptyArray(value, field);
  value.forEach((item, index) => requireNonEmptyString(item, `${field}[${index}]`));
}

function requireWebUrl(value: unknown, field: string): asserts value is string {
  requireNonEmptyString(value, field);
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new TypeError(`${field} must be an http(s) URL`);
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new TypeError(`${field} must be an http(s) URL`);
  }
}

function requireSafeLink(value: unknown, field: string): asserts value is string {
  requireNonEmptyString(value, field);
  if (value.startsWith("/") && !value.startsWith("//")) return;
  requireWebUrl(value, field);
}

function validateMediaAsset(value: unknown, field: string) {
  requireRecord(value, field);
  requireSafeLink(value.src, `${field}.src`);
  requireNonEmptyString(value.alt, `${field}.alt`);
}

function requireUniqueIds(
  values: Array<Record<string, unknown>>,
  field: string,
) {
  const ids = new Set<string>();
  values.forEach((value, index) => {
    requireNonEmptyString(value.id, `${field}[${index}].id`);
    if (ids.has(value.id)) throw new TypeError(`${field} ids must be unique`);
    ids.add(value.id);
  });
}

export function validateTopicPage(value: unknown): TopicPage {
  if (!isRecord(value)) {
    throw new TypeError("TopicPage must be an object");
  }

  requireNonEmptyString(value.slug, "slug");
  requireNonEmptyString(value.topicId, "topicId");
  if (value.locale !== "en" && value.locale !== "zh") {
    throw new TypeError("locale must be 'en' or 'zh'");
  }
  requireNonEmptyString(value.openingQuestion, "openingQuestion");
  requireNonEmptyString(value.shareText, "shareText");
  requireNonEmptyString(value.primaryActionLabel, "primaryActionLabel");
  requireNonEmptyString(value.deeperTitle, "deeperTitle");

  if (!RELEASE_STATES.includes(value.releaseState as ReleaseState)) {
    throw new TypeError("releaseState must be a supported lifecycle state");
  }

  requireRecord(value.judgment, "judgment");
  for (const field of [
    "recommendation",
    "importance",
    "webPayoff",
    "nextTest",
  ] as const) {
    requireNonEmptyString(value.judgment[field], `judgment.${field}`);
  }
  for (const field of [
    "audienceSignal",
    "evidence",
    "counterSignal",
    "unknowns",
  ] as const) {
    requireStringArray(value.judgment[field], `judgment.${field}`);
  }

  requireNonEmptyArray(value.answerLayers, "answerLayers");
  const answerLayers = value.answerLayers as Array<Record<string, unknown>>;
  answerLayers.forEach((layer, index) => {
    requireRecord(layer, `answerLayers[${index}]`);
    requireNonEmptyString(layer.id, `answerLayers[${index}].id`);
    requireNonEmptyString(layer.prompt, `answerLayers[${index}].prompt`);
    requireNonEmptyString(layer.payoff, `answerLayers[${index}].payoff`);
  });
  requireUniqueIds(answerLayers, "answerLayers");

  requireStringArray(value.explanation, "explanation");

  if (value.transcript !== undefined) {
    requireNonEmptyArray(value.transcript, "transcript");
    value.transcript.forEach((line, index) => {
      requireRecord(line, `transcript[${index}]`);
      requireNonEmptyString(line.speaker, `transcript[${index}].speaker`);
      requireNonEmptyString(line.text, `transcript[${index}].text`);
    });
  }

  requireNonEmptyArray(value.sources, "sources");
  const sources = value.sources as Array<Record<string, unknown>>;
  sources.forEach((source, index) => {
    requireRecord(source, `sources[${index}]`);
    requireNonEmptyString(source.id, `sources[${index}].id`);
    requireNonEmptyString(source.title, `sources[${index}].title`);
    requireWebUrl(source.url, `sources[${index}].url`);
    requireNonEmptyString(source.role, `sources[${index}].role`);
  });
  requireUniqueIds(sources, "sources");

  const sourceIds = new Set(
    sources.map((source) => source.id as string),
  );

  for (const ref of value.judgment.evidence as string[]) {
    if (!sourceIds.has(ref)) {
      throw new TypeError(
        `judgment.evidence references unknown source id: ${ref}`,
      );
    }
  }

  if (value.claims !== undefined) {
    requireNonEmptyArray(value.claims, "claims");
    (value.claims as Array<Record<string, unknown>>).forEach((claim, index) => {
      requireRecord(claim, `claims[${index}]`);
      requireNonEmptyString(claim.id, `claims[${index}].id`);
      requireNonEmptyString(claim.claim, `claims[${index}].claim`);
      requireNonEmptyString(claim.status, `claims[${index}].status`);
      requireNonEmptyString(claim.reveal, `claims[${index}].reveal`);
      if (!Array.isArray(claim.sourceIds)) {
        throw new TypeError(`claims[${index}].sourceIds must be an array`);
      }
      for (const ref of claim.sourceIds as string[]) {
        if (!sourceIds.has(ref)) {
          throw new TypeError(
            `claims[${index}] references unknown source id: ${ref}`,
          );
        }
      }
    });
  }

  if (value.framings !== undefined) {
    requireNonEmptyArray(value.framings, "framings");
    (value.framings as Array<Record<string, unknown>>).forEach(
      (framing, index) => {
        requireRecord(framing, `framings[${index}]`);
        requireNonEmptyString(framing.id, `framings[${index}].id`);
        requireNonEmptyString(framing.title, `framings[${index}].title`);
        requireNonEmptyString(framing.body, `framings[${index}].body`);
        requireNonEmptyString(framing.boundary, `framings[${index}].boundary`);
        if (!Array.isArray(framing.sourceIds)) {
          throw new TypeError(`framings[${index}].sourceIds must be an array`);
        }
        for (const ref of framing.sourceIds as string[]) {
          if (!sourceIds.has(ref)) {
            throw new TypeError(
              `framings[${index}] references unknown source id: ${ref}`,
            );
          }
        }
      },
    );
  }

  requireNonEmptyArray(value.relatedRabbitHoles, "relatedRabbitHoles");
  const relatedLinks = value.relatedRabbitHoles as Array<Record<string, unknown>>;
  relatedLinks.forEach((link, index) => {
    requireRecord(link, `relatedRabbitHoles[${index}]`);
    requireNonEmptyString(link.id, `relatedRabbitHoles[${index}].id`);
    requireNonEmptyString(link.label, `relatedRabbitHoles[${index}].label`);
    requireSafeLink(link.href, `relatedRabbitHoles[${index}].href`);
  });
  requireUniqueIds(relatedLinks, "relatedRabbitHoles");

  requireNonEmptyArray(value.revisions, "revisions");
  value.revisions.forEach((revision, index) => {
    requireRecord(revision, `revisions[${index}]`);
    if (!Number.isInteger(revision.version) || Number(revision.version) < 1) {
      throw new TypeError(`revisions[${index}].version must be a positive integer`);
    }
    requireNonEmptyString(revision.date, `revisions[${index}].date`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(revision.date)) {
      throw new TypeError(`revisions[${index}].date must use YYYY-MM-DD`);
    }
    requireNonEmptyString(revision.note, `revisions[${index}].note`);
  });

  requireRecord(value.experience, "experience");
  requireNonEmptyString(
    value.experience.implementationId,
    "experience.implementationId",
  );
  requireRecord(value.experience.palette, "experience.palette");
  for (const field of ["background", "ink", "accent"] as const) {
    requireNonEmptyString(
      value.experience.palette[field],
      `experience.palette.${field}`,
    );
  }

  requireRecord(value.experience.character, "experience.character");
  for (const field of ["id", "name", "description"] as const) {
    requireNonEmptyString(
      value.experience.character[field],
      `experience.character.${field}`,
    );
  }
  if (value.experience.character.original !== true) {
    throw new TypeError("experience.character.original must be true");
  }
  if (value.experience.character.asset !== undefined) {
    validateMediaAsset(
      value.experience.character.asset,
      "experience.character.asset",
    );
  }

  const visualStates = value.experience.visualStates;
  if (!Array.isArray(visualStates) || visualStates.length < 2 || visualStates.length > 4) {
    throw new RangeError("ExperiencePack must contain 2–4 visual states");
  }
  visualStates.forEach((state, index) => {
    requireRecord(state, `experience.visualStates[${index}]`);
    requireNonEmptyString(state.id, `experience.visualStates[${index}].id`);
    requireNonEmptyString(state.label, `experience.visualStates[${index}].label`);
    if (state.image !== undefined) {
      validateMediaAsset(state.image, `experience.visualStates[${index}].image`);
    }
  });
  requireUniqueIds(visualStates, "experience.visualStates");

  requireRecord(value.experience.interaction, "experience.interaction");
  requireNonEmptyString(
    value.experience.interaction.id,
    "experience.interaction.id",
  );
  requireNonEmptyString(
    value.experience.interaction.type,
    "experience.interaction.type",
  );
  requireNonEmptyString(
    value.experience.interaction.changesUnderstanding,
    "experience.interaction.changesUnderstanding",
  );
  requireNonEmptyString(value.experience.motionLogic, "experience.motionLogic");

  if (value.experience.fixtureQuote !== undefined) {
    requireNonEmptyString(
      value.experience.fixtureQuote,
      "experience.fixtureQuote",
    );
  }

  if (value.experience.image !== undefined) {
    validateMediaAsset(value.experience.image, "experience.image");
  }
  if (value.experience.music !== undefined) {
    requireRecord(value.experience.music, "experience.music");
    requireSafeLink(value.experience.music.src, "experience.music.src");
    requireNonEmptyString(value.experience.music.title, "experience.music.title");
  }

  return value as unknown as TopicPage;
}

export function getOptionalModules(topic: TopicPage): OptionalModule[] {
  const modules: OptionalModule[] = [];
  if (topic.transcript?.length) modules.push("transcript");
  if (topic.experience.image?.src) modules.push("image");
  if (topic.experience.music?.src) modules.push("music");
  return modules;
}

export type ContentChange = Partial<
  Pick<
    TopicPage,
    | "openingQuestion"
    | "judgment"
    | "answerLayers"
    | "explanation"
    | "transcript"
    | "sources"
    | "relatedRabbitHoles"
    | "revisions"
  >
>;

export function markContentChanged(
  topic: TopicPage,
  change: ContentChange,
): TopicPage {
  return {
    ...topic,
    ...change,
    releaseState: "draft",
  };
}

export function applyPresentationChange(
  topic: TopicPage,
  change: Partial<ExperiencePack>,
): TopicPage {
  return {
    ...topic,
    experience: {
      ...topic.experience,
      ...change,
    },
  };
}

// Two Topics must never share a stable identity, even if their slugs differ.
export function assertUniqueTopicIds(topics: TopicPage[]): void {
  const ids = new Set<string>();
  for (const topic of topics) {
    if (ids.has(topic.topicId)) {
      throw new TypeError(`Duplicate topicId detected: ${topic.topicId}`);
    }
    ids.add(topic.topicId);
  }
}

// Two experience packs must never register under the same implementation id.
export function assertUniqueImplementationIds(packs: ExperiencePack[]): void {
  const ids = new Set<string>();
  for (const pack of packs) {
    if (ids.has(pack.implementationId)) {
      throw new TypeError(
        `Duplicate experience implementationId: ${pack.implementationId}`,
      );
    }
    ids.add(pack.implementationId);
  }
}
