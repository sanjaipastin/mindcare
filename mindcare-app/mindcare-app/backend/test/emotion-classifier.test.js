const test = require("node:test");
const assert = require("node:assert/strict");

const classifier = require("../ml/naiveBayesEmotion");

const cases = [
  ["I feel overwhelmed and exhausted", "stressed"],
  ["I am happy and excited", "happy"],
  ["I am worried about my future", "anxious"],
  ["I feel calm and relaxed", "calm"],
  ["I am angry because they ignored me", "angry"],
  ["I am sad and lonely", "sad"],
];

for (const [text, expected] of cases) {
  test(`classifies "${text}" as ${expected}`, () => {
    const result = classifier.predict(text);
    assert.equal(result.label, expected);
  });
}
