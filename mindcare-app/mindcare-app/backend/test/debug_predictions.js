const classifier = require('../ml/naiveBayesEmotion');

const samples = [
  'I feel overwhelmed and exhausted',
  'I am happy and excited',
  'I am worried about my future',
  'I feel calm and relaxed',
  'I am angry because they ignored me',
  'I am sad and lonely',
  'I feel okay today',
  'I have too much work',
  'I feel upset and frustrated',
  'I am at peace',
  'very stressed and anxious',
  'I feel good about my progress',
  'I am tired and low',
  'I have a lot on my plate',
  'I feel hopeful and good',
];

for (const sample of samples) {
  const result = classifier.predict(sample);
  console.log(`${sample} => ${result.label} (${result.confidence.toFixed(3)})`);
}
