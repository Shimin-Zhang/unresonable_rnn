'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, ExplanationCards } from '@/components/ui'
import { GradientFlowVisualization, LSTMCellDiagram } from '@/components/visualizations'
import { LongRangeDependencyExamples } from '@/components/interactive'
import { Quiz } from '@/components/interactive/quiz'
import type { QuizConfig } from '@/components/interactive/quiz/types'
import type { ExplanationItem } from '@/components/ui/ExplanationCards'

// Symbol definitions for gradient equations
const gradientSymbols: SymbolDefinition[] = [
  {
    symbol: '\\frac{\\partial L}{\\partial h_0}',
    color: 'blue',
    meaning: 'Gradient of loss with respect to initial hidden state',
  },
  {
    symbol: '\\prod_{t=1}^{T}',
    color: 'green',
    meaning: 'Product over all time steps',
  },
  {
    symbol: '\\frac{\\partial h_t}{\\partial h_{t-1}}',
    color: 'orange',
    meaning: 'Jacobian of hidden state transition',
  },
]

// Symbol definitions for LSTM cell state equation
const cellStateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{purple}{C_t}',
    color: 'purple',
    meaning: 'Cell state at time t',
    details: 'The long-term memory of the LSTM',
  },
  {
    symbol: '\\color{red}{f_t}',
    color: 'red',
    meaning: 'Forget gate output',
    details: 'Values between 0 (forget) and 1 (keep)',
  },
  {
    symbol: '\\color{purple}{C_{t-1}}',
    color: 'purple',
    meaning: 'Previous cell state',
  },
  {
    symbol: '\\color{green}{i_t}',
    color: 'green',
    meaning: 'Input gate output',
    details: 'Controls what new information to add',
  },
  {
    symbol: '\\color{orange}{\\tilde{C}_t}',
    color: 'orange',
    meaning: 'Candidate cell state',
    details: 'New information that could be added',
  },
  {
    symbol: '\\odot',
    color: 'gray',
    meaning: 'Element-wise (Hadamard) product',
  },
]

// Symbol definitions for gate equations
const forgetGateSymbols: SymbolDefinition[] = [
  { symbol: '\\color{red}{f_t}', color: 'red', meaning: 'Forget gate activation (0 to 1)' },
  { symbol: '\\sigma', color: 'gray', meaning: 'Sigmoid function' },
  { symbol: 'W_f', color: 'gray', meaning: 'Forget gate weight matrix' },
  { symbol: 'h_{t-1}', color: 'blue', meaning: 'Previous hidden state' },
  { symbol: 'x_t', color: 'cyan', meaning: 'Current input' },
  { symbol: 'b_f', color: 'gray', meaning: 'Forget gate bias' },
]

const inputGateSymbols: SymbolDefinition[] = [
  { symbol: '\\color{green}{i_t}', color: 'green', meaning: 'Input gate activation (0 to 1)' },
  { symbol: '\\color{orange}{\\tilde{C}_t}', color: 'orange', meaning: 'Candidate values (-1 to 1)' },
]

const outputGateSymbols: SymbolDefinition[] = [
  { symbol: '\\color{blue}{o_t}', color: 'blue', meaning: 'Output gate activation (0 to 1)' },
  { symbol: '\\color{blue}{h_t}', color: 'blue', meaning: 'Hidden state (output)' },
]

// Stakeholder explanations for vanishing gradients
const vanishingGradientExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Casual',
    content:
      "Imagine playing a game of telephone where each person only whispers 50% of what they heard. By the time the message reaches the 20th person, it's basically silence. That's what happens to learning signals in regular RNNs - they fade to nothing before reaching early parts of the sequence.",
    highlights: ['telephone', 'whispers 50%', 'fade to nothing'],
  },
  {
    audience: 'business',
    label: 'Business',
    content:
      'Vanilla RNNs have a fundamental limitation: they cannot learn patterns that span more than ~10-20 time steps. This is a technical barrier called "vanishing gradients" that made early RNNs impractical for most real applications. LSTMs solved this problem by redesigning how information flows through the network.',
    highlights: ['~10-20 time steps', 'vanishing gradients', 'LSTMs solved this'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content:
      'During backpropagation through time, gradients are multiplied by the Jacobian of the state transition at each step. When these Jacobians have eigenvalues < 1, gradients decay exponentially: O(λ^T) where T is sequence length. LSTMs use additive cell state updates with multiplicative gates, creating paths where gradients can flow with ∂C_t/∂C_{t-1} ≈ f_t ≈ 1.',
    highlights: ['Jacobian', 'eigenvalues < 1', 'O(λ^T)', 'additive cell state'],
  },
  {
    audience: 'interview',
    label: 'Interview',
    content:
      'The vanishing gradient problem occurs because gradients multiply through time. If each multiplication is < 1, gradients shrink exponentially, preventing learning of long-range dependencies. LSTMs solve this with a cell state that uses additive updates (C_t = f_t⊙C_{t-1} + i_t⊙C̃_t), creating a "gradient highway" where information can persist.',
    highlights: ['multiply through time', 'shrink exponentially', 'additive updates', 'gradient highway'],
  },
]

