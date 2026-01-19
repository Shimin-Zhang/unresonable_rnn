'use client'

import { Equation, InlineEquation } from '@/components/equations'
import type { SymbolDefinition } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'
import { Quiz } from '@/components/interactive/quiz/Quiz'
import { MODULE_7_QUIZ } from '@/content/module-7/quiz'

// Symbol definitions for attention score equation
const attentionScoreSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#dc2626}{e_{t,i}}',
    color: 'red',
    meaning: 'Attention score (energy)',
    details: 'Raw score indicating how relevant encoder state i is for decoder step t',
  },
  {
    symbol: '\\color{#2563eb}{s_{t-1}}',
    color: 'blue',
    meaning: 'Decoder hidden state',
    details: 'The decoder state from previous timestep - represents what we are trying to generate',
  },
  {
    symbol: '\\color{#16a34a}{h_i}',
    color: 'green',
    meaning: 'Encoder hidden state i',
    details: 'The encoder representation of the i-th input position',
  },
  {
    symbol: '\\color{#9333ea}{a}',
    color: 'purple',
    meaning: 'Alignment model',
    details: 'A small neural network (often MLP) that scores compatibility',
  },
]

// Symbol definitions for attention weights equation
const attentionWeightSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#ea580c}{\\alpha_{t,i}}',
    color: 'orange',
    meaning: 'Attention weight',
    details: 'Normalized probability of attending to encoder position i at decoder step t',
  },
  {
    symbol: '\\color{#dc2626}{e_{t,i}}',
    color: 'red',
    meaning: 'Attention score',
    details: 'Raw score before normalization',
  },
  {
    symbol: '\\color{#9333ea}{\\text{softmax}}',
    color: 'purple',
    meaning: 'Softmax function',
    details: 'Normalizes scores to probabilities that sum to 1',
  },
]

// Symbol definitions for context vector equation
const contextVectorSymbols: SymbolDefinition[] = [
  {
    symbol: '\\color{#0891b2}{c_t}',
    color: 'cyan',
    meaning: 'Context vector',
    details: 'Weighted sum of encoder states - dynamic summary for current decoder step',
  },
  {
    symbol: '\\color{#ea580c}{\\alpha_{t,i}}',
    color: 'orange',
    meaning: 'Attention weight',
    details: 'How much to attend to position i',
  },
  {
    symbol: '\\color{#16a34a}{h_i}',
    color: 'green',
    meaning: 'Encoder hidden state',
    details: 'Representation of input at position i',
  },
]

// Stakeholder explanations for the bottleneck problem
const bottleneckExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'The Phone Game Problem',
    content: 'Imagine playing telephone: someone whispers a long story to you, and you have to remember everything in one thought before passing it on. Naturally, you will forget details. That is exactly what happens when an encoder compresses an entire sentence into a single vector - information gets lost, especially for long sentences.',
  },
  {
    audience: 'business',
    label: 'Why Translation Quality Degraded',
    content: 'Early neural translation systems worked well for short sentences but degraded sharply on longer ones. A 50-word sentence had to be compressed into the same fixed-size vector as a 5-word sentence. This bottleneck limited production quality until attention mechanisms allowed the decoder to "look back" at the full input.',
  },
  {
    audience: 'technical',
    label: 'Information Bottleneck',
    content: 'In seq2seq, the encoder final state h_n must contain all information from x_1...x_n. As sequence length grows, this fixed-dimensional vector becomes increasingly lossy. BLEU scores showed clear degradation beyond 20-30 tokens. The bottleneck also complicates gradient flow for early input positions.',
  },
]

