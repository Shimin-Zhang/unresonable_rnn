// Reflection prompts for summative assessment

export interface ReflectionPrompt {
  id: string
  title: string
  prompt: string
  hints: string[]
  targetAudience: string
  estimatedTime: string
  rubric: {
    excellent: string
    good: string
    developing: string
  }
}

export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  {
    id: 'surprising-learnings',
    title: 'Surprising Learnings',
    prompt:
      'What was the most surprising thing you learned about RNNs in this course? How did it challenge or change your previous understanding of neural networks?',
    hints: [
      'Think about the "Turing completeness" discussion',
      'Consider the emergent behaviors from char-rnn experiments',
      'Reflect on the simplicity vs capability tradeoff',
    ],
    targetAudience: 'All learners',
    estimatedTime: '5-10 min',
    rubric: {
      excellent:
        'Identifies a specific, non-obvious insight and articulates how it shifted their mental model. Connects the learning to broader implications.',
      good: 'Mentions a surprising fact and explains why it was unexpected. Shows genuine reflection.',
      developing: 'States something learned but doesn\'t explain why it was surprising or impactful.',
    },
  },
  {
    id: 'vanishing-gradients',
    title: 'Explain Vanishing Gradients',
    prompt:
      'Explain the vanishing gradient problem to a colleague who knows basic calculus but has never studied deep learning. Include: what causes it, why it matters for RNNs specifically, and how LSTMs address it.',
    hints: [
      'Start with the chain rule and repeated multiplication',
      'Use a concrete example (e.g., gradients shrinking by 0.9 at each step)',
      'Explain why this is worse for RNNs than feedforward networks',
    ],
    targetAudience: 'Technical learners',
    estimatedTime: '10-15 min',
    rubric: {
      excellent:
        'Clear explanation accessible to the target audience. Includes the math intuition, practical consequences, and LSTM solution with gates.',
      good: 'Explains the core concept correctly. May lack depth in one area (cause, impact, or solution).',
      developing: 'Partial understanding shown. May have misconceptions or skip key aspects.',
    },
  },
  {
    id: 'applications',
    title: 'Real-World Applications',
    prompt:
      'Identify three potential sequence modeling applications in your work domain or industry. For each, specify: (1) the input sequence, (2) the output (many-to-one, many-to-many, etc.), and (3) the business value it could create.',
    hints: [
      'Think about time series, logs, user journeys, text data',
      'Consider both classification and generation tasks',
      'Estimate ROI or efficiency gains where possible',
    ],
    targetAudience: 'Business/Product learners',
    estimatedTime: '10-15 min',
    rubric: {
      excellent:
        'Three distinct, feasible applications with clear sequence types, architecture choices, and quantifiable business value.',
      good: 'Three applications identified with reasonable architecture choices. Business value mentioned but not quantified.',
      developing: 'Applications listed but sequence nature or business value unclear.',
    },
  },
  {
    id: 'attention-importance',
    title: 'Why Attention Matters',
    prompt:
      'Attention mechanisms were described as "the most important innovation" in sequence modeling. Why? What fundamental limitation of RNNs does attention solve, and how did this lead to the Transformer revolution?',
    hints: [
      'Consider the "bottleneck" problem in encoder-decoder models',
      'Think about long-range dependencies and information flow',
      'Connect to the "Attention Is All You Need" breakthrough',
    ],
    targetAudience: 'Technical learners',
    estimatedTime: '10-15 min',
    rubric: {
      excellent:
        'Explains the fixed-vector bottleneck, how attention provides direct access to all encoder states, and why this enabled parallelization leading to Transformers.',
      good: 'Understands attention solves long-range dependency issues. May not fully connect to Transformer architecture.',
      developing: 'Basic understanding that attention helps with longer sequences but lacks depth.',
    },
  },
  {
    id: 'rnn-vs-transformer',
    title: 'RNN vs Transformer Decision',
    prompt:
      'Your team needs to build a text generation system. The CTO asks: "Should we use an RNN or a Transformer?" Write a brief memo (3-5 paragraphs) that considers: compute resources, latency requirements, dataset size, and whether you need real-time streaming.',
    hints: [
      'RNNs: lower memory, good for streaming, but slower to train',
      'Transformers: better scaling, parallelizable, but O(n²) attention',
      'Consider the specific constraints mentioned',
    ],
    targetAudience: 'Technical/Management learners',
    estimatedTime: '15-20 min',
    rubric: {
      excellent:
        'Balanced memo that addresses all constraints, provides nuanced recommendation based on tradeoffs, and shows understanding of both architectures\' strengths.',
      good: 'Covers most considerations with a reasonable recommendation. May oversimplify some tradeoffs.',
      developing: 'Shows preference without adequately considering constraints or tradeoffs.',
    },
  },
  {
    id: 'modern-llms-connection',
    title: 'Connection to Modern LLMs',
    prompt:
      'GPT-4, Claude, and other modern LLMs are based on Transformers, not RNNs. Yet this course focused heavily on RNNs. Reflect on: (1) What foundational concepts from RNNs carry over to understanding Transformers? (2) Why is studying RNNs still valuable in 2024+?',
    hints: [
      'Consider: sequence modeling, hidden states, language modeling objective',
      'Think about: gradient flow, training dynamics, interpretability',
      'Reflect on: historical context, intuition building, edge cases',
    ],
    targetAudience: 'All learners',
    estimatedTime: '10-15 min',
    rubric: {
      excellent:
        'Articulates multiple transferable concepts (autoregressive modeling, embeddings, softmax, loss functions) and compelling reasons why RNN study aids Transformer understanding.',
      good: 'Identifies key transferable concepts. Gives reasonable justification for RNN study.',
      developing: 'Acknowledges connection but doesn\'t articulate specific transferable concepts.',
    },
  },
]

