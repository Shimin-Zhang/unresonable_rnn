'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'

// Symbol definitions for cross-entropy loss
const lossSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{L}',
    color: 'red',
    meaning: 'Total loss (cross-entropy)',
    details: 'What we minimize during training - lower is better',
  },
  {
    symbol: '\\color{#2563eb}{p(c_{t+1}|c_1...c_t)}',
    color: 'blue',
    meaning: 'Predicted probability of next character',
    details: 'The model\'s confidence in its prediction',
  },
  {
    symbol: '\\color{#16a34a}{c_t}',
    color: 'green',
    meaning: 'Character at position t',
    details: 'The actual character in the training sequence',
  },
  {
    symbol: '\\color{#9333ea}{\\log}',
    color: 'purple',
    meaning: 'Natural logarithm',
    details: 'Converts probabilities to log-probabilities for numerical stability',
  },
]

// Symbol definitions for temperature softmax
const temperatureSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{p_i}',
    color: 'red',
    meaning: 'Probability of character i',
    details: 'Output probability after temperature scaling',
  },
  {
    symbol: '\\color{#2563eb}{y_i}',
    color: 'blue',
    meaning: 'Logit (raw score) for character i',
    details: 'Unnormalized output from the network',
  },
  {
    symbol: '\\color{#ea580c}{\\tau}',
    color: 'orange',
    meaning: 'Temperature parameter',
    details: 'Controls randomness: low = deterministic, high = random',
  },
  {
    symbol: '\\color{#16a34a}{e^{y_i/\\tau}}',
    color: 'green',
    meaning: 'Exponentiated scaled logit',
    details: 'Softmax numerator with temperature scaling',
  },
]

// Symbol definitions for one-hot encoding
const oneHotSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#2563eb}{x}',
    color: 'blue',
    meaning: 'One-hot vector',
    details: 'Binary vector with single 1 at character index',
  },
  {
    symbol: '\\color{#16a34a}{V}',
    color: 'green',
    meaning: 'Vocabulary size',
    details: 'Total number of unique characters',
  },
  {
    symbol: '\\color{#dc2626}{x_i = 1}',
    color: 'red',
    meaning: 'Active position',
    details: 'The index where the character is encoded',
  },
]

// Stakeholder explanations
const charRnnExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The Foundation of Modern AI',
    content: 'Character-level language models are the conceptual ancestor of ChatGPT and Claude. The core idea - predict the next token given context - scales from single characters to the sophisticated AI assistants your company uses today. Understanding this helps you grasp why AI can be both remarkably capable and surprisingly limited.',
  },
  {
    audience: 'technical',
    label: 'Training Objective',
    content: 'We maximize the log-likelihood of the training data: at each timestep, the model outputs a probability distribution over all characters, and we minimize cross-entropy between predictions and targets. The model learns character-level patterns, word boundaries, syntax, and even long-range structure - all emergently from next-character prediction.',
  },
  {
    audience: 'casual',
    label: 'Autocomplete on Steroids',
    content: 'You know how your phone suggests the next word? Character-level models do the same thing, but letter by letter. Train one on Shakespeare, and it learns spelling, grammar, and even dramatic style - all just from guessing the next letter millions of times.',
  },
]

const temperatureExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The Creativity Dial',
    content: 'When you adjust the temperature slider in ChatGPT or Claude, you are controlling this exact parameter. Low temperature (0.1-0.3) gives focused, deterministic outputs good for factual tasks. High temperature (0.7-1.0) produces more creative, varied responses - useful for brainstorming but with higher error risk.',
  },
  {
    audience: 'technical',
    label: 'Softmax Temperature',
    content: 'Temperature τ divides logits before softmax. As τ→0, the distribution becomes one-hot (argmax). As τ→∞, the distribution becomes uniform. τ=1 is the trained distribution. In practice, τ∈[0.1, 1.5] covers most use cases. Lower temperature reduces entropy; higher temperature increases exploration.',
  },
  {
    audience: 'casual',
    label: 'Confident vs Creative',
    content: 'Low temperature is like asking someone who only says what they are sure about. High temperature is like asking someone who is willing to take creative risks. At temperature 0, the model always picks its top choice. At high temperature, it might pick surprising alternatives.',
  },
]

