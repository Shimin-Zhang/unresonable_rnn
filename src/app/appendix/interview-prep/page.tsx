'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/components/ui'
import { Header, Footer } from '@/components/layout'

// =============================================================================
// DATA: Interview Questions and Model Answers
// =============================================================================

interface InterviewQuestion {
  id: string
  question: string
  followUp?: string
  difficulty: 'foundational' | 'intermediate' | 'advanced'
  timeEstimate: string
  modelAnswer: string
  keyPoints: string[]
  commonMistakes: string[]
  codeSnippet?: string
}

const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1-explain-rnn',
    question: 'Explain what a Recurrent Neural Network is and how it differs from a feedforward neural network.',
    followUp: 'Can you explain the role of the different weight matrices (W_hh, W_xh, W_hy)?',
    difficulty: 'foundational',
    timeEstimate: '3-5 min',
    modelAnswer: `A Recurrent Neural Network (RNN) is a type of neural network designed for sequential data. Unlike feedforward networks that process each input independently, RNNs maintain a hidden state that gets updated at each timestep, allowing them to capture temporal dependencies.

The key insight is the recurrence relation: h_t = tanh(W_hh * h_{t-1} + W_xh * x_t + b). At each step, the hidden state combines information from the previous hidden state and the current input.

Regarding the weight matrices:
- W_xh (input-to-hidden): Transforms the input at each timestep into the hidden space. It learns what features of the input are relevant.
- W_hh (hidden-to-hidden): The recurrence matrix that transforms the previous hidden state. This is what gives RNNs their "memory" - it learns how past information should influence the current state.
- W_hy (hidden-to-output): Transforms the hidden state into the output space for predictions.

The same weights are shared across all timesteps, which gives RNNs parameter efficiency and the ability to handle variable-length sequences.`,
    keyPoints: [
      'Hidden state maintains memory across timesteps',
      'Weight sharing across time enables variable-length sequences',
      'Three key matrices: input-to-hidden, hidden-to-hidden, hidden-to-output',
      'Recurrence relation is the core equation',
    ],
    commonMistakes: [
      'Confusing RNNs with CNNs (spatial vs temporal)',
      'Forgetting that weights are shared across timesteps',
      'Not mentioning the hidden state as the key differentiator',
    ],
  },
  {
    id: 'q2-vanishing-gradient',
    question: 'What is the vanishing gradient problem and how do LSTMs solve it?',
    difficulty: 'intermediate',
    timeEstimate: '4-6 min',
    modelAnswer: `The vanishing gradient problem occurs during backpropagation through time (BPTT) in RNNs. When computing gradients, we multiply the same weight matrix W_hh repeatedly - once for each timestep. If the largest eigenvalue of W_hh is less than 1, these repeated multiplications cause gradients to shrink exponentially, making it impossible to learn long-range dependencies.

Mathematically, the gradient at timestep t with respect to timestep k involves (W_hh)^{t-k}. For a 100-step sequence, even with eigenvalues of 0.9, gradients become negligible (0.9^100 ≈ 0).

LSTMs solve this through their cell state architecture with three key innovations:

1. Cell State (C_t): A separate memory pathway that runs through the entire sequence with minimal transformation. Information can flow unchanged through the cell state, avoiding repeated matrix multiplications.

2. Gating Mechanisms:
   - Forget gate (f_t): Decides what to remove from cell state
   - Input gate (i_t): Decides what new information to add
   - Output gate (o_t): Decides what to output from cell state

3. Additive Updates: The cell state update C_t = f_t * C_{t-1} + i_t * C̃_t is additive rather than multiplicative. This creates a "gradient highway" where gradients can flow back unchanged when the forget gate is open (f_t ≈ 1).

The gates are sigmoid-activated (0-1), giving the network fine-grained control over information flow.`,
    keyPoints: [
      'Repeated multiplication of W_hh causes exponential gradient decay',
      'Cell state provides gradient highway with additive updates',
      'Three gates control information flow',
      'Forget gate near 1 allows gradients to flow unchanged',
    ],
    commonMistakes: [
      'Only explaining the problem without the mathematical cause',
      'Not explaining WHY cell state helps (additive vs multiplicative)',
      'Forgetting to mention all three gates',
    ],
  },
  {
    id: 'q3-attention',
    question: 'What is attention in neural networks and why was it such an important innovation?',
    difficulty: 'intermediate',
    timeEstimate: '4-5 min',
    modelAnswer: `Attention is a mechanism that allows neural networks to dynamically focus on relevant parts of the input when producing each output. Instead of compressing an entire input sequence into a fixed-size vector, attention computes a weighted combination of all input representations.

The core idea: for each output position, compute relevance scores (attention weights) over all input positions, then take a weighted sum. This creates a "soft" lookup that is differentiable and trainable.

In the encoder-decoder context:
- Query (Q): What we are looking for (decoder state)
- Keys (K): What we are searching over (encoder states)
- Values (V): What we retrieve (also encoder states)
- Attention(Q, K, V) = softmax(QK^T / √d_k) * V

Why it was revolutionary:

1. Solved the bottleneck problem: Encoder-decoder models no longer had to compress everything into one fixed vector. The decoder can access any encoder state directly.

2. Enabled parallelization: Unlike RNNs which must process sequentially, attention can compute relationships between all positions simultaneously. This led directly to Transformers.

3. Interpretability: Attention weights show what the model is "looking at," providing insight into model behavior.

4. Length generalization: Models can handle longer sequences than seen in training because attention does not have fixed positional parameters.

Attention is the foundation of Transformers and thus all modern LLMs like GPT and BERT.`,
    keyPoints: [
      'Dynamic weighting over input positions',
      'Query-Key-Value formulation',
      'Solves fixed-size bottleneck problem',
      'Enables parallelization (key for Transformers)',
      'Foundation of modern LLMs',
    ],
    commonMistakes: [
      'Not explaining the Query-Key-Value framework',
      'Forgetting to mention parallelization benefit',
      'Not connecting to Transformers and modern LLMs',
    ],
  },
  {
    id: 'q4-rnn-vs-transformer',
    question: 'When would you choose an RNN over a Transformer, and vice versa?',
    difficulty: 'advanced',
    timeEstimate: '4-5 min',
    modelAnswer: `This is a nuanced decision that depends on several factors:

Choose Transformers when:
- You have sufficient compute and data (they scale better)
- Parallelization during training is important
- You need to capture long-range dependencies
- Working with large language models or need transfer learning
- Latency during training matters more than inference

Choose RNNs when:
- Streaming/real-time processing: RNNs naturally process one token at a time with O(1) memory per step. Transformers need to recompute attention over all previous tokens.
- Strict memory constraints: RNN hidden state is fixed-size regardless of sequence length. Transformer attention is O(n²) in memory.
- Very long sequences: For sequences of 10K+ tokens, Transformer attention becomes prohibitive without specialized architectures (sparse attention, etc.).
- Online learning: RNNs can update continuously as new data arrives.
- Edge deployment: Smaller RNNs can run on devices where Transformer inference is too expensive.

Practical examples:
- Real-time speech recognition on device → RNN/LSTM
- Document understanding with pre-training → Transformer
- IoT sensor anomaly detection → RNN
- Code generation → Transformer
- Low-latency trading signals → RNN

The industry has largely moved to Transformers, but RNNs remain relevant for edge cases involving streaming, memory constraints, or specialized hardware.`,
    keyPoints: [
      'Transformers: better scaling, parallelization, long-range deps',
      'RNNs: streaming, memory efficiency, online learning',
      'Consider: compute budget, sequence length, latency requirements',
      'Give concrete examples for each choice',
    ],
    commonMistakes: [
      'Saying "always use Transformers" without nuance',
      'Not mentioning the O(n²) attention complexity issue',
      'Forgetting streaming/real-time as RNN advantage',
    ],
  },
  {
    id: 'q5-implement-forward',
    question: 'Can you implement the forward pass of a simple RNN from scratch?',
    difficulty: 'advanced',
    timeEstimate: '5-8 min',
    modelAnswer: `Here is a minimal RNN forward pass implementation:`,
    keyPoints: [
      'Initialize hidden state to zeros',
      'Loop through timesteps, updating hidden state',
      'Apply tanh activation to hidden state',
      'Weight matrices: W_xh, W_hh, W_hy',
      'Return both outputs and final hidden state',
    ],
    commonMistakes: [
      'Forgetting to initialize hidden state',
      'Wrong matrix multiplication order',
      'Missing the tanh activation',
      'Not handling batched inputs',
    ],
    codeSnippet: `import numpy as np

class SimpleRNN:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights with small random values
        scale = 0.01
        self.W_xh = np.random.randn(input_size, hidden_size) * scale
        self.W_hh = np.random.randn(hidden_size, hidden_size) * scale
        self.W_hy = np.random.randn(hidden_size, output_size) * scale
        self.b_h = np.zeros((1, hidden_size))
        self.b_y = np.zeros((1, output_size))

    def forward(self, inputs, h_prev=None):
        """
        inputs: (seq_len, batch_size, input_size)
        h_prev: (batch_size, hidden_size) or None
        """
        seq_len, batch_size, _ = inputs.shape

        # Initialize hidden state if not provided
        if h_prev is None:
            h_prev = np.zeros((batch_size, self.W_hh.shape[0]))

        # Store hidden states and outputs
        hiddens = []
        outputs = []

        h_t = h_prev
        for t in range(seq_len):
            x_t = inputs[t]  # (batch_size, input_size)

            # Core RNN equation: h_t = tanh(x_t @ W_xh + h_{t-1} @ W_hh + b_h)
            h_t = np.tanh(x_t @ self.W_xh + h_t @ self.W_hh + self.b_h)

            # Output: y_t = h_t @ W_hy + b_y
            y_t = h_t @ self.W_hy + self.b_y

            hiddens.append(h_t)
            outputs.append(y_t)

        return np.stack(outputs), np.stack(hiddens), h_t

# Example usage:
rnn = SimpleRNN(input_size=10, hidden_size=32, output_size=5)
x = np.random.randn(20, 4, 10)  # seq_len=20, batch=4, features=10
outputs, hiddens, final_h = rnn.forward(x)
print(f"Output shape: {outputs.shape}")  # (20, 4, 5)`,
  },
  {
    id: 'q6-temperature',
    question: 'What is temperature in text generation and how does it affect output?',
    difficulty: 'foundational',
    timeEstimate: '2-3 min',
    modelAnswer: `Temperature is a hyperparameter that controls the randomness of predictions during text generation by scaling the logits before applying softmax.

The modified softmax with temperature T:
P(token_i) = exp(logit_i / T) / Σ exp(logit_j / T)

How temperature affects output:

- T = 1.0 (default): Standard softmax, model's learned distribution
- T → 0 (low, e.g., 0.2): Sharpens the distribution, making high-probability tokens even more likely. Output becomes more deterministic, repetitive, but "safer."
- T → ∞ (high, e.g., 2.0): Flattens the distribution toward uniform. Output becomes more random, creative, but potentially incoherent.

Practical guidance:
- Factual/code generation: T = 0.2-0.5 (need accuracy)
- Creative writing: T = 0.7-1.0 (balance creativity/coherence)
- Brainstorming: T = 1.0-1.5 (maximize diversity)

Temperature is applied at inference time only - it does not affect training. It is often combined with top-k or top-p (nucleus) sampling for better quality.`,
    keyPoints: [
      'Scales logits before softmax',
      'Low temperature = more deterministic',
      'High temperature = more random',
      'Applied at inference, not training',
      'Often combined with top-k/top-p sampling',
    ],
    commonMistakes: [
      'Confusing temperature with learning rate',
      'Not explaining the mathematical effect on distribution',
      'Forgetting to mention practical temperature ranges',
    ],
  },
]

