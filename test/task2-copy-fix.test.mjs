import assert from "node:assert/strict";
import test from "node:test";

import { buildScopedInference } from "../src/lib/inference-test.ts";

// The sentence builder takes the same option IDs the UI selects emit, and
// joins the corresponding fragments as natural English.

const observations = [
  {
    id: "three-cues-joke",
    fragment: "three everyday cues are grouped under one joke",
  },
  {
    id: "objects-by-identity-joke",
    fragment: "the three objects appear beside one identity joke",
  },
];

const authorIntents = [
  {
    id: "affectionate-intent",
    sentence: "The fictional author note describes affectionate intent.",
  },
  {
    id: "read-quickly",
    sentence: "The fictional author note says the cues were chosen to read quickly.",
  },
];

for (const observation of observations) {
  for (const authorIntent of authorIntents) {
    test(`scoped inference joins “${observation.fragment}” and “${authorIntent.id}” as natural English`, () => {
      const outcome = buildScopedInference({
        observation: observation.id,
        authorIntent: authorIntent.id,
        framing: "projection",
        unknown: "audience-reception",
      });

      assert.equal(
        outcome.sentence,
        `In this fictional example, I can observe that ${observation.fragment}. ${authorIntent.sentence} A projection lens helps interpret that selection, while audience reception remains unknown.`,
      );
    });
  }
}