export function Module4Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 4: Character-Level Language Modeling</CardTitle>
          <CardDescription>
            The core idea behind modern AI: predict the next token
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            This module covers the heart of Karpathy&apos;s blog post: training an RNN to predict the
            next character in a sequence. This deceptively simple task - when scaled up - is the
            foundation of ChatGPT, Claude, and every modern language model.
          </p>
          <p className="text-slate-700 leading-relaxed">
            We&apos;ll walk through the complete pipeline: encoding characters as vectors, training
            with cross-entropy loss, and sampling with temperature control. By the end, you&apos;ll
            understand exactly what happens when you adjust the &quot;temperature&quot; slider in your
            favorite AI tool.
          </p>
        </CardContent>
      </Card>

      {/* The Core Idea */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-blue-700">The Core Idea</span>
          </div>
          <CardTitle className="text-blue-900">Next-Character Prediction</CardTitle>
          <CardDescription className="text-blue-700">
            Learn language by predicting what comes next
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={charRnnExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The &quot;hello&quot; Example</h4>
            <p className="text-slate-700 mb-4">
              Consider training on the single word &quot;hello&quot;. At each position, the model must predict
              the next character:
            </p>
            <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 w-24">Input:</span>
                  <span className="text-blue-600 font-bold">&quot;h&quot;</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Target:</span>
                  <span className="text-green-600 font-bold">&quot;e&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 w-24">Input:</span>
                  <span className="text-blue-600 font-bold">&quot;he&quot;</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Target:</span>
                  <span className="text-green-600 font-bold">&quot;l&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 w-24">Input:</span>
                  <span className="text-blue-600 font-bold">&quot;hel&quot;</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Target:</span>
                  <span className="text-green-600 font-bold">&quot;l&quot;</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 w-24">Input:</span>
                  <span className="text-blue-600 font-bold">&quot;hell&quot;</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-slate-500">Target:</span>
                  <span className="text-green-600 font-bold">&quot;o&quot;</span>
                </div>
              </div>
            </div>
            <p className="text-slate-600 text-sm mt-4">
              The model learns: after &quot;h&quot;, &quot;e&quot; is likely. After &quot;hel&quot;, &quot;l&quot; is likely. After &quot;hell&quot;,
              &quot;o&quot; is likely. Scale this to millions of words, and the model learns language.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* One-Hot Encoding */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1: One-Hot Encoding</CardTitle>
          <CardDescription>
            Converting characters to vectors the network can process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            Neural networks work with numbers, not characters. We convert each character to a
            <strong> one-hot vector</strong>: a vector of zeros with a single 1 at the character&apos;s index.
          </p>

          <div className="rounded-lg border border-slate-200 p-4">
            <h5 className="font-medium text-slate-900 mb-3">Example: Vocabulary = {'{'}h, e, l, o{'}'}</h5>
            <div className="grid gap-3 font-mono text-sm">
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-blue-600">&apos;h&apos;</span>
                <span className="text-slate-400">→</span>
                <span className="bg-slate-100 px-3 py-1 rounded">[<span className="text-red-600 font-bold">1</span>, 0, 0, 0]</span>
                <span className="text-slate-500 text-xs">index 0</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-blue-600">&apos;e&apos;</span>
                <span className="text-slate-400">→</span>
                <span className="bg-slate-100 px-3 py-1 rounded">[0, <span className="text-red-600 font-bold">1</span>, 0, 0]</span>
                <span className="text-slate-500 text-xs">index 1</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-blue-600">&apos;l&apos;</span>
                <span className="text-slate-400">→</span>
                <span className="bg-slate-100 px-3 py-1 rounded">[0, 0, <span className="text-red-600 font-bold">1</span>, 0]</span>
                <span className="text-slate-500 text-xs">index 2</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-8 text-center font-bold text-blue-600">&apos;o&apos;</span>
                <span className="text-slate-400">→</span>
                <span className="bg-slate-100 px-3 py-1 rounded">[0, 0, 0, <span className="text-red-600 font-bold">1</span>]</span>
                <span className="text-slate-500 text-xs">index 3</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <h5 className="font-medium text-amber-900 mb-2">Why One-Hot?</h5>
            <p className="text-sm text-amber-800">
              One-hot encoding treats each character as equally different from every other character.
              &apos;a&apos; isn&apos;t &quot;closer&quot; to &apos;b&apos; than to &apos;z&apos; - they&apos;re all orthogonal vectors. The network
              learns meaningful relationships during training.
            </p>
          </div>

          <p className="text-slate-600 text-sm">
            For a vocabulary of <InlineEquation latex="V" /> characters, each input is a <InlineEquation latex="V" />-dimensional
            vector. Real character-level models might have <InlineEquation latex="V \approx 100" /> (letters,
            digits, punctuation). Byte-level models use <InlineEquation latex="V = 256" />.
          </p>
        </CardContent>
      </Card>

      {/* Cross-Entropy Loss */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2: Cross-Entropy Loss</CardTitle>
          <CardDescription>
            Measuring how wrong the model&apos;s predictions are
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            At each timestep, the model outputs a probability distribution over all possible next
            characters. We measure the quality of these predictions using <strong>cross-entropy loss</strong>:
          </p>

          <Equation
            latex="L = -\sum_{t=1}^{T} \log \color{#2563eb}{p(c_{t+1}|c_1...c_t)}"
            label="Cross-Entropy Loss"
            symbols={lossSymbols}
          />
          <p className="text-sm text-slate-600 mt-2">
            We sum the negative log-probability of the correct next character at each position.
            Lower loss = better predictions.
          </p>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Concrete Example</h4>
            <div className="rounded-lg border border-slate-200 p-4 space-y-4">
              <p className="text-slate-700">
                After seeing &quot;hel&quot;, suppose the model predicts:
              </p>
              <div className="grid gap-2 font-mono text-sm bg-slate-50 p-3 rounded">
                <div className="flex justify-between">
                  <span>p(&apos;l&apos;) = 0.7</span>
                  <span className="text-green-600">← correct!</span>
                </div>
                <div className="flex justify-between">
                  <span>p(&apos;o&apos;) = 0.1</span>
                  <span className="text-slate-400"></span>
                </div>
                <div className="flex justify-between">
                  <span>p(&apos;e&apos;) = 0.1</span>
                  <span className="text-slate-400"></span>
                </div>
                <div className="flex justify-between">
                  <span>p(&apos;h&apos;) = 0.1</span>
                  <span className="text-slate-400"></span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-blue-800">
                  Loss for this timestep: <InlineEquation latex="-\log(0.7) \approx 0.36" />
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  If the model had predicted p(&apos;l&apos;) = 0.99, loss would be ≈0.01 (much better!)
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 mt-4">
            <h5 className="font-medium text-slate-900 mb-2">Perplexity: A Human-Readable Metric</h5>
            <p className="text-slate-700 text-sm">
              <strong>Perplexity</strong> = <InlineEquation latex="e^{L/T}" /> (exponentiated average loss).
              It represents &quot;how many characters the model is confused between on average.&quot;
              A perplexity of 5 means the model is as uncertain as if randomly choosing between 5 characters.
              Good character models achieve perplexity around 1.5-2.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Temperature Sampling */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌡️</span>
            <span className="text-sm font-medium text-orange-700">Key Concept</span>
          </div>
          <CardTitle className="text-orange-900">Temperature-Scaled Sampling</CardTitle>
          <CardDescription className="text-orange-700">
            Controlling creativity vs. consistency in generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={temperatureExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Temperature Equation</h4>
            <Equation
              latex="p_i = \frac{e^{\color{#2563eb}{y_i}/\color{#ea580c}{\tau}}}{\sum_j e^{\color{#2563eb}{y_j}/\color{#ea580c}{\tau}}}"
              label="Temperature-Scaled Softmax"
              symbols={temperatureSymbols}
            />
            <p className="text-sm text-slate-600 mt-2">
              Dividing logits by temperature τ before softmax controls the &quot;sharpness&quot; of the distribution.
            </p>
          </div>

          {/* Temperature Comparison */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Temperature in Action</h4>
            <p className="text-slate-700 mb-4">
              Given logits [2.0, 1.0, 0.5, 0.1] for characters [&apos;e&apos;, &apos;a&apos;, &apos;i&apos;, &apos;o&apos;]:
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Low Temperature */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h5 className="font-medium text-blue-900 mb-2">τ = 0.5 (Focused)</h5>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>&apos;e&apos;:</span>
                    <span className="text-blue-700 font-bold">88%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;a&apos;:</span>
                    <span className="text-blue-600">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;i&apos;:</span>
                    <span className="text-blue-500">2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;o&apos;:</span>
                    <span className="text-blue-400">&lt;1%</span>
                  </div>
                </div>
                <p className="text-blue-700 text-xs mt-2 italic">
                  Almost always picks &apos;e&apos;
                </p>
              </div>

              {/* Normal Temperature */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h5 className="font-medium text-slate-900 mb-2">τ = 1.0 (Normal)</h5>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>&apos;e&apos;:</span>
                    <span className="text-slate-700 font-bold">54%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;a&apos;:</span>
                    <span className="text-slate-600">26%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;i&apos;:</span>
                    <span className="text-slate-500">13%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;o&apos;:</span>
                    <span className="text-slate-400">7%</span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs mt-2 italic">
                  Trained distribution
                </p>
              </div>

              {/* High Temperature */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <h5 className="font-medium text-orange-900 mb-2">τ = 2.0 (Creative)</h5>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>&apos;e&apos;:</span>
                    <span className="text-orange-700 font-bold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;a&apos;:</span>
                    <span className="text-orange-600">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;i&apos;:</span>
                    <span className="text-orange-500">21%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&apos;o&apos;:</span>
                    <span className="text-orange-400">16%</span>
                  </div>
                </div>
                <p className="text-orange-700 text-xs mt-2 italic">
                  More willing to try alternatives
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
            <h5 className="font-medium text-amber-900 mb-2">Connection to Modern AI</h5>
            <p className="text-amber-800 text-sm">
              When you set temperature in ChatGPT, Claude, or other AI assistants, you&apos;re adjusting
              this exact parameter. The underlying principle hasn&apos;t changed since Karpathy&apos;s
              character-level RNNs - it&apos;s just scaled to trillions of parameters and tokens instead
              of characters.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Training Process */}
      <Card>
        <CardHeader>
          <CardTitle>The Training Process</CardTitle>
          <CardDescription>
            How the model learns from data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-slate-50 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">1</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Feed a sequence</span>
                <p className="text-sm text-slate-600 mt-1">
                  Input characters one at a time, updating hidden state at each step
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-700">2</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Predict next character</span>
                <p className="text-sm text-slate-600 mt-1">
                  At each timestep, output probability distribution over vocabulary
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-medium text-red-700">3</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Compute loss</span>
                <p className="text-sm text-slate-600 mt-1">
                  Cross-entropy between predictions and actual next characters
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-700">4</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Backpropagate through time</span>
                <p className="text-sm text-slate-600 mt-1">
                  Compute gradients and update weights (W_hh, W_xh, W_hy)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-medium text-orange-700">5</span>
              <div className="flex-1">
                <span className="font-medium text-slate-900">Repeat millions of times</span>
                <p className="text-sm text-slate-600 mt-1">
                  Process different sequences, gradually improving predictions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">What the Model Learns</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Early Training</h5>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Common letter frequencies</li>
                  <li>• Basic letter combinations (&quot;th&quot;, &quot;qu&quot;)</li>
                  <li>• Word boundaries (spaces)</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <h5 className="font-medium text-slate-900 mb-2">Later Training</h5>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• Complete words and spelling</li>
                  <li>• Grammar and sentence structure</li>
                  <li>• Style and long-range patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generating Text */}
      <Card>
        <CardHeader>
          <CardTitle>Generating Text</CardTitle>
          <CardDescription>
            Sampling from the trained model
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            Once trained, we can generate text by sampling from the model&apos;s predictions:
          </p>

          <div className="rounded-lg bg-slate-50 p-4 font-mono text-sm space-y-3">
            <div className="text-slate-500"># Generation loop</div>
            <div><span className="text-blue-600">seed</span> = <span className="text-green-600">&quot;The &quot;</span></div>
            <div><span className="text-purple-600">for</span> i <span className="text-purple-600">in</span> range(100):</div>
            <div className="pl-4">probabilities = model(seed)</div>
            <div className="pl-4">next_char = sample(probabilities, temperature=τ)</div>
            <div className="pl-4">seed = seed + next_char</div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Sample Outputs by Temperature</h4>
            <p className="text-slate-600 text-sm mb-4">
              Same Shakespeare-trained model, different temperatures:
            </p>
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-blue-200 text-blue-800 px-2 py-0.5 rounded">τ = 0.5</span>
                  <span className="text-xs text-blue-700">Conservative</span>
                </div>
                <p className="font-mono text-sm text-blue-900">
                  &quot;The king is the more the state of the state of the people...&quot;
                </p>
                <p className="text-xs text-blue-600 mt-1">Coherent but repetitive</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-slate-200 text-slate-800 px-2 py-0.5 rounded">τ = 1.0</span>
                  <span className="text-xs text-slate-700">Balanced</span>
                </div>
                <p className="font-mono text-sm text-slate-900">
                  &quot;The king doth wake to-night and takes his rouse, keeps wassail...&quot;
                </p>
                <p className="text-xs text-slate-600 mt-1">Good variety and coherence</p>
              </div>
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium bg-orange-200 text-orange-800 px-2 py-0.5 rounded">τ = 1.5</span>
                  <span className="text-xs text-orange-700">Creative</span>
                </div>
                <p className="font-mono text-sm text-orange-900">
                  &quot;The kinghBrol&apos;d-Loss?ump thee, veck&apos;d shalg remond...&quot;
                </p>
                <p className="text-xs text-orange-600 mt-1">Creative but less coherent</p>
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
            The Unreasonable Power of Next-Token Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            The remarkable thing about character-level modeling is how much emerges from such a
            simple objective. The model isn&apos;t explicitly taught spelling, grammar, or style - it
            learns all of these as a byproduct of predicting the next character well.
          </p>

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">What We Teach</h5>
              <p className="text-sm text-amber-800">
                &quot;Given these characters, predict the next one&quot;
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white/50 p-4">
              <h5 className="font-medium text-amber-900 mb-2">What It Learns</h5>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Spelling and vocabulary</li>
                <li>• Grammar and syntax</li>
                <li>• Style and voice</li>
                <li>• Long-range coherence</li>
              </ul>
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed mt-4">
            This same principle - scaled from characters to tokens, from megabytes to terabytes,
            from single GPUs to massive clusters - is what powers today&apos;s large language models.
            The foundation is exactly what you&apos;ve learned in this module.
          </p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Key Equations</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li><strong>Loss:</strong> <InlineEquation latex="L = -\sum \log p(c_{t+1})" /></li>
                <li><strong>Temperature:</strong> <InlineEquation latex="p_i = \frac{e^{y_i/\tau}}{\sum e^{y_j/\tau}}" /></li>
                <li><strong>Perplexity:</strong> <InlineEquation latex="PPL = e^{L/T}" /></li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Key Concepts</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• One-hot encoding for characters</li>
                <li>• Cross-entropy measures prediction quality</li>
                <li>• Temperature controls creativity vs. consistency</li>
                <li>• Autoregressive generation (feed output back as input)</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            In the next module, we&apos;ll see what happens when we apply this technique to different
            types of data - from Shakespeare to Wikipedia to Linux source code - and explore the
            surprising capabilities that emerge.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Module4Content