// Portfolio Project Template
const PORTFOLIO_TEMPLATE = {
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      prompt: 'What problem were you trying to solve? Why did it matter?',
      example: 'I built a sentiment analysis system for customer support tickets to automatically prioritize urgent issues. The company was losing customers due to slow response times on critical complaints.',
    },
    {
      id: 'approach',
      title: 'Approach',
      prompt: 'What was your technical approach? Why did you choose it?',
      example: 'I used a bidirectional LSTM with attention because: (1) customer messages have sequential dependencies, (2) attention helps identify key complaint phrases, (3) we needed interpretability to explain prioritization decisions to the support team.',
    },
    {
      id: 'challenge',
      title: 'Challenge',
      prompt: 'What was the biggest technical challenge and how did you overcome it?',
      example: 'Class imbalance - only 3% of tickets were urgent. I addressed this with focal loss, strategic oversampling, and adjusted decision thresholds. This improved recall on urgent tickets from 45% to 82%.',
    },
    {
      id: 'results',
      title: 'Results',
      prompt: 'What were the quantitative outcomes?',
      example: 'Achieved 89% accuracy, 82% recall on urgent tickets. Reduced average response time to critical issues by 40%. System processed 10K tickets/day with <100ms latency.',
    },
    {
      id: 'learned',
      title: 'What I Learned',
      prompt: 'What would you do differently? What did you learn?',
      example: 'I learned that interpretability matters as much as accuracy for business adoption. In hindsight, I would have involved the support team earlier to understand their decision criteria. I also learned that simple baselines (like keyword matching) should always be your first benchmark.',
    },
  ],
}

