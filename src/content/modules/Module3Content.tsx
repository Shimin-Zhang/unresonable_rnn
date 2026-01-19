'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'

// Symbol definitions for the vanishing gradient problem
const gradientSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{\\frac{\\partial L}{\\partial h_t}}',
    color: 'red',
    meaning: 'Gradient of loss w.r.t. hidden state',
    details: 'How much the loss changes when we slightly change the hidden state',
  },
  {
    symbol: '\\color{#2563eb}{W_{hh}}',
    color: 'blue',
    meaning: 'Hidden-to-hidden weight matrix',
    details: 'The same matrix applied at every timestep',
  },
  {
    symbol: '\\color{#16a34a}{\\sigma\'(\\cdot)}',
    color: 'green',
    meaning: 'Derivative of activation function',
    details: 'For tanh, always between 0 and 1',
  },
]

// Symbol definitions for the LSTM cell state equation
const cellStateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#2563eb}{C_t}',
    color: 'blue',
    meaning: 'Cell state at time t',
    details: 'The "conveyor belt" of information - long-term memory',
  },
  {
    symbol: '\\color{#2563eb}{C_{t-1}}',
    color: 'blue',
    meaning: 'Previous cell state',
    details: 'Information from previous timesteps',
  },
  {
    symbol: '\\color{#dc2626}{f_t}',
    color: 'red',
    meaning: 'Forget gate output',
    details: 'Values between 0-1 deciding what to forget (0 = forget completely)',
  },
  {
    symbol: '\\color{#16a34a}{i_t}',
    color: 'green',
    meaning: 'Input gate output',
    details: 'Values between 0-1 deciding what new info to add',
  },
  {
    symbol: '\\color{#ea580c}{\\tilde{C}_t}',
    color: 'orange',
    meaning: 'Candidate cell state',
    details: 'New information that could be added to the cell state',
  },
  {
    symbol: '\\color{#9333ea}{\\odot}',
    color: 'purple',
    meaning: 'Element-wise multiplication (Hadamard product)',
    details: 'Multiply corresponding elements of two vectors',
  },
]

// Symbol definitions for the gate equations
const forgetGateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{f_t}',
    color: 'red',
    meaning: 'Forget gate output',
    details: 'Sigmoid output: 0 = forget, 1 = keep',
  },
  {
    symbol: '\\color{#9333ea}{\\sigma}',
    color: 'purple',
    meaning: 'Sigmoid function',
    details: 'Squashes values to range (0, 1)',
  },
  {
    symbol: '\\color{#0891b2}{W_f}',
    color: 'cyan',
    meaning: 'Forget gate weights',
    details: 'Learned parameters for the forget gate',
  },
  {
    symbol: '\\color{#2563eb}{h_{t-1}}',
    color: 'blue',
    meaning: 'Previous hidden state',
    details: 'Short-term memory from last timestep',
  },
  {
    symbol: '\\color{#ea580c}{x_t}',
    color: 'orange',
    meaning: 'Current input',
    details: 'The input at this timestep',
  },
]

const inputGateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#16a34a}{i_t}',
    color: 'green',
    meaning: 'Input gate output',
    details: 'Sigmoid output: 0 = block, 1 = allow',
  },
  {
    symbol: '\\color{#ea580c}{\\tilde{C}_t}',
    color: 'orange',
    meaning: 'Candidate values',
    details: 'New information created by tanh, range (-1, 1)',
  },
  {
    symbol: '\\color{#0891b2}{W_i, W_C}',
    color: 'cyan',
    meaning: 'Input and candidate weights',
    details: 'Separate learned parameters for each',
  },
]

const outputGateSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#db2777}{o_t}',
    color: 'magenta',
    meaning: 'Output gate',
    details: 'Controls what parts of cell state to output',
  },
  {
    symbol: '\\color{#2563eb}{h_t}',
    color: 'blue',
    meaning: 'Hidden state (output)',
    details: 'The filtered cell state that gets passed on',
  },
  {
    symbol: '\\color{#0891b2}{W_o}',
    color: 'cyan',
    meaning: 'Output gate weights',
    details: 'Learned parameters for the output gate',
  },
]