// Stakeholder explanations for LSTMs
const lstmExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Casual',
    content:
      "An LSTM is like a smart sticky note system. It has three decision points: (1) Should I erase what's on the note? (2) Should I write something new? (3) What should I say out loud based on the note? This lets it remember important things for a very long time while forgetting irrelevant details.",
    highlights: ['sticky note', 'erase', 'write something new', 'say out loud'],
  },
  {
    audience: 'business',
    label: 'Business',
    content:
      "LSTMs were the breakthrough that made sequence modeling practical. They can learn dependencies across hundreds of time steps, enabling applications like machine translation, speech recognition, and document summarization. They dominated NLP from 2014-2017 before Transformers, and are still used today in many production systems because they're efficient for streaming data.",
    highlights: ['hundreds of time steps', 'machine translation', 'speech recognition', 'efficient for streaming'],
  },
  {
    audience: 'technical',
    label: 'Technical',
    content:
      "The LSTM's key insight is the cell state: a separate memory track that flows through time with only element-wise operations. The forget gate (f_t) controls what to keep, the input gate (i_t) controls what to add, and the output gate (o_t) controls what to expose. This design allows gradients to flow unchanged when gates saturate, solving the vanishing gradient problem.",
    highlights: ['cell state', 'forget gate', 'input gate', 'output gate', 'gradients to flow unchanged'],
  },
  {
    audience: 'interview',
    label: 'Interview',
    content:
      'An LSTM cell maintains a cell state C_t updated as: C_t = f_t⊙C_{t-1} + i_t⊙C̃_t. The forget gate f_t decides what to discard, the input gate i_t decides what new information to store (from candidate C̃_t), and the output gate o_t decides what to output: h_t = o_t⊙tanh(C_t). All gates use sigmoid activations, producing values in [0,1].',
    highlights: ['C_t = f_t⊙C_{t-1} + i_t⊙C̃_t', 'forget gate', 'input gate', 'output gate', 'sigmoid'],
  },
]