// Stakeholder explanations for attention
const attentionExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Looking Back at the Source',
    content: 'Instead of trying to remember everything at once, imagine you could look back at the original text while translating. For each word you write, you glance at the relevant parts of the source. That is attention - the decoder "attends" to different parts of the input for each output word.',
  },
  {
    audience: 'business',
    label: 'The Breakthrough',
    content: 'Attention mechanisms eliminated the bottleneck problem and dramatically improved translation quality. Google\'s 2016 neural translation system with attention achieved the largest quality improvement in the product\'s history. The same mechanism now powers virtually all modern AI systems including GPT and BERT.',
  },
  {
    audience: 'technical',
    label: 'Dynamic Context Vectors',
    content: 'Instead of a single context vector, attention computes a weighted combination of all encoder states for each decoder step. The weights alpha_{t,i} = softmax(e_{t,i}) are learned, allowing the model to discover which source positions are relevant for generating each target position. This is differentiable and trained end-to-end.',
  },
]

// Stakeholder explanations for soft vs hard attention
const softHardExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'Spotlight vs Flashlight',
    content: 'Hard attention is like pointing a spotlight at one spot - you either look at something or you do not. Soft attention is like a flashlight beam that can spread across multiple things at once, with brighter light on more important parts. Soft attention is easier to train because the "soft" gradients flow smoothly.',
  },
  {
    audience: 'business',
    label: 'Practical Tradeoffs',
    content: 'Soft attention is used in production systems because it is easier to train with standard backpropagation. Hard attention can be more interpretable (clearly showing what the model looked at) but requires special training techniques like reinforcement learning, making it less practical for most applications.',
  },
  {
    audience: 'technical',
    label: 'Differentiability',
    content: 'Soft attention uses a weighted average (differentiable), enabling standard backprop. Hard attention samples discrete positions (non-differentiable), requiring REINFORCE or other variance-reduction techniques. Soft attention dominates in practice. The expected gradient of soft attention approximates hard attention\'s behavior.',
  },
]

// Stakeholder explanations for Transformers bridge
const transformerExplanations: ExplanationItem[] = [
  {
    audience: 'casual',
    label: 'The Foundation of Modern AI',
    content: 'Attention was so powerful that researchers asked: what if we used ONLY attention, without the RNN? That is the Transformer - attention all the way down. ChatGPT, Google Search, and almost every modern AI system is built on Transformers, which are really just sophisticated attention mechanisms.',
  },
  {
    audience: 'business',
    label: 'Why This Matters',
    content: 'Understanding attention is understanding the core of modern AI. Every major language model (GPT-4, Claude, Gemini) is built on attention. The 2017 paper "Attention Is All You Need" is the most influential AI paper of the decade. Attention mechanisms are the foundation of the current AI revolution.',
  },
  {
    audience: 'technical',
    label: 'From RNN+Attention to Self-Attention',
    content: 'Transformers replace recurrence with self-attention: each position attends to all other positions in parallel. This enables massive parallelization (no sequential dependency) and better gradient flow. Multi-head attention allows attending to different representation subspaces. The key innovation: attention can replace, not just augment, sequential processing.',
  },
]