// Stakeholder explanations for vanishing gradients
const vanishingGradientExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The Business Impact',
    content: 'Standard RNNs struggle to learn patterns that span more than ~10-20 steps. This means they fail at tasks requiring long-term context - like understanding a document\'s theme or tracking dependencies across a conversation. LSTMs solved this, enabling the deep learning revolution in NLP.',
  },
  {
    audience: 'technical',
    label: 'The Math Problem',
    content: 'During backpropagation, gradients are multiplied by W_hh at each timestep. If the largest eigenvalue of W_hh is < 1, gradients decay exponentially (0.9^100 ≈ 0). If > 1, they explode. LSTMs introduce additive gradient flow through the cell state, allowing gradients to flow unchanged.',
  },
  {
    audience: 'casual',
    label: 'The Telephone Game',
    content: 'Imagine whispering a message through 100 people. Each person slightly garbles it - by the end, it\'s unrecognizable. That\'s vanishing gradients. LSTMs are like giving each person a notepad to write down the original message and pass it along unchanged.',
  },
]

// Stakeholder explanations for LSTM
const lstmExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'Why LSTMs Matter',
    content: 'LSTMs powered the first generation of production AI systems: Google Translate, Siri\'s language understanding, and Gmail\'s Smart Compose. They can remember important information for hundreds of timesteps, enabling applications that understand context and meaning.',
  },
  {
    audience: 'technical',
    label: 'The Architecture',
    content: 'LSTMs add a cell state (long-term memory) separate from the hidden state (working memory). Three gates control information flow: forget gate (what to erase), input gate (what to write), output gate (what to expose). The cell state update is additive, not multiplicative, preventing gradient vanishing.',
  },
  {
    audience: 'casual',
    label: 'The Conveyor Belt Analogy',
    content: 'Think of the cell state as a conveyor belt running through the network. Information can ride along unchanged (gradients flow freely). Gates act like workers who can: remove items (forget gate), add new items (input gate), or pick items to use (output gate).',
  },
]