// Quiz configuration for Module 3
const module3QuizConfig: QuizConfig = {
  id: 'module-3-vanishing-gradients-lstm',
  title: 'Module 3 Quiz: Vanishing Gradients & LSTMs',
  description: 'Test your understanding of the vanishing gradient problem and how LSTMs solve it.',
  showFeedback: 'immediate',
  allowRetry: true,
  passingScore: 70,
  shuffleQuestions: false,
  questions: [
    {
      id: 'm3-q1',
      type: 'multiple_choice',
      question: 'What causes the vanishing gradient problem in vanilla RNNs?',
      options: [
        'The hidden state is too small to store information',
        'Gradients are multiplied through many time steps, causing exponential decay',
        'The learning rate is set too low',
        'The input sequences are too long to process',
      ],
      correctAnswer: 1,
      explanation:
        'During backpropagation through time, gradients are multiplied by the Jacobian matrix at each step. When these values are less than 1, they multiply together and decay exponentially (e.g., 0.5^20 ≈ 0.00000095), causing the gradient to essentially vanish.',
    },
    {
      id: 'm3-q2',
      type: 'multiple_choice',
      question: 'If gradients multiply by 0.5 at each time step, what happens over 20 steps?',
      options: [
        'The gradient becomes 10 times larger',
        'The gradient stays approximately the same',
        'The gradient becomes about one-millionth of its original value',
        'The gradient doubles',
      ],
      correctAnswer: 2,
      explanation:
        '0.5^20 = 0.00000095, which is approximately one-millionth (10^-6) of the original gradient. This exponential decay means almost no learning signal reaches the early parts of the sequence.',
    },
    {
      id: 'm3-q3',
      type: 'multiple_choice',
      question: 'What is the key architectural innovation that allows LSTMs to solve the vanishing gradient problem?',
      options: [
        'Using larger hidden states',
        'The cell state with additive updates',
        'Deeper network layers',
        'Faster training algorithms',
      ],
      correctAnswer: 1,
      explanation:
        'The cell state C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t uses addition rather than the multiplicative transformations of vanilla RNNs. This creates a "gradient highway" where information (and gradients) can flow unchanged when the forget gate is close to 1.',
    },
    {
      id: 'm3-q4',
      type: 'matching',
      question: 'Match each LSTM gate to its function:',
      pairs: [
        { id: 'forget', left: 'Forget gate (f_t)', right: 'Decides what to discard from cell state' },
        { id: 'input', left: 'Input gate (i_t)', right: 'Decides what new information to store' },
        { id: 'output', left: 'Output gate (o_t)', right: 'Decides what to expose as hidden state' },
      ],
      explanation:
        'The three gates work together: the forget gate controls what old information to keep, the input gate controls what new information to add, and the output gate controls what parts of the cell state to output as the hidden state h_t.',
    },
    {
      id: 'm3-q5',
      type: 'multiple_choice',
      question: 'In the LSTM cell state equation C_t = f_t ⊙ C_{t-1} + i_t ⊙ C̃_t, what does the ⊙ symbol represent?',
      options: [
        'Matrix multiplication',
        'Element-wise (Hadamard) product',
        'Addition',
        'Dot product',
      ],
      correctAnswer: 1,
      explanation:
        'The ⊙ symbol represents element-wise (Hadamard) multiplication, where each element of one vector is multiplied by the corresponding element of the other vector. This allows gates to selectively scale each dimension independently.',
    },
    {
      id: 'm3-q6',
      type: 'multiple_choice',
      question: 'Why do all LSTM gates use sigmoid activation functions?',
      options: [
        'Sigmoid is computationally faster than other activations',
        'Sigmoid outputs values between 0 and 1, acting as "valves" that control information flow',
        'Sigmoid prevents exploding gradients',
        'Sigmoid was the only available activation function in 1997',
      ],
      correctAnswer: 1,
      explanation:
        'Sigmoid outputs values in [0, 1], making it ideal for gating mechanisms. A value of 0 means "completely block" while 1 means "completely pass through." This allows the gates to learn smooth, differentiable control over information flow.',
    },
    {
      id: 'm3-q7',
      type: 'fill_blank',
      question: 'Complete the LSTM hidden state output equation:',
      textWithBlanks: 'h_t = {{blank1}} ⊙ tanh({{blank2}})',
      blanks: [
        { id: 'blank1', answer: 'o_t', acceptableAnswers: ['o_t', 'ot', 'o', 'output gate'] },
        { id: 'blank2', answer: 'C_t', acceptableAnswers: ['C_t', 'Ct', 'C', 'cell state'] },
      ],
      explanation:
        'The hidden state h_t is computed by applying the output gate o_t to the cell state (passed through tanh). This allows the LSTM to control what information from its memory is exposed to the rest of the network.',
    },
    {
      id: 'm3-q8',
      type: 'multiple_choice',
      question: 'Which of the following is an example of a long-range dependency that vanilla RNNs struggle with?',
      options: [
        'Predicting the next letter in "cat"',
        'Subject-verb agreement across many intervening words (e.g., "The keys to the cabinet are...")',
        'Copying the previous character in a sequence',
        'Adding two single-digit numbers',
      ],
      correctAnswer: 1,
      explanation:
        'Subject-verb agreement requires remembering the subject ("keys" is plural) across many intervening words. Vanilla RNNs struggle with this because the gradient signal from the verb "are" decays before reaching "keys." LSTMs can maintain this information in their cell state.',
    },
    {
      id: 'm3-q9',
      type: 'multiple_choice',
      question: 'When the forget gate f_t ≈ 1 for all time steps, what happens to gradients flowing through the cell state?',
      options: [
        'Gradients vanish exponentially',
        'Gradients explode exponentially',
        'Gradients flow through relatively unchanged',
        'Gradients become random noise',
      ],
      correctAnswer: 2,
      explanation:
        'When f_t ≈ 1, the gradient ∂C_t/∂C_{t-1} ≈ f_t ≈ 1. This means gradients can flow through the cell state path almost unchanged, regardless of sequence length. This is the "gradient highway" that solves the vanishing gradient problem.',
    },
    {
      id: 'm3-q10',
      type: 'multiple_choice',
      question: 'Compared to vanilla RNNs, approximately how many time steps can LSTMs learn dependencies across?',
      options: [
        '~5-10 steps (similar to vanilla RNNs)',
        '~10-20 steps',
        '~50-100 steps',
        'Hundreds of steps',
      ],
      correctAnswer: 3,
      explanation:
        'While vanilla RNNs struggle with dependencies beyond 10-20 steps, LSTMs can learn dependencies across hundreds of time steps. This is why they became the dominant architecture for sequence modeling from 2014-2017, enabling breakthroughs in machine translation, speech recognition, and more.',
    },
  ],
}

