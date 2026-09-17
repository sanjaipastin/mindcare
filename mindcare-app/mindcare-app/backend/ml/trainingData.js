// Hand-labeled training set for the emotion classifier.
// Each entry maps a short text sample to one of six emotion classes.
// Feel free to add more examples from your own journal entries later —
// more (varied) data is the easiest way to improve accuracy.

const trainingData = [
  // stressed
  { text: "I have three deadlines this week and no time to finish any of them", label: "stressed" },
  { text: "my workload is piling up and I feel like I can't keep up", label: "stressed" },
  { text: "so much pressure from exams and assignments due at the same time", label: "stressed" },
  { text: "I am overwhelmed with everything I need to submit", label: "stressed" },
  { text: "too many things to do and not enough hours in the day", label: "stressed" },
  { text: "the deadline is tomorrow and I have barely started", label: "stressed" },
  { text: "juggling college work and placement prep is exhausting me", label: "stressed" },
  { text: "I feel exhausted and overloaded with everything on my plate", label: "stressed" },
  { text: "I am behind on everything and it feels impossible", label: "stressed" },
  { text: "I have a lot to do and I feel pressured and rushed", label: "stressed" },
  { text: "I feel buried under assignments and lab records", label: "stressed" },
  { text: "everything feels urgent and I cannot prioritize anything", label: "stressed" },
  { text: "my to do list keeps growing and I feel pressured", label: "stressed" },
  { text: "I am stretched too thin between classes projects and exams", label: "stressed" },
  { text: "there is so much on my plate right now it is suffocating", label: "stressed" },

  // anxious
  { text: "I keep worrying about my exam results even though I studied", label: "anxious" },
  { text: "my heart is racing before the interview tomorrow", label: "anxious" },
  { text: "I can't stop thinking about what could go wrong", label: "anxious" },
  { text: "I feel nervous and on edge about the presentation", label: "anxious" },
  { text: "what if I fail the placement test, I keep overthinking it", label: "anxious" },
  { text: "I am scared I will mess up the viva tomorrow", label: "anxious" },
  { text: "a knot in my stomach thinking about the results", label: "anxious" },
  { text: "I feel uneasy and restless about the upcoming test", label: "anxious" },
  { text: "I am worried about my future and keep overthinking every possibility", label: "anxious" },
  { text: "my mind keeps racing and I cannot stop imagining the worst", label: "anxious" },
  { text: "I feel uneasy and on edge waiting for the result", label: "anxious" },
  { text: "my mind keeps racing with worst case scenarios", label: "anxious" },
  { text: "I am anxious about whether I prepared enough", label: "anxious" },
  { text: "waiting for the reply is making me nervous", label: "anxious" },

  // sad
  { text: "I feel down today and don't really know why", label: "sad" },
  { text: "I miss my friends from school and feel a bit lonely", label: "sad" },
  { text: "nothing seems to cheer me up right now", label: "sad" },
  { text: "I feel low energy and unmotivated today", label: "sad" },
  { text: "I am disappointed with how the exam went", label: "sad" },
  { text: "I feel empty and tired even after resting", label: "sad" },
  { text: "I feel low and disconnected from everything today", label: "sad" },
  { text: "I am tired and lonely and nothing feels interesting", label: "sad" },
  { text: "I feel heavy and gloomy but I cannot explain why", label: "sad" },
  { text: "today has just felt heavy and gloomy", label: "sad" },
  { text: "I feel like crying but I am not sure why", label: "sad" },
  { text: "I am upset that things did not work out as planned", label: "sad" },
  { text: "I feel a little hopeless about the semester", label: "sad" },

  // angry
  { text: "I am so frustrated that the group project fell apart", label: "angry" },
  { text: "it is unfair that my effort was not recognized", label: "angry" },
  { text: "I am furious about how that meeting went", label: "angry" },
  { text: "I can't believe they cancelled it at the last minute, so annoying", label: "angry" },
  { text: "I am irritated with how things are being handled", label: "angry" },
  { text: "this keeps happening and it makes me really mad", label: "angry" },
  { text: "I feel resentful about being blamed for something I didn't do", label: "angry" },
  { text: "I am annoyed that nobody replied all day", label: "angry" },
  { text: "it is infuriating when plans get ruined like this", label: "angry" },
  { text: "I am irritated and frustrated by how they ignored my message", label: "angry" },
  { text: "I feel angry and upset because this was unfair", label: "angry" },

  // happy
  { text: "I finally finished my project and I feel great", label: "happy" },
  { text: "today was a really good day, everything went smoothly", label: "happy" },
  { text: "I am excited about the placement offer I received", label: "happy" },
  { text: "spending time with friends made me really happy", label: "happy" },
  { text: "I feel proud of how the presentation turned out", label: "happy" },
  { text: "I am grateful for the support I got this week", label: "happy" },
  { text: "I aced the test and I feel amazing", label: "happy" },
  { text: "I am in a cheerful mood after the good news", label: "happy" },
  { text: "things are going really well for me lately", label: "happy" },
  { text: "I feel energetic and motivated today", label: "happy" },
  { text: "I feel hopeful and good about the path ahead", label: "happy" },
  { text: "I feel really positive and proud of my progress", label: "happy" },

  // calm
  { text: "I had a peaceful walk and feel relaxed now", label: "calm" },
  { text: "I meditated for ten minutes and feel centered", label: "calm" },
  { text: "everything feels balanced and under control today", label: "calm" },
  { text: "I feel at ease after finishing my tasks early", label: "calm" },
  { text: "a quiet evening with tea helped me unwind", label: "calm" },
  { text: "I feel settled and steady heading into tomorrow", label: "calm" },
  { text: "I took a break and now I feel refreshed", label: "calm" },
  { text: "things feel manageable and I am not worried", label: "calm" },
  { text: "I feel grounded after some deep breathing", label: "calm" },
  { text: "a calm and slow morning set a good tone for the day", label: "calm" },
  { text: "I am okay today and feeling steady", label: "calm" },
  { text: "I feel fine and relaxed after a slow evening", label: "calm" },
  { text: "things feel okay right now and I am at ease", label: "calm" },
];

module.exports = trainingData;
