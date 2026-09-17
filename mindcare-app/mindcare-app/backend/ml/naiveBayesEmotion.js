// A small, dependency-free Multinomial Naive Bayes text classifier.
// This is the same algorithm you've likely implemented in your ML lab
// (e.g. spam/ham classification) applied here to short journal/mood text,
// classifying it into one of six emotion categories.
//
// P(class | words) is proportional to P(class) * PRODUCT( P(word | class) )
// We work in log-space to avoid floating point underflow, and use
// Laplace (add-one) smoothing so unseen words don't zero out a class.

const trainingData = require("./trainingData");

const STOPWORDS = new Set([
  "i", "a", "an", "the", "is", "am", "are", "was", "were", "be", "been",
  "to", "of", "in", "on", "for", "and", "but", "or", "it", "this", "that",
  "my", "me", "so", "with", "at", "as", "not", "do", "did", "does",
]);

const KEYWORD_BOOST = {
  stressed: [
    "overwhelmed", "exhausted", "deadline", "pressure", "workload", "too", "many",
    "buried", "stretched", "urgent", "overloaded", "time", "assignment", "submit",
    "behind", "stress", "tired", "plate"
  ],
  anxious: [
    "worried", "nervous", "anxious", "panic", "racing", "restless", "fear",
    "whatif", "overthinking", "future", "interview", "results", "scared", "knot",
    "uneasy", "uncertain", "afraid", "waiting"
  ],
  sad: [
    "sad", "lonely", "down", "low", "empty", "cry", "hopeless", "disappointed",
    "heavy", "gloomy", "unmotivated", "tired", "miss", "alone"
  ],
  angry: [
    "angry", "frustrated", "furious", "annoyed", "irritated", "mad", "resentful",
    "infuriating", "unfair", "blamed", "cancelled", "ruined"
  ],
  happy: [
    "happy", "excited", "great", "good", "proud", "amazing", "cheerful",
    "motivated", "hopeful", "positive", "grateful", "smile", "celebrate"
  ],
  calm: [
    "calm", "relaxed", "peaceful", "steady", "balanced", "centered", "grounded",
    "easy", "settled", "rested", "fine", "okay", "comfortable", "atpeace"
  ],
};

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s']/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

class NaiveBayesEmotionClassifier {
  constructor() {
    this.classes = [];
    this.classDocCounts = {}; // number of training docs per class
    this.classWordCounts = {}; // total word count per class
    this.wordCountsByClass = {}; // { class: { word: count } }
    this.vocabulary = new Set();
    this.totalDocs = 0;
    this.trained = false;
  }

  train(data) {
    for (const { text, label } of data) {
      if (!this.classes.includes(label)) {
        this.classes.push(label);
        this.classDocCounts[label] = 0;
        this.classWordCounts[label] = 0;
        this.wordCountsByClass[label] = {};
      }
      this.classDocCounts[label] += 1;
      this.totalDocs += 1;

      const tokens = tokenize(text);
      for (const token of tokens) {
        this.vocabulary.add(token);
        this.classWordCounts[label] += 1;
        this.wordCountsByClass[label][token] =
          (this.wordCountsByClass[label][token] || 0) + 1;
      }
    }
    this.trained = true;
  }

  // Returns { label, confidence, scores: [{label, probability}] }
  predict(text) {
    if (!this.trained) throw new Error("Classifier has not been trained yet");

    const tokens = tokenize(text);
    const vocabSize = this.vocabulary.size;
    const logScores = {};
    const keywordWeights = {};

    for (const cls of this.classes) {
      keywordWeights[cls] = 0;
      for (const token of tokens) {
        if (KEYWORD_BOOST[cls].includes(token)) {
          keywordWeights[cls] += 1.2;
        }
      }
    }

    for (const cls of this.classes) {
      // log P(class)
      let logProb = Math.log(this.classDocCounts[cls] / this.totalDocs);

      for (const token of tokens) {
        const wordCountInClass = this.wordCountsByClass[cls][token] || 0;
        // Laplace smoothing: add 1 to numerator, add vocabSize to denominator
        const wordProb =
          (wordCountInClass + 1) / (this.classWordCounts[cls] + vocabSize);
        logProb += Math.log(wordProb);
      }

      logProb += keywordWeights[cls];
      logScores[cls] = logProb;
    }

    // Convert log-scores to a normalized probability distribution
    // (softmax over the log scores) for interpretability.
    const maxLog = Math.max(...Object.values(logScores));
    const expScores = {};
    let sumExp = 0;
    for (const cls of this.classes) {
      expScores[cls] = Math.exp(logScores[cls] - maxLog);
      sumExp += expScores[cls];
    }

    const scores = this.classes
      .map((cls) => ({ label: cls, probability: expScores[cls] / sumExp }))
      .sort((a, b) => b.probability - a.probability);

    // Safety net for vague or short inputs: boost labels that match obvious keywords.
    if (tokens.length > 0 && scores[0].probability < 0.35) {
      const keywordWinner = Object.entries(keywordWeights).sort((a, b) => b[1] - a[1])[0];
      if (keywordWinner && keywordWinner[1] > 0) {
        const winningLabel = keywordWinner[0];
        const winner = scores.find((s) => s.label === winningLabel);
        if (winner) {
          return {
            label: winner.label,
            confidence: Math.max(winner.probability, 0.4),
            scores: scores.map((s) => ({
              ...s,
              probability: s.label === winner.label ? Math.max(s.probability, 0.4) : s.probability,
            })),
          };
        }
      }
    }

    return {
      label: scores[0].label,
      confidence: scores[0].probability,
      scores,
    };
  }
}

// Train once at server startup and export a ready-to-use singleton.
const classifier = new NaiveBayesEmotionClassifier();
classifier.train(trainingData);

module.exports = classifier;
