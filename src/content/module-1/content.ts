import type { ExplanationItem } from '@/components/ui/ExplanationCards'

export const MODULE_1_EXPLANATIONS: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Dinner Party',
    content: 'Most AI can only handle fixed-size inputs—like a photo that\'s always 224x224 pixels. But real-world data is messy: sentences have different lengths, customer journeys have different numbers of touchpoints. Sequence models handle this by reading data one piece at a time, like you\'d read a book page by page.',
    highlights: ['fixed-size inputs', 'messy', 'Sequence models', 'one piece at a time'],
  },
  {
    audience: 'business',
    label: 'For Managers',
    content: 'Sequence architectures enable us to apply AI to variable-length data streams—customer interactions, log events, transaction histories—where traditional approaches require awkward workarounds like padding or truncation that lose information.',
    highlights: ['variable-length data streams', 'padding or truncation', 'lose information'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content: 'Traditional fully-connected neural networks require fixed-dimensional input vectors (e.g., 784 for MNIST). Processing variable-length sequences requires RNNs that maintain a hidden state h_t = f(W_hh * h_{t-1} + W_xh * x_t), where the recurrence allows arbitrary sequence lengths while sharing parameters across time steps.',
    highlights: ['fixed-dimensional input vectors', 'hidden state', 'recurrence', 'sharing parameters'],
  },
  {
    audience: 'interview',
    label: 'Interview Answer',
    content: 'RNNs address the fundamental limitation that standard feed-forward networks have fixed input and output dimensions. By maintaining a hidden state that persists across time steps, RNNs can process sequences of arbitrary length. This enables five architecture patterns: one-to-one, one-to-many, many-to-one, many-to-many synced, and many-to-many encoder-decoder, covering applications from sentiment analysis to machine translation.',
    highlights: ['hidden state', 'arbitrary length', 'five architecture patterns'],
  },
]

export const SEQUENCE_ARCHITECTURES = [
  {
    id: 'one-to-one',
    name: 'One-to-One',
    input: 'Fixed',
    output: 'Fixed',
    example: 'Image Classification',
    description: 'Standard neural network: single input produces single output.',
    useCase: 'Classifying images, simple regression tasks',
    icon: '1:1',
  },
  {
    id: 'one-to-many',
    name: 'One-to-Many',
    input: 'Fixed',
    output: 'Sequence',
    example: 'Image Captioning',
    description: 'Single input generates a sequence of outputs.',
    useCase: 'Generating descriptions from images, music generation from a seed',
    icon: '1:N',
  },
  {
    id: 'many-to-one',
    name: 'Many-to-One',
    input: 'Sequence',
    output: 'Fixed',
    example: 'Sentiment Analysis',
    description: 'Reads entire sequence, produces single output.',
    useCase: 'Text classification, fraud detection from transaction history',
    icon: 'N:1',
  },
  {
    id: 'many-to-many-synced',
    name: 'Many-to-Many (Synced)',
    input: 'Sequence',
    output: 'Sequence',
    example: 'Video Frame Labeling',
    description: 'Output at each step, input and output lengths match.',
    useCase: 'POS tagging, real-time video annotation',
    icon: 'N:N',
  },
  {
    id: 'many-to-many-encoder-decoder',
    name: 'Many-to-Many (Encoder-Decoder)',
    input: 'Sequence',
    output: 'Sequence',
    example: 'Machine Translation',
    description: 'First encodes entire input, then decodes to output. Lengths can differ.',
    useCase: 'Translation, text summarization, question answering',
    icon: 'N→N',
  },
]

export const BUSINESS_APPLICATIONS = [
  {
    industry: 'Finance',
    problem: 'Classify transaction sequence as fraudulent',
    architecture: 'Many-to-One',
    impact: 'Reduce fraud losses by catching patterns across transaction history',
  },
  {
    industry: 'Healthcare',
    problem: 'Predict disease progression from patient timeline',
    architecture: 'Many-to-Many',
    impact: 'Enable early intervention, reduce readmissions',
  },
  {
    industry: 'E-commerce',
    problem: 'Generate product description from attributes',
    architecture: 'One-to-Many',
    impact: 'Scale content creation, improve SEO',
  },
  {
    industry: 'Customer Success',
    problem: 'Score churn risk from interaction history',
    architecture: 'Many-to-One',
    impact: 'Proactive retention, reduced CAC',
  },
  {
    industry: 'DevOps',
    problem: 'Translate error logs to remediation steps',
    architecture: 'Many-to-Many (seq2seq)',
    impact: 'Faster incident response, reduced MTTR',
  },
]

export const TIMELINE_EVENTS = [
  {
    year: 1980,
    title: 'RNNs Invented',
    description: 'Recurrent neural networks conceptualized, but limited by computational constraints.',
    type: 'origin' as const,
  },
  {
    year: 1997,
    title: 'LSTM Introduced',
    description: 'Hochreiter & Schmidhuber publish Long Short-Term Memory, solving vanishing gradients.',
    type: 'breakthrough' as const,
  },
  {
    year: 2012,
    title: 'AlexNet',
    description: 'Deep learning proves viable at scale with ImageNet victory.',
    type: 'milestone' as const,
  },
  {
    year: 2013,
    title: 'Word2Vec',
    description: 'Neural embeddings show they can capture semantic meaning.',
    type: 'milestone' as const,
  },
  {
    year: 2014,
    title: 'Seq2Seq',
    description: 'Sutskever et al. demonstrate sequence-to-sequence learning for machine translation.',
    type: 'breakthrough' as const,
  },
  {
    year: 2015,
    title: 'Karpathy\'s char-rnn',
    description: 'Democratizes RNN experimentation, shows remarkable emergent capabilities.',
    type: 'breakthrough' as const,
  },
]

export const KEY_TAKEAWAYS = [
  'Standard neural networks can\'t handle variable-length sequences without workarounds',
  'RNNs solve this by processing sequentially with persistent memory (hidden state)',
  'Five architecture types cover most real-world sequence problems',
  'Your business data likely contains sequence problems you haven\'t recognized yet',
]