// =============================================================================
// COMPONENTS
// =============================================================================

function DifficultyBadge({ difficulty }: { difficulty: InterviewQuestion['difficulty'] }) {
  const colorMap = {
    foundational: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
  }

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border ${colorMap[difficulty]}`}>
      {difficulty}
    </span>
  )
}

function QuestionCard({ question, isExpanded, onToggle }: {
  question: InterviewQuestion
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <Card className="mb-4">
      <CardHeader
        className="cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <DifficultyBadge difficulty={question.difficulty} />
              <span className="text-sm text-slate-500">{question.timeEstimate}</span>
            </div>
            <CardTitle as="h3" className="text-lg">{question.question}</CardTitle>
            {question.followUp && (
              <p className="text-sm text-slate-500 mt-1">
                Follow-up: {question.followUp}
              </p>
            )}
          </div>
          <div className="text-slate-400">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6 border-t border-slate-100 pt-4">
          {/* Model Answer */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Model Answer</h4>
            <div className="bg-slate-50 rounded-lg p-4 text-slate-700 whitespace-pre-line">
              {question.modelAnswer}
            </div>
          </div>

          {/* Code Snippet */}
          {question.codeSnippet && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Code Implementation</h4>
              <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono">
                  {question.codeSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* Key Points */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Key Points to Hit</h4>
            <ul className="space-y-1">
              {question.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <span className="text-emerald-500 mt-1">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Common Mistakes to Avoid</h4>
            <ul className="space-y-1">
              {question.commonMistakes.map((mistake, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-600">
                  <span className="text-red-400 mt-1">✗</span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

function PortfolioTemplateSection() {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">💼</span>
          <span className="text-sm font-medium text-purple-700">STAR Method Enhanced</span>
        </div>
        <CardTitle className="text-purple-900">Portfolio Project Talking Points</CardTitle>
        <CardDescription className="text-purple-700">
          Structure your project discussions with this 5-part framework
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {PORTFOLIO_TEMPLATE.sections.map((section, index) => (
          <div
            key={section.id}
            className="bg-white/70 rounded-lg p-4 border border-purple-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                {index + 1}
              </span>
              <h4 className="font-semibold text-slate-900">{section.title}</h4>
            </div>
            <p className="text-sm text-slate-600 mb-2">{section.prompt}</p>
            <div className="bg-purple-50 rounded p-3 text-sm text-purple-800 italic">
              Example: &quot;{section.example}&quot;
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-white/50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Pro Tips</h4>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• Keep each section to 2-3 sentences when speaking</li>
            <li>• Always have specific numbers ready (accuracy, latency, scale)</li>
            <li>• Practice transitioning smoothly between sections</li>
            <li>• Prepare to go deeper on any section if asked</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickReferenceSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Quick Reference: Key Formulas</CardTitle>
        <CardDescription>
          Essential equations to have memorized
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-4">
            <h4 className="font-medium text-slate-900 mb-2">RNN Hidden State</h4>
            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
              h_t = tanh(W_xh · x_t + W_hh · h_(t-1) + b)
            </code>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h4 className="font-medium text-slate-900 mb-2">LSTM Cell State</h4>
            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
              C_t = f_t ⊙ C_(t-1) + i_t ⊙ C̃_t
            </code>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h4 className="font-medium text-slate-900 mb-2">Attention</h4>
            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
              Attn(Q,K,V) = softmax(QK^T / √d_k) · V
            </code>
          </div>
          <div className="rounded-lg border border-slate-200 p-4">
            <h4 className="font-medium text-slate-900 mb-2">Temperature Sampling</h4>
            <code className="text-sm bg-slate-100 px-2 py-1 rounded">
              P(i) = exp(z_i/T) / Σ exp(z_j/T)
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function InterviewPrepPage() {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedQuestions(newExpanded)
  }

  const expandAll = () => {
    setExpandedQuestions(new Set(INTERVIEW_QUESTIONS.map(q => q.id)))
  }

  const collapseAll = () => {
    setExpandedQuestions(new Set())
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/paths" className="text-primary-600 hover:text-primary-700">
              ← Back to Learning Paths
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Appendix E: Interview Preparation Guide
          </h1>
          <p className="text-lg text-slate-600">
            Master the 6 most common RNN interview questions with model answers and code
          </p>
        </div>

        {/* Quick Tips */}
        <Card className="mb-8 border-emerald-200 bg-emerald-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-emerald-900">Interview Success Tips</h3>
                <ul className="text-sm text-emerald-800 mt-1 space-y-1">
                  <li>• Structure answers: Definition → How it works → Why it matters → Example</li>
                  <li>• Always offer to go deeper: &quot;Would you like me to explain the math behind that?&quot;</li>
                  <li>• Connect concepts to real applications and your own experience</li>
                  <li>• It&apos;s okay to say &quot;I don&apos;t know&quot; - then explain how you&apos;d find out</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Common Interview Questions</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={expandAll} className="text-sm">
                Expand All
              </Button>
              <Button variant="outline" onClick={collapseAll} className="text-sm">
                Collapse All
              </Button>
            </div>
          </div>

          {INTERVIEW_QUESTIONS.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isExpanded={expandedQuestions.has(question.id)}
              onToggle={() => toggleQuestion(question.id)}
            />
          ))}
        </section>

        {/* Quick Reference */}
        <section className="mb-12">
          <QuickReferenceSection />
        </section>

        {/* Portfolio Template */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Portfolio Project Framework</h2>
          <PortfolioTemplateSection />
        </section>

        {/* Study Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recommended Study Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Day Before</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Review all 6 questions</li>
                  <li>• Practice saying answers aloud</li>
                  <li>• Memorize key formulas</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 mb-2">Morning Of</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Quick review of key points</li>
                  <li>• Practice your project story</li>
                  <li>• Review the code implementation</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900 mb-2">In the Interview</h4>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Take a breath before answering</li>
                  <li>• Ask clarifying questions</li>
                  <li>• Think aloud when coding</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-8">
          <p className="text-slate-600 mb-4">Ready to test your knowledge?</p>
          <Link href="/assessment">
            <Button variant="primary">Take the Assessment Quiz</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
