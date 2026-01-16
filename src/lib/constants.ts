export const APP_NAME = 'The Unreasonable Effectiveness of RNNs'
export const APP_DESCRIPTION =
  "An interactive learning experience for understanding Recurrent Neural Networks based on Andrej Karpathy's influential blog post."

export const MODULES = [
  {
    id: 0,
    title: 'Executive Context',
    subtitle: 'Why This Matters in 2024+',
    description: 'Historical context, connections to modern LLMs, and stakeholder communication.',
    duration: '15 min',
    tags: ['executive', 'narrative'],
  },
  {
    id: 1,
    title: 'Why Sequences Matter',
    subtitle: 'The Limitations of Vanilla Neural Networks',
    description: 'Variable-length sequences, 5 architecture types, and Turing completeness.',
    duration: '20 min',
    tags: ['fundamentals', 'sequences'],
  },
  {
    id: 2,
    title: 'RNN Architecture',
    subtitle: 'Building Memory into Networks',
    description: 'Core equations, hidden state updates, and the "optimization over programs" insight.',
    duration: '30 min',
    tags: ['architecture', 'math'],
  },
  {
    id: 3,
    title: 'Vanishing Gradients & LSTMs',
    subtitle: 'The Problem and Its Solution',
    description: 'Gradient multiplication, LSTM cell state, forget/input/output gates.',
    duration: '35 min',
    tags: ['gradients', 'lstm', 'math'],
  },
  {
    id: 4,
    title: 'Character-Level Modeling',
    subtitle: 'Next-Character Prediction',
    description: 'One-hot encoding, cross-entropy loss, temperature sampling.',
    duration: '30 min',
    tags: ['char-rnn', 'training'],
  },
  {
    id: 5,
    title: 'Experiments',
    subtitle: 'What Can RNNs Learn?',
    description: 'Shakespeare, Wikipedia, LaTeX, Linux kernel - and neuron visualization.',
    duration: '25 min',
    tags: ['experiments', 'visualization'],
  },
  {
    id: 6,
    title: 'Beyond Text',
    subtitle: 'Vision, Speech, and Translation',
    description: 'CNN+RNN for captioning, encoder-decoder, and multimodal applications.',
    duration: '25 min',
    tags: ['multimodal', 'translation'],
  },
  {
    id: 7,
    title: 'Attention Mechanisms',
    subtitle: 'The Most Important Innovation',
    description: 'Soft vs hard attention, Neural Turing Machines, bridge to Transformers.',
    duration: '35 min',
    tags: ['attention', 'transformers'],
  },
  {
    id: 8,
    title: 'Limitations & Path Forward',
    subtitle: 'When to Use (and Not Use) RNNs',
    description: 'RNN limitations, Transformer revolution, and build vs buy decisions.',
    duration: '20 min',
    tags: ['limitations', 'decision-making'],
  },
  {
    id: 9,
    title: 'Implementation Deep Dive',
    subtitle: 'From NumPy to PyTorch to Hugging Face',
    description: 'Three implementation tracks with progressive complexity.',
    duration: '45 min',
    tags: ['code', 'implementation'],
  },
  {
    id: 10,
    title: 'Capstone Project',
    subtitle: 'Train Your Own Model',
    description: 'Three difficulty levels with gamified milestones and achievements.',
    duration: '2-4 hours',
    tags: ['capstone', 'project'],
  },
] as const

export const LEARNING_PATHS = {
  conceptual: {
    id: 'conceptual',
    name: 'Conceptual',
    description: 'For Managers, PMs, and Executives',
    modules: [0, 1, 3, 5, 7, 8],
    duration: '2.5 hours',
  },
  practitioner: {
    id: 'practitioner',
    name: 'Full Practitioner',
    description: 'For ML Engineers - all modules in order',
    modules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    duration: '6-8 hours',
  },
  quickWins: {
    id: 'quickWins',
    name: 'Quick Wins',
    description: 'For time-constrained professionals',
    modules: [0, 1, 2, 4, 8],
    duration: '2 hours',
  },
  interviewPrep: {
    id: 'interviewPrep',
    name: 'Interview Prep',
    description: 'For job seekers - focus on key topics',
    modules: [0, 2, 3, 7, 8],
    duration: '2.5 hours',
  },
} as const

export type LearningPathId = keyof typeof LEARNING_PATHS