export function Module7Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 7: Attention Mechanisms - The Most Important Innovation</CardTitle>
          <CardDescription>
            As Karpathy noted: &quot;the most interesting recent architectural innovation&quot;
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            In the previous module, we saw how encoder-decoder architectures enabled transforming
            one sequence into another. But we also encountered a fundamental limitation: the
            <strong> bottleneck problem</strong>. All information about the input had to be
            compressed into a single fixed-size vector.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Attention mechanisms solve this problem elegantly by allowing the decoder to
            &quot;look back&quot; at the entire input sequence. This innovation is so important that
            it became the foundation of modern AI - the Transformer architecture is essentially
            attention without the RNN.
          </p>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mt-4">
            <p className="text-amber-900 text-sm font-medium">
              &quot;I think attention is one of the most interesting recent architectural innovations
              in neural networks.&quot; - Andrej Karpathy
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The Bottleneck Problem */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚧</span>
            <span className="text-sm font-medium text-red-700">The Problem</span>
          </div>
          <CardTitle className="text-red-900">The Bottleneck Problem</CardTitle>
          <CardDescription className="text-red-700">
            Why fixed-size context vectors limit performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={bottleneckExplanations} />

          <div className="mt-6 rounded-lg bg-slate-50 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Compression Challenge</h4>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 font-mono text-sm">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded mb-2">
                  &quot;The quick brown fox jumps over the lazy dog near the river bank&quot;
                </div>
                <span className="text-xs text-slate-500">14 words of input</span>
              </div>
              <span className="text-2xl text-slate-400">→</span>
              <div className="text-center">
                <div className="bg-purple-200 text-purple-900 px-4 py-3 rounded-full font-bold">
                  h ∈ ℝ⁵¹²
                </div>
                <span className="text-xs text-slate-500">Single 512-dim vector</span>
              </div>
              <span className="text-2xl text-slate-400">→</span>
              <div className="text-center">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded mb-2">
                  Generate translation...
                </div>
                <span className="text-xs text-slate-500">From compressed context</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4 text-center">
              The same vector size must capture a 5-word sentence or a 50-word paragraph
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <h5 className="font-medium text-red-900 mb-2">Empirical Evidence</h5>
            <p className="text-red-800 text-sm">
              Research showed that BLEU scores (translation quality) degraded significantly for
              sentences longer than 20-30 words. The decoder simply could not recover all the
              necessary information from the compressed context vector.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* The Attention Solution */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">💡</span>
            <span className="text-sm font-medium text-green-700">The Solution</span>
          </div>
          <CardTitle className="text-green-900">Attention: Looking Back at the Source</CardTitle>
          <CardDescription className="text-green-700">
            Let the decoder access all encoder states, not just the final one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={attentionExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Three Steps of Attention</h4>

            {/* Step 1: Score */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">1</span>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900 mb-2">Score: How relevant is each encoder state?</h5>
                  <Equation
                    latex="e_{t,i} = a(s_{t-1}, h_i)"
                    label="Attention Score"
                    symbols={attentionScoreSymbols}
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    For each decoder step t, compute a score for each encoder position i.
                    The alignment model <InlineEquation latex="a" /> is typically a small neural network.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Normalize */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">2</span>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900 mb-2">Normalize: Convert scores to probabilities</h5>
                  <Equation
                    latex="\\alpha_{t,i} = \\frac{\\exp(e_{t,i})}{\\sum_{j=1}^{n} \\exp(e_{t,j})}"
                    label="Attention Weights"
                    symbols={attentionWeightSymbols}
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    Softmax ensures weights sum to 1, creating a probability distribution over
                    encoder positions. High scores become high weights.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3: Combine */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">3</span>
                <div className="flex-1">
                  <h5 className="font-medium text-slate-900 mb-2">Combine: Weighted sum of encoder states</h5>
                  <Equation
                    latex="c_t = \\sum_{i=1}^{n} \\alpha_{t,i} \\cdot h_i"
                    label="Context Vector"
                    symbols={contextVectorSymbols}
                  />
                  <p className="text-sm text-slate-600 mt-3">
                    The context vector is a weighted combination of all encoder states.
                    Unlike the fixed bottleneck, this is <strong>different for each decoder step</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual representation */}
          <div className="mt-6 rounded-lg bg-slate-50 p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Attention in Action: Translation</h4>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-700 font-bold w-20">Source:</span>
                <span className="bg-blue-100 px-2 py-1 rounded">Le</span>
                <span className="bg-blue-100 px-2 py-1 rounded">chat</span>
                <span className="bg-blue-100 px-2 py-1 rounded">noir</span>
                <span className="bg-blue-100 px-2 py-1 rounded">dort</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-700 font-bold w-20">Target:</span>
                <span className="bg-green-100 px-2 py-1 rounded">The</span>
                <span className="bg-green-200 px-2 py-1 rounded border-2 border-green-500">black</span>
                <span className="bg-green-100 px-2 py-1 rounded">cat</span>
                <span className="bg-green-100 px-2 py-1 rounded">sleeps</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-purple-700 font-bold w-20">Attention:</span>
                <span className="bg-purple-50 px-2 py-1 rounded opacity-30">0.05</span>
                <span className="bg-purple-50 px-2 py-1 rounded opacity-50">0.10</span>
                <span className="bg-purple-300 px-2 py-1 rounded font-bold">0.80</span>
                <span className="bg-purple-50 px-2 py-1 rounded opacity-30">0.05</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-4">
              When generating &quot;black&quot;, the model attends strongly to &quot;noir&quot; (0.80) -
              the French word for black. Different output words attend to different parts of the input.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Soft vs Hard Attention */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚖️</span>
            <span className="text-sm font-medium text-slate-700">Comparison</span>
          </div>
          <CardTitle>Soft vs Hard Attention</CardTitle>
          <CardDescription>
            Two approaches to implementing attention
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={softHardExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Side-by-Side Comparison</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <h5 className="font-bold text-blue-900 mb-3">Soft Attention</h5>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">+</span>
                    Differentiable - standard backprop
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">+</span>
                    Easy to train end-to-end
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">+</span>
                    Weighted average of all positions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">−</span>
                    Less interpretable (soft weights)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">−</span>
                    Computes over all positions (O(n))
                  </li>
                </ul>
                <div className="mt-3 bg-blue-100 p-2 rounded text-xs font-mono">
                  <InlineEquation latex="c_t = \\sum_i \\alpha_i h_i" /> (weighted sum)
                </div>
              </div>

              <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-4">
                <h5 className="font-bold text-purple-900 mb-3">Hard Attention</h5>
                <ul className="space-y-2 text-sm text-purple-800">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">+</span>
                    More interpretable (discrete choice)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">+</span>
                    Only reads one position (efficient)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">+</span>
                    Clear attention visualization
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">−</span>
                    Non-differentiable (needs REINFORCE)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">−</span>
                    High variance gradients
                  </li>
                </ul>
                <div className="mt-3 bg-purple-100 p-2 rounded text-xs font-mono">
                  <InlineEquation latex="c_t = h_{\\text{argmax}_i(\\alpha_i)}" /> (single selection)
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
              <h5 className="font-medium text-green-900 mb-2">Practical Reality</h5>
              <p className="text-green-800 text-sm">
                Soft attention dominates in practice because it is easier to train. The slight
                loss in interpretability is worth the dramatic improvement in optimization stability.
                When you hear &quot;attention&quot; in modern AI, it almost always means soft attention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neural Turing Machines and Memory Networks */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧠</span>
            <span className="text-sm font-medium text-slate-700">Advanced Concepts</span>
          </div>
          <CardTitle>Neural Turing Machines and Memory Networks</CardTitle>
          <CardDescription>
            Taking attention further: differentiable memory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            Attention opened the door to a powerful idea: what if neural networks could have
            <strong> external memory</strong> that they read from and write to? This led to
            Neural Turing Machines (NTMs) and Memory Networks - architectures that use attention
            as a mechanism for memory access.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h5 className="font-bold text-slate-900 mb-3">Neural Turing Machines (2014)</h5>
              <p className="text-sm text-slate-600 mb-3">
                NTMs augment neural networks with an external memory matrix. The network learns
                to read from and write to memory using attention-based addressing.
              </p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Content-based addressing (attention over memory)</li>
                <li>• Location-based addressing (shifting focus)</li>
                <li>• Differentiable read/write operations</li>
                <li>• Can learn algorithms (copying, sorting)</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h5 className="font-bold text-slate-900 mb-3">Memory Networks (2014)</h5>
              <p className="text-sm text-slate-600 mb-3">
                Memory Networks store facts in memory slots and use attention to retrieve
                relevant information for question answering.
              </p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>• Memory = collection of embeddings</li>
                <li>• Input → attention over memories</li>
                <li>• Multiple &quot;hops&quot; for multi-step reasoning</li>
                <li>• Foundation for later retrieval-augmented models</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 p-4">
            <h5 className="font-medium text-slate-900 mb-2">The Key Insight</h5>
            <p className="text-slate-700 text-sm">
              Attention is not just for sequence-to-sequence translation - it is a general
              mechanism for <strong>differentiable information retrieval</strong>. Given a query,
              attention computes relevance scores and retrieves a weighted combination of values.
              This abstraction underlies modern language models&apos; ability to &quot;remember&quot; context.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bridge to Transformers */}
      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌉</span>
            <span className="text-sm font-medium text-amber-700">The Future</span>
          </div>
          <CardTitle className="text-amber-900">The Bridge to Transformers</CardTitle>
          <CardDescription className="text-amber-700">
            &quot;Attention Is All You Need&quot; (2017)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={transformerExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">The Evolution</h4>
            <div className="rounded-lg bg-white/50 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-600">2014</div>
                  <div className="flex-1 bg-blue-100 rounded p-2 text-sm">
                    <strong>RNN + Attention:</strong> Sequential processing, attention helps decoder
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-600">2015-16</div>
                  <div className="flex-1 bg-purple-100 rounded p-2 text-sm">
                    <strong>Better Attention:</strong> Multi-layer, bidirectional, more sophisticated
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-600">2017</div>
                  <div className="flex-1 bg-green-100 rounded p-2 text-sm">
                    <strong>Transformer:</strong> Remove RNN entirely, use only self-attention
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-slate-600">2018+</div>
                  <div className="flex-1 bg-amber-100 rounded p-2 text-sm">
                    <strong>BERT, GPT, etc:</strong> Scale up Transformers → modern LLMs
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-white/50 p-4">
            <h5 className="font-medium text-amber-900 mb-2">Self-Attention: The Key Innovation</h5>
            <p className="text-amber-800 text-sm mb-3">
              In self-attention, a sequence attends to itself. Each position can directly
              attend to every other position, enabling parallel computation and better
              gradient flow than recurrence.
            </p>
            <div className="bg-amber-50 p-3 rounded font-mono text-sm">
              <p className="text-amber-900">Traditional: h_t = f(h_&#123;t-1&#125;, x_t) — must wait for h_&#123;t-1&#125;</p>
              <p className="text-amber-900 mt-1">Self-Attention: h_i = Attention(x_i, X, X) — all in parallel</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-300 p-4">
            <h5 className="font-bold text-amber-900 mb-2">The Takeaway</h5>
            <p className="text-amber-800">
              Understanding attention is understanding the core of modern AI. Every ChatGPT response,
              every Google search ranking, every code completion - they all use attention at their core.
              Attention mechanisms are truly the most important innovation in neural network architecture.
            </p>
          </div>
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
                <li><strong>Score:</strong> <InlineEquation latex="e_{t,i} = a(s_{t-1}, h_i)" /></li>
                <li><strong>Weights:</strong> <InlineEquation latex="\\alpha_{t,i} = \\text{softmax}(e_{t,i})" /></li>
                <li><strong>Context:</strong> <InlineEquation latex="c_t = \\sum_i \\alpha_{t,i} h_i" /></li>
              </ul>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h5 className="font-semibold text-slate-900 mb-3">Key Concepts</h5>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• <strong>Bottleneck:</strong> Fixed context vector limits capacity</li>
                <li>• <strong>Attention:</strong> Dynamic, weighted access to all states</li>
                <li>• <strong>Soft vs Hard:</strong> Differentiable vs discrete selection</li>
                <li>• <strong>Self-attention:</strong> Foundation of Transformers</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            In the next module, we will examine the limitations of RNNs and understand when
            to use them versus modern Transformer-based architectures.
          </p>
        </CardContent>
      </Card>

      {/* Knowledge Check Quiz */}
      <Card>
        <CardHeader>
          <CardTitle>Test Your Knowledge</CardTitle>
          <CardDescription>
            Check your understanding of attention mechanisms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Quiz config={MODULE_7_QUIZ} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Module7Content