export function Module3Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 3: The Vanishing Gradient Problem &amp; LSTMs</CardTitle>
          <CardDescription>
            Why vanilla RNNs struggle with long sequences, and how LSTMs solved the problem
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            In Module 2, we saw that RNNs maintain a hidden state that gets updated at each timestep.
            But there&apos;s a critical problem: when we try to train these networks using backpropagation,
            the gradients must flow backwards through every timestep. For long sequences, this causes
            gradients to either <strong>vanish</strong> (become negligibly small) or <strong>explode</strong> (become
            astronomically large).
          </p>
          <p className="text-slate-700 leading-relaxed">
            This module explores why this happens mathematically, and how the <strong>Long Short-Term
            Memory (LSTM)</strong> architecture elegantly solves the problem through a system of gates.
          </p>
        </CardContent>
      </Card>

      {/* The Problem: Vanishing Gradients */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-sm font-medium text-red-700">The Problem</span>
          </div>
          <CardTitle className="text-red-900">Vanishing Gradients</CardTitle>
          <CardDescription className="text-red-700">
            Why training RNNs on long sequences fails
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={vanishingGradientExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Mathematical Reality</h4>
            <p className="text-slate-700 mb-4">
              When we backpropagate through time, the gradient at timestep t depends on all future
              timesteps. The chain rule gives us repeated multiplications:
            </p>
            <Equation
              latex="\frac{\partial L}{\partial h_0} = \frac{\partial L}{\partial h_T} \cdot \prod_{t=1}^{T} \color{#2563eb}{W_{hh}} \cdot \color{#16a34a}{\sigma'(h_t)}"
              label="Gradient Flow Through Time"
              symbols={gradientSymbols}
            />
            <p className="text-sm text-slate-600 mt-2">
              The gradient at timestep 0 requires multiplying W_hh and the activation derivative T times.
            </p>
          </div>

          {/* Concrete Examples */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Concrete Numbers: The Power of Multiplication</h4>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Vanishing Example */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <h5 className="font-medium text-red-900 mb-2">Vanishing (λ = 0.5)</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>After 10 steps:</span>
                    <InlineEquation latex="0.5^{10} = 0.001" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 20 steps:</span>
                    <InlineEquation latex="0.5^{20} \approx 10^{-6}" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 50 steps:</span>
                    <InlineEquation latex="0.5^{50} \approx 10^{-15}" />
                  </div>
                </div>
                <p className="text-red-700 text-sm mt-3 italic">
                  Gradient essentially disappears - early layers stop learning
                </p>
              </div>

              {/* Exploding Example */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <h5 className="font-medium text-orange-900 mb-2">Exploding (λ = 2.0)</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>After 10 steps:</span>
                    <InlineEquation latex="2^{10} = 1024" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 20 steps:</span>
                    <InlineEquation latex="2^{20} \approx 10^{6}" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 50 steps:</span>
                    <InlineEquation latex="2^{50} \approx 10^{15}" />
                  </div>
                </div>
                <p className="text-orange-700 text-sm mt-3 italic">
                  Gradient explodes - weights become NaN, training diverges
                </p>
              </div>

              {/* Ideal Example */}
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <h5 className="font-medium text-green-900 mb-2">Ideal (λ = 1.0)</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>After 10 steps:</span>
                    <InlineEquation latex="1^{10} = 1" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 20 steps:</span>
                    <InlineEquation latex="1^{20} = 1" />
                  </div>
                  <div className="flex justify-between">
                    <span>After 50 steps:</span>
                    <InlineEquation latex="1^{50} = 1" />
                  </div>
                </div>
                <p className="text-green-700 text-sm mt-3 italic">
                  Gradient preserved - but impossible to maintain exactly
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 mt-4">
            <p className="text-slate-700 text-sm">
              <strong>Key insight:</strong> The problem isn&apos;t just theoretical. In practice, vanilla RNNs
              struggle to learn dependencies longer than ~10-20 timesteps. For tasks like document
              understanding, translation, or even basic subject-verb agreement across clauses, this
              is catastrophic.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The Solution: LSTM */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✅</span>
            <span className="text-sm font-medium text-green-700">The Solution</span>
          </div>
          <CardTitle className="text-green-900">Long Short-Term Memory (LSTM)</CardTitle>
          <CardDescription className="text-green-700">
            A gated architecture that allows gradients to flow unimpeded
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={lstmExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Key Innovation: Cell State</h4>
            <p className="text-slate-700 mb-4">
              LSTMs introduce a separate <strong>cell state</strong> <InlineEquation latex="C_t" /> that runs
              through the entire sequence like a conveyor belt. Information can flow along this belt
              with only minor linear interactions, allowing gradients to propagate much more easily.
            </p>
            <Equation
              latex="C_t = \color{#dc2626}{f_t} \odot C_{t-1} + \color{#16a34a}{i_t} \odot \color{#ea580c}{\tilde{C}_t}"
              label="Cell State Update"
              symbols={cellStateSymbols}
            />
            <p className="text-sm text-slate-600 mt-2">
              The cell state is updated additively, not multiplicatively - this is the key to solving vanishing gradients.
            </p>
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mt-4">
              <p className="text-green-800 text-sm">
                <strong>Why this works:</strong> When <InlineEquation latex="f_t = 1" /> and <InlineEquation latex="i_t = 0" />,
                the cell state passes through unchanged: <InlineEquation latex="C_t = C_{t-1}" />.
                Gradients flow directly back without any multiplication that could cause vanishing!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Three Gates */}
      <Card>
        <CardHeader>
          <CardTitle>The Three Gates of LSTM</CardTitle>
          <CardDescription>
            Each gate learns when to allow or block information flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Forget Gate */}
          <div className="rounded-lg border-2 border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚪</span>
              <div>
                <h4 className="text-lg font-semibold text-red-900">1. Forget Gate</h4>
                <p className="text-sm text-red-700">Decides what information to throw away from the cell state</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              A sigmoid layer that outputs values between 0 (completely forget) and 1 (completely keep):
            </p>
            <Equation
              latex="f_t = \sigma(\color{#0891b2}{W_f} \cdot [\color{#2563eb}{h_{t-1}}, \color{#ea580c}{x_t}] + b_f)"
              label="Forget Gate"
              symbols={forgetGateSymbols}
            />
            <div className="mt-4 rounded-lg bg-red-50 p-4">
              <h5 className="font-medium text-red-900 mb-2">Example: Language Modeling</h5>
              <p className="text-sm text-red-800">
                When processing &quot;The <strong>cat</strong>, which was very fluffy, <strong>sat</strong> on the mat&quot;,
                the forget gate might learn to forget the gender information of &quot;cat&quot; after
                the verb &quot;sat&quot; appears, since subject-verb agreement is now resolved.
              </p>
            </div>
          </div>

          {/* Input Gate */}
          <div className="rounded-lg border-2 border-green-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📥</span>
              <div>
                <h4 className="text-lg font-semibold text-green-900">2. Input Gate</h4>
                <p className="text-sm text-green-700">Decides what new information to store in the cell state</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Controls which values will be updated:
            </p>
            <Equation
              latex="i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)"
              label="Input Gate"
              symbols={inputGateSymbols}
            />
            <p className="text-sm text-slate-600 mb-2 mt-4">
              Creates a vector of new candidate values that could be added:
            </p>
            <Equation
              latex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)"
              label="Candidate Values"
              symbols={inputGateSymbols}
            />
            <div className="mt-4 rounded-lg bg-green-50 p-4">
              <h5 className="font-medium text-green-900 mb-2">Example: Bracket Matching</h5>
              <p className="text-sm text-green-800">
                When seeing an opening bracket &quot;(&quot;, the input gate activates strongly to write
                &quot;expecting close paren&quot; to the cell state. When the closing &quot;)&quot; appears,
                this information is read and cleared.
              </p>
            </div>
          </div>

          {/* Output Gate */}
          <div className="rounded-lg border-2 border-purple-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">📤</span>
              <div>
                <h4 className="text-lg font-semibold text-purple-900">3. Output Gate</h4>
                <p className="text-sm text-purple-700">Decides what parts of the cell state to output</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Controls what parts of the cell state become the hidden state:
            </p>
            <Equation
              latex="o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)"
              label="Output Gate"
              symbols={outputGateSymbols}
            />
            <p className="text-sm text-slate-600 mb-2 mt-4">
              The filtered version of the cell state becomes our output:
            </p>
            <Equation
              latex="h_t = o_t \odot \tanh(C_t)"
              label="Hidden State Output"
              symbols={outputGateSymbols}
            />
            <div className="mt-4 rounded-lg bg-purple-50 p-4">
              <h5 className="font-medium text-purple-900 mb-2">Example: Sentiment with Negation</h5>
              <p className="text-sm text-purple-800">
                In &quot;The movie was not good&quot;, the LSTM might store both &quot;positive sentiment&quot; (from &quot;good&quot;)
                and &quot;negation present&quot; in the cell state, but only output the combined &quot;negative sentiment&quot;
                through the output gate.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete LSTM Diagram */}
      <Card>
        <CardHeader>
          <CardTitle>Complete LSTM Forward Pass</CardTitle>
          <CardDescription>All equations together in processing order</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">1</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Forget Gate:</span>
                <div className="mt-1">
                  <InlineEquation latex="f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">2</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Input Gate + Candidates:</span>
                <div className="mt-1 space-y-1">
                  <div><InlineEquation latex="i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)" /></div>
                  <div><InlineEquation latex="\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)" /></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">3</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Update Cell State:</span>
                <div className="mt-1">
                  <InlineEquation latex="C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t" />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">4</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Output Gate + Hidden State:</span>
                <div className="mt-1 space-y-1">
                  <div><InlineEquation latex="o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)" /></div>
                  <div><InlineEquation latex="h_t = o_t \odot \tanh(C_t)" /></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-amber-700">Key Insight</span>
          </div>
          <CardTitle className="text-amber-900">
            The Highway for Gradients
          </CardTitle>
          <CardDescription className="text-amber-700">
            Why the cell state architecture works
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            The genius of LSTMs is the <strong>additive</strong> update to the cell state. In vanilla RNNs,
            information is transformed multiplicatively at each step. In LSTMs, information can be
            added or removed, but there&apos;s always a direct path for gradients to flow.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="rounded-lg border border-red-200 bg-white/50 p-4">
              <h5 className="font-medium text-red-900 mb-2">Vanilla RNN Gradient Flow</h5>
              <div className="text-center my-3">
                <InlineEquation latex="\frac{\partial C_t}{\partial C_{t-1}} = W_{hh} \cdot \sigma'" />
              </div>
              <p className="text-sm text-red-700">
                Must multiply by weights and activation derivatives at every step
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-white/50 p-4">
              <h5 className="font-medium text-green-900 mb-2">LSTM Gradient Flow</h5>
              <div className="text-center my-3">
                <InlineEquation latex="\frac{\partial C_t}{\partial C_{t-1}} = f_t" />
              </div>
              <p className="text-sm text-green-700">
                When forget gate ≈ 1, gradients flow directly through unchanged!
              </p>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mt-4">
            This is similar to the <strong>residual connections</strong> in modern transformers - providing
            a &quot;highway&quot; for gradients to flow through without degradation. The LSTM gates learn
            which information deserves highway access.
          </p>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary: From Problem to Solution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h5 className="font-semibold text-red-900 mb-3">The Vanishing Gradient Problem</h5>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Gradients multiply through each timestep</li>
                <li>• Values &lt; 1 cause exponential decay</li>
                <li>• Early layers receive near-zero gradients</li>
                <li>• Network can&apos;t learn long-range dependencies</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h5 className="font-semibold text-green-900 mb-3">The LSTM Solution</h5>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Cell state provides additive gradient path</li>
                <li>• Forget gate can be ~1, preserving gradients</li>
                <li>• Information stored for hundreds of steps</li>
                <li>• Gates learn what to remember and forget</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            In the next module, we&apos;ll see LSTMs in action through character-level language modeling -
            the exact task Karpathy used to demonstrate the &quot;unreasonable effectiveness&quot; of RNNs.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module3Content