export function Module3Content() {
  return (
    <div className="space-y-12">
      {/* Section 1: The Vanishing Gradient Problem */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          The Vanishing Gradient Problem
        </h2>
        <p className="mb-6 text-slate-600">
          Vanilla RNNs have a fundamental limitation that prevents them from learning
          long-range dependencies. Let&apos;s understand why this happens and see it in action.
        </p>

        {/* Gradient multiplication through time */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Gradient Flow During Backpropagation
            </h3>
            <p className="mb-4 text-slate-600">
              During backpropagation through time (BPTT), the gradient at step 0 requires
              multiplying many Jacobian matrices together:
            </p>
            <Equation
              latex="\\frac{\\partial L}{\\partial h_0} = \\frac{\\partial L}{\\partial h_T} \\cdot \\prod_{t=1}^{T} \\frac{\\partial h_t}{\\partial h_{t-1}}"
              symbols={gradientSymbols}
              size="lg"
              label="Gradient through time"
            />
          </CardContent>
        </Card>

        {/* Numeric examples */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              The Numbers Don&apos;t Lie
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="mb-2 font-mono text-2xl font-bold text-blue-700">
                  0.5<sup>20</sup>
                </div>
                <div className="mb-1 font-mono text-lg text-blue-600">= 0.00000095</div>
                <p className="text-sm text-blue-800">
                  Gradient essentially vanishes - no learning signal reaches early steps
                </p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="mb-2 font-mono text-2xl font-bold text-green-700">
                  1.0<sup>20</sup>
                </div>
                <div className="mb-1 font-mono text-lg text-green-600">= 1.0</div>
                <p className="text-sm text-green-800">
                  Perfect preservation - the ideal case that LSTMs achieve
                </p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="mb-2 font-mono text-2xl font-bold text-red-700">
                  2.0<sup>20</sup>
                </div>
                <div className="mb-1 font-mono text-lg text-red-600">= 1,048,576</div>
                <p className="text-sm text-red-800">
                  Gradient explodes - training becomes unstable with NaN values
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive visualization */}
        <GradientFlowVisualization className="mb-6" />

        {/* Stakeholder explanations */}
        <ExplanationCards
          items={vanishingGradientExplanations}
          title="Explain the Vanishing Gradient Problem"
          className="mb-6"
        />
      </section>

      {/* Section 2: The LSTM Solution */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          The LSTM Solution
        </h2>
        <p className="mb-6 text-slate-600">
          Long Short-Term Memory (LSTM) networks, introduced by Hochreiter & Schmidhuber
          in 1997, solve the vanishing gradient problem with a elegant architectural change:
          the <strong>cell state</strong>.
        </p>

        {/* LSTM Cell Diagram */}
        <LSTMCellDiagram className="mb-6" />

        {/* Core cell state equation */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              The Cell State Equation
            </h3>
            <p className="mb-4 text-slate-600">
              The key innovation is the cell state <InlineEquation latex="C_t" />, which
              flows through time with only element-wise operations:
            </p>
            <Equation
              latex="\\color{purple}{C_t} = \\color{red}{f_t} \\odot \\color{purple}{C_{t-1}} + \\color{green}{i_t} \\odot \\color{orange}{\\tilde{C}_t}"
              symbols={cellStateSymbols}
              symbolTablePosition="below"
              size="lg"
              label="Cell State Update"
            />
            <div className="mt-4 rounded-lg bg-green-50 p-4 border border-green-200">
              <h4 className="font-semibold text-green-900">Why This Solves Vanishing Gradients</h4>
              <p className="mt-1 text-sm text-green-800">
                Notice the <strong>addition</strong> (+) in this equation. Unlike vanilla RNNs
                where the hidden state is completely transformed at each step, the LSTM cell
                state is updated additively. When the forget gate <InlineEquation latex="f_t" /> is
                close to 1, the gradient flows through unchanged:{' '}
                <InlineEquation latex="\\frac{\\partial C_t}{\\partial C_{t-1}} \\approx f_t \\approx 1" />
              </p>
            </div>
          </CardContent>
        </Card>

        {/* The Three Gates */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              The Three Gates
            </h3>

            {/* Forget Gate */}
            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-red-700">1. Forget Gate</h4>
              <p className="mb-3 text-slate-600">
                Decides what information to discard from the cell state. A value of 0 means
                &quot;completely forget&quot;, while 1 means &quot;completely keep&quot;.
              </p>
              <Equation
                latex="\\color{red}{f_t} = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)"
                symbols={forgetGateSymbols}
                size="md"
              />
            </div>

            {/* Input Gate */}
            <div className="mb-6">
              <h4 className="mb-2 font-semibold text-green-700">2. Input Gate</h4>
              <p className="mb-3 text-slate-600">
                Decides what new information to store. Works with a candidate value created
                by a tanh layer.
              </p>
              <div className="space-y-2">
                <Equation
                  latex="\\color{green}{i_t} = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)"
                  size="md"
                />
                <Equation
                  latex="\\color{orange}{\\tilde{C}_t} = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)"
                  symbols={inputGateSymbols}
                  size="md"
                />
              </div>
            </div>

            {/* Output Gate */}
            <div>
              <h4 className="mb-2 font-semibold text-blue-700">3. Output Gate</h4>
              <p className="mb-3 text-slate-600">
                Decides what parts of the cell state to output. The output goes through
                tanh to squash values to [-1, 1].
              </p>
              <div className="space-y-2">
                <Equation
                  latex="\\color{blue}{o_t} = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)"
                  size="md"
                />
                <Equation
                  latex="\\color{blue}{h_t} = \\color{blue}{o_t} \\odot \\tanh(\\color{purple}{C_t})"
                  symbols={outputGateSymbols}
                  size="md"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder explanations */}
        <ExplanationCards
          items={lstmExplanations}
          title="Explain LSTMs to Your Stakeholders"
          className="mb-6"
        />
      </section>

      {/* Section 3: Practical Examples */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Why Long-Range Dependencies Matter
        </h2>
        <p className="mb-6 text-slate-600">
          Let&apos;s look at concrete examples where vanilla RNNs fail and LSTMs succeed.
          In each case, the model must remember information across many tokens.
        </p>

        <LongRangeDependencyExamples className="mb-6" />
      </section>

      {/* Section 4: Key Takeaways */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Key Takeaways
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold text-red-700">
                ❌ Vanilla RNN Limitations
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Gradients multiply through time steps</li>
                <li>• Exponential decay (vanishing) or growth (exploding)</li>
                <li>• Cannot learn dependencies beyond ~10-20 steps</li>
                <li>• No explicit memory mechanism</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-2 font-semibold text-green-700">
                ✓ LSTM Advantages
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Additive cell state updates</li>
                <li>• Gradient highway through forget gate</li>
                <li>• Can learn dependencies across hundreds of steps</li>
                <li>• Explicit forget/remember mechanisms</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 5: Quiz */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-900">
          Test Your Understanding
        </h2>
        <p className="mb-6 text-slate-600">
          Take this quiz to reinforce your understanding of vanishing gradients and LSTMs.
          You need 70% to pass, and you can retake it as many times as you like.
        </p>
        <Quiz config={module3QuizConfig} />
      </section>
    </div>
  )
}

export default Module3Content
