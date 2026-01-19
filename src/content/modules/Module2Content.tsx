'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'

// Symbol definitions for the hidden state update equation
const hiddenStateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#2563eb}{h_t}',
    color: 'blue',
    meaning: 'Hidden state at time t',
    details: 'The "memory" of the network at the current timestep',
  },
  {
    symbol: '\\color{#2563eb}{h_{t-1}}',
    color: 'blue',
    meaning: 'Previous hidden state',
    details: 'Memory from the previous timestep',
  },
  {
    symbol: '\\color{#dc2626}{x_t}',
    color: 'red',
    meaning: 'Input at time t',
    details: 'The current input vector (e.g., a character embedding)',
  },
  {
    symbol: '\\color{#16a34a}{W_{hh}}',
    color: 'green',
    meaning: 'Hidden-to-hidden weight matrix',
    details: 'Learned parameters that transform the previous hidden state',
  },
  {
    symbol: '\\color{#ea580c}{W_{xh}}',
    color: 'orange',
    meaning: 'Input-to-hidden weight matrix',
    details: 'Learned parameters that transform the input',
  },
  {
    symbol: '\\color{#9333ea}{b_h}',
    color: 'purple',
    meaning: 'Hidden bias term',
    details: 'Learned offset added to the computation',
  },
]

// Symbol definitions for the output equation
const outputSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#db2777}{y_t}',
    color: 'magenta',
    meaning: 'Raw output at time t',
    details: 'Unnormalized scores (logits) for each possible output',
  },
  {
    symbol: '\\color{#0891b2}{W_{hy}}',
    color: 'cyan',
    meaning: 'Hidden-to-output weight matrix',
    details: 'Learned parameters that transform hidden state to output',
  },
  {
    symbol: '\\color{#2563eb}{h_t}',
    color: 'blue',
    meaning: 'Current hidden state',
    details: 'The memory representation at this timestep',
  },
  {
    symbol: '\\color{#9333ea}{b_y}',
    color: 'purple',
    meaning: 'Output bias term',
    details: 'Learned offset for the output layer',
  },
]

// Symbol definitions for the softmax equation
const softmaxSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#16a34a}{p_t}',
    color: 'green',
    meaning: 'Probability distribution at time t',
    details: 'Probabilities for each possible next character/token',
  },
  {
    symbol: '\\color{#db2777}{y_t}',
    color: 'magenta',
    meaning: 'Raw output scores (logits)',
    details: 'Unnormalized predictions from the network',
  },
  {
    symbol: 'e^{y_{t,i}}',
    color: 'gray',
    meaning: 'Exponentiated score for class i',
    details: 'Converts logits to positive values',
  },
]

// Stakeholder explanations for the main RNN concept
const rnnExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Dinner Party',
    content: "Imagine you're reading a sentence word by word. As you read each word, you don't forget what came before - you keep a running understanding in your head. An RNN works the same way: it processes sequences one element at a time, maintaining a 'memory' (hidden state) that gets updated with each new input. It's like a person with a notepad who reads a book one word at a time, constantly scribbling notes about what they've seen so far.",
    highlights: ['memory', 'hidden state', 'sequences'],
  },
  {
    audience: 'business',
    label: 'For Managers',
    content: "RNNs are the foundational architecture for processing sequential data - anything where order matters. They're used in language translation, speech recognition, and time-series forecasting. The key business insight: RNNs can handle variable-length inputs (unlike fixed-size models), making them flexible for real-world data. They were the dominant approach before Transformers and still offer advantages in certain streaming and memory-constrained scenarios.",
    highlights: ['sequential data', 'variable-length inputs', 'Transformers'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content: "The vanilla RNN implements a recurrence relation where the hidden state h_t is computed as tanh(W_hh * h_{t-1} + W_xh * x_t + b_h). This creates a computational graph that's unrolled through time during backpropagation (BPTT). The weight matrices are shared across all timesteps, giving RNNs parameter efficiency. The tanh activation bounds the hidden state to [-1, 1], though this contributes to vanishing gradients for long sequences.",
    highlights: ['recurrence relation', 'backpropagation', 'weight matrices', 'vanishing gradients'],
  },
  {
    audience: 'interview',
    label: 'Interview',
    content: "An RNN processes sequences by maintaining a hidden state that acts as memory. At each timestep, it combines the previous hidden state with the current input through learned weight matrices. The key insight is that the same weights are used at every timestep - this is called weight sharing or parameter tying. The main limitation is vanishing/exploding gradients during backpropagation through time, which LSTMs and GRUs address with gating mechanisms.",
    highlights: ['hidden state', 'weight sharing', 'vanishing/exploding gradients', 'LSTMs', 'GRUs'],
  },
]