// Final challenge configuration
export interface FinalChallenge {
  id: string
  title: string
  description: string
  task: string
  submissionFormat: string
  votingCriteria: string[]
  badges: {
    participation: string
    winner: string
    creativity: string
  }
}

export const FINAL_CHALLENGE: FinalChallenge = {
  id: 'creative-generation',
  title: 'Creative Generation Challenge',
  description:
    'Train a char-rnn (or fine-tune a language model) on an unusual corpus and share your most interesting generated samples with the community.',
  task: `Choose a creative text corpus and train a character-level model on it. Ideas:
• Recipe books → AI-generated recipes
• Legal documents → Fake legal jargon
• Poetry in a specific style → New poems
• Code in an unusual language → Generated code
• Song lyrics from a specific genre → New songs

Share your best (and worst!) generated samples.`,
  submissionFormat:
    'Submit a short write-up including: (1) Your corpus choice and why, (2) Training details (model size, iterations), (3) 3-5 interesting samples with commentary, (4) What the model learned well and poorly.',
  votingCriteria: [
    'Creativity of corpus choice',
    'Quality of analysis',
    'Entertainment value of samples',
    'Insights about what the model learned',
  ],
  badges: {
    participation: 'challenger',
    winner: 'generation_champion',
    creativity: 'creative_corpus',
  },
}

// Quiz summary data structure
export interface ModuleQuizSummary {
  moduleId: number
  moduleTitle: string
  quizId: string
  questionCount: number
  topics: string[]
}

export const MODULE_QUIZ_SUMMARIES: ModuleQuizSummary[] = [
  {
    moduleId: 1,
    moduleTitle: 'Why Sequences Matter',
    quizId: 'module-1-sequences',
    questionCount: 5,
    topics: ['Fixed-size limitations', 'Architecture types', 'Convergence factors', 'Turing completeness'],
  },
  {
    moduleId: 2,
    moduleTitle: 'RNN Architecture',
    quizId: 'module-2-architecture',
    questionCount: 5,
    topics: ['Hidden state equation', 'Weight matrices', 'Softmax output', 'Parameter sharing'],
  },
  {
    moduleId: 3,
    moduleTitle: 'Vanishing Gradients & LSTMs',
    quizId: 'module-3-gradients',
    questionCount: 6,
    topics: ['Gradient multiplication', 'LSTM gates', 'Cell state', 'Forget gate'],
  },
  {
    moduleId: 4,
    moduleTitle: 'Character-Level Modeling',
    quizId: 'module-4-char-level',
    questionCount: 5,
    topics: ['One-hot encoding', 'Cross-entropy loss', 'Temperature sampling', 'Perplexity'],
  },
  {
    moduleId: 5,
    moduleTitle: 'Experiments',
    quizId: 'module-5-experiments',
    questionCount: 4,
    topics: ['char-rnn results', 'Training dynamics', 'Neuron visualization', 'Emergent behaviors'],
  },
  {
    moduleId: 6,
    moduleTitle: 'Beyond Text',
    quizId: 'module-6-beyond-text',
    questionCount: 5,
    topics: ['Image captioning', 'Encoder-decoder', 'Sequence-to-sequence', 'Multimodal'],
  },
  {
    moduleId: 7,
    moduleTitle: 'Attention Mechanisms',
    quizId: 'module-7-attention',
    questionCount: 6,
    topics: ['Soft attention', 'Query-key-value', 'Self-attention', 'Transformers'],
  },
]