export function Module2Content() {
  return (
    <div className="space-y-8">
      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <CardTitle as="h2">The Core RNN Architecture</CardTitle>
          <CardDescription>
            Understanding how recurrent neural networks build memory into neural computation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            At its heart, an RNN is a neural network with a feedback loop. Unlike feedforward networks
            that process each input independently, RNNs maintain a <strong>hidden state</strong> that
            carries information from previous timesteps. This hidden state is the network&apos;s &ldquo;memory&rdquo; -
            it&apos;s how the network remembers what it has seen before.
          </p>
          <p className="text-slate-700 leading-relaxed">
            The architecture is surprisingly simple: just three weight matrices and a non-linear activation
            function. Yet this simple structure can learn to model remarkably complex sequential patterns.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder Explanations */}
      <ExplanationCards items={rnnExplanations} title="Explain RNNs to Your Stakeholders" />

      {/* Equation 1: Hidden State Update */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
              1
            </span>
            <span className="text-sm font-medium text-blue-600">Core Equation</span>
          </div>
          <CardTitle>The Hidden State Update</CardTitle>
          <CardDescription>
            This is the heart of the RNN - how memory is updated at each timestep
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Equation
            latex="\\color{#2563eb}{h_t} = \\tanh(\\color{#16a34a}{W_{hh}} \\cdot \\color{#2563eb}{h_{t-1}} + \\color{#ea580c}{W_{xh}} \\cdot \\color{#dc2626}{x_t} + \\color{#9333ea}{b_h})"
            symbols={hiddenStateSymbols}
            symbolTablePosition="below"
            size="lg"
          />

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Understanding the Equation</h4>
            <p className="text-slate-700 leading-relaxed mb-4">
              The hidden state equation combines two sources of information: what the network remembers
              (via <InlineEquation latex="W_{hh} \cdot h_{t-1}" />) and what it&apos;s currently seeing
              (via <InlineEquation latex="W_{xh} \cdot x_t" />). The <InlineEquation latex="\tanh" /> activation
              squashes everything to the range [-1, 1], preventing values from exploding.
            </p>
          </div>

          {/* Three Examples */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Concrete Examples</h4>
            <div className="grid gap-4 md:grid-cols-1">
              {/* Example 1: Character-level language model */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 1: Character-Level Language Model</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Processing the word &ldquo;hello&rdquo; character by character:
                </p>
                <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border border-slate-200">
                  <div><span className="text-slate-500">t=0:</span> <InlineEquation latex="x_0 = \text{'h'}" />, <InlineEquation latex="h_0 = \tanh(W_{xh} \cdot x_0)" /> (no prior state)</div>
                  <div><span className="text-slate-500">t=1:</span> <InlineEquation latex="x_1 = \text{'e'}" />, <InlineEquation latex="h_1 = \tanh(W_{hh} \cdot h_0 + W_{xh} \cdot x_1)" /></div>
                  <div><span className="text-slate-500">t=2:</span> <InlineEquation latex="x_2 = \text{'l'}" />, <InlineEquation latex="h_2 = \tanh(W_{hh} \cdot h_1 + W_{xh} \cdot x_2)" /></div>
                  <div className="text-slate-500 italic">...and so on. Each h encodes context from all previous characters.</div>
                </div>
              </div>

              {/* Example 2: Numerical example */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 2: Numerical Computation</h5>
                <p className="text-sm text-slate-600 mb-3">
                  A simplified example with 2D hidden state and 1D input:
                </p>
                <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border border-slate-200">
                  <div>Given: <InlineEquation latex="h_{t-1} = [0.5, -0.3]^T" />, <InlineEquation latex="x_t = 1.0" /></div>
                  <div>Weights: <InlineEquation latex="W_{hh} = \begin{bmatrix} 0.2 & 0.1 \\ -0.1 & 0.3 \end{bmatrix}" />, <InlineEquation latex="W_{xh} = [0.4, 0.2]^T" /></div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <InlineEquation latex="W_{hh} \cdot h_{t-1} = [0.07, 0.04]^T" />
                  </div>
                  <div><InlineEquation latex="W_{xh} \cdot x_t = [0.4, 0.2]^T" /></div>
                  <div><InlineEquation latex="h_t = \tanh([0.47, 0.24]^T) = [0.44, 0.24]^T" /></div>
                </div>
              </div>

              {/* Example 3: Intuitive explanation */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 3: Sentiment Tracking</h5>
                <p className="text-sm text-slate-600 mb-3">
                  How hidden state might track sentiment in a review:
                </p>
                <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
                  <div><span className="text-slate-500">&ldquo;The movie was&rdquo;</span> → <InlineEquation latex="h" /> neutral, awaiting judgment</div>
                  <div><span className="text-slate-500">&ldquo;The movie was terrible&rdquo;</span> → <InlineEquation latex="h" /> shifts strongly negative</div>
                  <div><span className="text-slate-500">&ldquo;The movie was terrible... ly good!&rdquo;</span> → <InlineEquation latex="h" /> reverses to positive</div>
                  <div className="text-slate-500 italic pt-2 border-t border-slate-200 mt-2">
                    The hidden state continuously updates, allowing the network to &ldquo;change its mind&rdquo; as new information arrives.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equation 2: Output Computation */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm font-semibold text-pink-700">
              2
            </span>
            <span className="text-sm font-medium text-pink-600">Output Layer</span>
          </div>
          <CardTitle>The Output Computation</CardTitle>
          <CardDescription>
            Transforming hidden state into predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Equation
            latex="\\color{#db2777}{y_t} = \\color{#0891b2}{W_{hy}} \\cdot \\color{#2563eb}{h_t} + \\color{#9333ea}{b_y}"
            symbols={outputSymbols}
            symbolTablePosition="below"
            size="lg"
          />

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Understanding the Equation</h4>
            <p className="text-slate-700 leading-relaxed">
              This is a simple linear transformation that projects the hidden state into the output space.
              If we&apos;re predicting the next character from a vocabulary of 65 characters,
              <InlineEquation latex="W_{hy}" /> would be a 65 × <InlineEquation latex="d_h" /> matrix,
              producing 65 raw scores (logits) - one for each possible character.
            </p>
          </div>

          {/* Three Examples */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Concrete Examples</h4>
            <div className="grid gap-4 md:grid-cols-1">
              {/* Example 1: Vocabulary projection */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 1: Character Prediction</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Projecting a 128-dim hidden state to a 65-character vocabulary:
                </p>
                <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
                  <div><InlineEquation latex="h_t \in \mathbb{R}^{128}" /> (128-dimensional hidden state)</div>
                  <div><InlineEquation latex="W_{hy} \in \mathbb{R}^{65 \times 128}" /> (weight matrix)</div>
                  <div><InlineEquation latex="y_t \in \mathbb{R}^{65}" /> (one score per character)</div>
                  <div className="text-slate-500 italic pt-2 border-t border-slate-200 mt-2">
                    After &ldquo;hel&rdquo;, y_t might have high scores for &lsquo;l&rsquo; and &lsquo;p&rsquo;, low scores for &lsquo;z&rsquo; and &lsquo;q&rsquo;.
                  </div>
                </div>
              </div>

              {/* Example 2: Numerical */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 2: Numerical Computation</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Simplified example with 2D hidden state and 3 output classes:
                </p>
                <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border border-slate-200">
                  <div>Given: <InlineEquation latex="h_t = [0.8, -0.5]^T" /></div>
                  <div><InlineEquation latex="W_{hy} = \begin{bmatrix} 1.0 & -0.5 \\ 0.2 & 0.8 \\ -0.3 & 1.2 \end{bmatrix}" />, <InlineEquation latex="b_y = [0.1, 0, -0.2]^T" /></div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <InlineEquation latex="y_t = [1.05, -0.24, -1.04]^T" />
                  </div>
                  <div className="text-slate-500 italic">Class 0 (score 1.05) is most likely before softmax.</div>
                </div>
              </div>

              {/* Example 3: Multiple outputs */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 3: Many-to-Many Architecture</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Output at every timestep (e.g., POS tagging):
                </p>
                <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
                  <div>Input: [&ldquo;The&rdquo;, &ldquo;cat&rdquo;, &ldquo;sat&rdquo;]</div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <span className="text-slate-500">t=0:</span> <InlineEquation latex="y_0" /> → [&ldquo;DET&rdquo;, &ldquo;NOUN&rdquo;, &ldquo;VERB&rdquo;, ...] scores → predict &ldquo;DET&rdquo;
                  </div>
                  <div><span className="text-slate-500">t=1:</span> <InlineEquation latex="y_1" /> → predict &ldquo;NOUN&rdquo;</div>
                  <div><span className="text-slate-500">t=2:</span> <InlineEquation latex="y_2" /> → predict &ldquo;VERB&rdquo;</div>
                  <div className="text-slate-500 italic pt-2 border-t border-slate-200 mt-2">
                    Each output uses context from all previous words via the hidden state.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equation 3: Softmax */}
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-semibold text-green-700">
              3
            </span>
            <span className="text-sm font-medium text-green-600">Probability Layer</span>
          </div>
          <CardTitle>The Softmax Function</CardTitle>
          <CardDescription>
            Converting raw scores into a probability distribution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Equation
            latex="\\color{#16a34a}{p_t} = \\text{softmax}(\\color{#db2777}{y_t}) = \\frac{e^{\\color{#db2777}{y_{t,i}}}}{\\sum_j e^{\\color{#db2777}{y_{t,j}}}}"
            symbols={softmaxSymbols}
            symbolTablePosition="below"
            size="lg"
          />

          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Understanding the Equation</h4>
            <p className="text-slate-700 leading-relaxed">
              Softmax transforms the raw output scores (logits) into probabilities that sum to 1.
              The exponentiation ensures all values are positive, and the normalization by the sum
              ensures they form a valid probability distribution. Higher logits get higher probabilities,
              with the differences amplified by the exponential.
            </p>
          </div>

          {/* Three Examples */}
          <div className="border-t border-slate-200 pt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Concrete Examples</h4>
            <div className="grid gap-4 md:grid-cols-1">
              {/* Example 1: Simple softmax */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 1: Basic Softmax Computation</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Converting logits [2.0, 1.0, 0.1] to probabilities:
                </p>
                <div className="space-y-2 text-sm font-mono bg-white p-3 rounded border border-slate-200">
                  <div><InlineEquation latex="e^{2.0} = 7.39, \quad e^{1.0} = 2.72, \quad e^{0.1} = 1.11" /></div>
                  <div><InlineEquation latex="\text{sum} = 7.39 + 2.72 + 1.11 = 11.22" /></div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <InlineEquation latex="p = [0.66, 0.24, 0.10]" />
                  </div>
                  <div className="text-slate-500 italic">The highest logit (2.0) gets 66% of the probability mass.</div>
                </div>
              </div>

              {/* Example 2: Temperature */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 2: Temperature Scaling</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Temperature controls the &ldquo;sharpness&rdquo; of the distribution:
                </p>
                <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
                  <div>Logits: [2.0, 1.0, 0.1]</div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <span className="text-slate-500">T=1.0:</span> <InlineEquation latex="p = [0.66, 0.24, 0.10]" /> (standard)
                  </div>
                  <div>
                    <span className="text-slate-500">T=0.5:</span> <InlineEquation latex="p = [0.84, 0.14, 0.02]" /> (sharper, more confident)
                  </div>
                  <div>
                    <span className="text-slate-500">T=2.0:</span> <InlineEquation latex="p = [0.47, 0.31, 0.22]" /> (softer, more uniform)
                  </div>
                  <div className="text-slate-500 italic pt-2 border-t border-slate-200 mt-2">
                    Lower temperature → more deterministic. Higher → more random/creative.
                  </div>
                </div>
              </div>

              {/* Example 3: Sampling */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Example 3: Sampling from the Distribution</h5>
                <p className="text-sm text-slate-600 mb-3">
                  Using probabilities to generate the next character:
                </p>
                <div className="space-y-2 text-sm bg-white p-3 rounded border border-slate-200">
                  <div>After &quot;Shakespear&quot;, probabilities for next char:</div>
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <InlineEquation latex="p(\text{'e'}) = 0.85" /> (most likely)
                  </div>
                  <div><InlineEquation latex="p(\text{'i'}) = 0.08" /> (plausible)</div>
                  <div><InlineEquation latex="p(\text{other}) = 0.07" /> (combined)</div>
                  <div className="text-slate-500 italic pt-2 border-t border-slate-200 mt-2">
                    We sample from this distribution rather than always picking the max (argmax), which adds variety to generation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Karpathy's Insight */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-amber-700">Key Insight</span>
          </div>
          <CardTitle className="text-amber-900">
            &quot;Training RNNs is Optimization Over Programs&quot;
          </CardTitle>
          <CardDescription className="text-amber-700">
            Andrej Karpathy&apos;s profound observation about what RNNs really are
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <blockquote className="border-l-4 border-amber-400 pl-4 italic text-amber-900">
            &quot;If training vanilla neural nets is optimization over functions, training recurrent nets
            is optimization over programs.&quot;
          </blockquote>

          <p className="text-slate-700 leading-relaxed">
            This insight is crucial: RNNs don&apos;t just learn static input-output mappings. Because they
            process sequences step-by-step with internal state, they&apos;re actually learning <strong>algorithms</strong> -
            procedures that maintain and update memory as they process data.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">Feedforward Networks</h5>
              <p className="text-sm text-slate-600">
                Learn functions: <InlineEquation latex="f(x) = y" />
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Fixed computation, no memory, process each input independently.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">Recurrent Networks</h5>
              <p className="text-sm text-slate-600">
                Learn programs with state: loops, conditionals, memory
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Dynamic computation that adapts based on what&apos;s been seen.
              </p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mt-4">
            This is why RNNs are <strong>Turing complete</strong> - given enough units and appropriate weights,
            they can theoretically compute anything a computer can compute. In practice, this manifests as
            RNNs learning to count, track parentheses, maintain context across long sequences, and implement
            complex conditional logic - all emergent behaviors from the simple recurrent update equation.
          </p>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Putting It All Together</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            The complete RNN forward pass at each timestep:
          </p>
          <div className="space-y-4 rounded-lg bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">1</span>
              <div>
                <span className="font-medium text-slate-900">Update hidden state:</span>
                <div className="mt-1">
                  <InlineEquation latex="h_t = \tanh(W_{hh} \cdot h_{t-1} + W_{xh} \cdot x_t + b_h)" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100 text-sm font-medium text-pink-700">2</span>
              <div>
                <span className="font-medium text-slate-900">Compute output logits:</span>
                <div className="mt-1">
                  <InlineEquation latex="y_t = W_{hy} \cdot h_t + b_y" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">3</span>
              <div>
                <span className="font-medium text-slate-900">Convert to probabilities:</span>
                <div className="mt-1">
                  <InlineEquation latex="p_t = \text{softmax}(y_t)" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            The same three weight matrices (<InlineEquation latex="W_{hh}, W_{xh}, W_{hy}" />) are used at every
            timestep - this is the beauty of parameter sharing. In the next module, we&apos;ll explore what happens
            when we try to train these weights through backpropagation through time, and why long sequences
            cause the infamous vanishing gradient problem.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module2Content
