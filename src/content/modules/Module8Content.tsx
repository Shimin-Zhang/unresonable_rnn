'use client'

import { InlineEquation } from '@/components/equations'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, ExplanationCards } from '@/components/ui'
import type { ExplanationItem } from '@/components/ui'
import { Quiz } from '@/components/interactive/quiz/Quiz'
import { MODULE_8_QUIZ } from '@/content/module-8/quiz'

// Stakeholder explanations for RNN limitations
const limitationsExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'Why This Matters for Decisions',
    content: 'Understanding RNN limitations helps you make informed build-vs-buy decisions. RNNs are still valuable for certain use cases (streaming data, edge devices), but Transformers dominate most NLP tasks. Knowing when each applies prevents costly architectural mistakes.',
  },
  {
    audience: 'technical',
    label: 'The Fundamental Trade-offs',
    content: 'RNNs process sequences sequentially, which limits parallelization and creates information bottlenecks for long sequences. Transformers solve this with self-attention (O(n²) memory but fully parallel), enabling massive scale. However, RNNs have O(1) memory per step, making them ideal for infinite streams.',
  },
  {
    audience: 'casual',
    label: 'Old vs New Technology',
    content: 'RNNs are like reading a book one word at a time and trying to remember everything. Transformers are like having the whole book open and being able to look at any page instantly. Transformers are faster and remember better, but need more resources.',
  },
]

// Stakeholder explanations for Transformers
const transformerExplanations: ExplanationItem[] = [
  {
    audience: 'business',
    label: 'The AI Revolution',
    content: 'Transformers power ChatGPT, Claude, Google Search, and most modern AI. They enabled 1000x scale-up from RNNs. If you are evaluating AI solutions, almost all cutting-edge NLP uses Transformers. RNNs remain relevant for specific niches.',
  },
  {
    audience: 'technical',
    label: 'Attention Is All You Need',
    content: 'The 2017 Transformer paper replaced recurrence with self-attention. Key innovations: positional encodings (no sequential processing needed), multi-head attention (parallel relationship modeling), and layer normalization. This enabled training on thousands of GPUs simultaneously.',
  },
  {
    audience: 'casual',
    label: 'The Game Changer',
    content: 'Imagine RNNs as a single person reading documents one at a time. Transformers are like having thousands of people each read different parts simultaneously, then share notes. This parallelism made AI much more powerful.',
  },
]

export function Module8Content() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle>Module 8: Limitations and the Path Forward</CardTitle>
          <CardDescription>
            Understanding RNN constraints and the rise of Transformers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            RNNs were revolutionary, but they have fundamental limitations that became apparent
            as researchers pushed for larger models and longer sequences. This module covers
            these limitations honestly, explains how Transformers addressed them, and helps you
            decide when RNNs are still the right choice.
          </p>
          <p className="text-slate-700 leading-relaxed">
            As Karpathy noted: <em>&quot;RNNs are a special case of a more general model.&quot;</em> Understanding
            both the limitations and the evolution helps you make better architectural decisions.
          </p>
        </CardContent>
      </Card>

      {/* Stakeholder Context */}
      <ExplanationCards items={limitationsExplanations} title="Why Limitations Matter" />

      {/* The 4 Key Limitations */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚠️</span>
            <span className="text-sm font-medium text-red-700">Critical Constraints</span>
          </div>
          <CardTitle className="text-red-900">4 Fundamental RNN Limitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Limitation 1 */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-200 text-sm font-semibold text-red-800">1</span>
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 mb-2">Very Long-Range Dependencies</h4>
                <p className="text-red-800 text-sm mb-3">
                  Despite LSTMs, RNNs still struggle with dependencies spanning hundreds or thousands of timesteps.
                  The information must pass through every intermediate step, degrading along the way.
                </p>
                <div className="bg-white/50 rounded p-3 text-sm">
                  <p className="text-red-700">
                    <strong>Example:</strong> In a 10,000-word document, connecting the first paragraph
                    to the conclusion requires information to flow through all intermediate states.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation 2 */}
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 text-sm font-semibold text-orange-800">2</span>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-2">Sequential Processing Bottleneck</h4>
                <p className="text-orange-800 text-sm mb-3">
                  RNNs must process sequences one step at a time. Each hidden state depends on the previous one,
                  making parallelization impossible during training.
                </p>
                <div className="bg-white/50 rounded p-3 text-sm">
                  <p className="text-orange-700">
                    <strong>Impact:</strong> Training time scales linearly with sequence length.
                    A 1000-token sequence takes 1000 sequential operations, regardless of available GPUs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation 3 */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-800">3</span>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-900 mb-2">Representation Coupling</h4>
                <p className="text-amber-800 text-sm mb-3">
                  The hidden state must simultaneously encode what to output now AND what to remember for later.
                  These competing demands limit expressiveness.
                </p>
                <div className="bg-white/50 rounded p-3 text-sm">
                  <p className="text-amber-700">
                    <strong>Karpathy:</strong> &quot;The hidden state has to do double duty - it must represent
                    both the output and the memory. This coupling limits what the network can express.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limitation 4 */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 text-sm font-semibold text-yellow-800">4</span>
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2">Training Instability</h4>
                <p className="text-yellow-800 text-sm mb-3">
                  Even with gradient clipping and careful initialization, RNN training can be unstable.
                  Exploding/vanishing gradients, mode collapse, and sensitivity to hyperparameters are common.
                </p>
                <div className="bg-white/50 rounded p-3 text-sm">
                  <p className="text-yellow-700">
                    <strong>Practical:</strong> RNN training often requires extensive hyperparameter tuning.
                    Learning rate, gradient clip value, hidden size all interact in complex ways.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Transformer Revolution */}
      <Card className="border-2 border-green-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-medium text-green-700">The Solution</span>
          </div>
          <CardTitle className="text-green-900">The Transformer Revolution (2017)</CardTitle>
          <CardDescription className="text-green-700">
            &quot;Attention Is All You Need&quot; - Vaswani et al.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ExplanationCards items={transformerExplanations} />

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">How Transformers Solve RNN Limitations</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 pr-4 font-medium">RNN Limitation</th>
                    <th className="text-left py-3 pr-4 font-medium">Transformer Solution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-red-700">Long-range dependencies degrade</td>
                    <td className="py-3 pr-4 text-green-700">Direct attention to any position (O(1) path length)</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-red-700">Sequential processing bottleneck</td>
                    <td className="py-3 pr-4 text-green-700">Fully parallel attention computation</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-red-700">Representation coupling</td>
                    <td className="py-3 pr-4 text-green-700">Separate Query/Key/Value projections</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-red-700">Training instability</td>
                    <td className="py-3 pr-4 text-green-700">Layer norm + residual connections</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg bg-green-100 border border-green-300 p-4 mt-6">
            <h5 className="font-medium text-green-900 mb-2">The Scale Revolution</h5>
            <p className="text-green-800 text-sm">
              Transformers enabled training on thousands of GPUs simultaneously. GPT-3 has 175B parameters;
              the largest RNNs were ~1B. This 100x+ scale difference, combined with architectural improvements,
              drove the modern AI revolution.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* When to Still Use RNNs */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-blue-700">Practical Guidance</span>
          </div>
          <CardTitle className="text-blue-900">When RNNs Are Still the Right Choice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-slate-700 leading-relaxed">
            Despite Transformer dominance, RNNs remain valuable in specific scenarios:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">✓ Streaming/Real-time Data</h5>
              <p className="text-blue-800 text-sm">
                RNNs process one token at a time with O(1) memory per step. Ideal for infinite streams
                like sensor data, live audio, or real-time translation where you cannot wait for the full sequence.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">✓ Memory-Constrained Devices</h5>
              <p className="text-blue-800 text-sm">
                Transformers need O(n²) memory for attention. On edge devices or microcontrollers,
                RNNs are fixed-size models that fit in limited RAM.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">✓ Very Long Sequences</h5>
              <p className="text-blue-800 text-sm">
                For sequences of 100K+ tokens, Transformer attention becomes prohibitively expensive.
                RNNs (especially state-space models like Mamba) handle arbitrary length efficiently.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h5 className="font-semibold text-blue-900 mb-2">✓ Latency-Critical Applications</h5>
              <p className="text-blue-800 text-sm">
                For real-time applications where every millisecond matters, RNNs&apos; constant-time
                inference per step can outperform Transformers&apos; batch processing.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Build vs Buy Decision Framework */}
      <Card className="border-2 border-purple-200">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔀</span>
            <span className="text-sm font-medium text-purple-700">Decision Framework</span>
          </div>
          <CardTitle className="text-purple-900">Build vs Buy: Choosing Your Architecture</CardTitle>
          <CardDescription className="text-purple-700">
            A practical decision tree for working professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Decision Tree */}
          <div className="rounded-lg bg-slate-50 p-6">
            <h4 className="font-semibold text-slate-900 mb-4 text-center">Architecture Decision Tree</h4>
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900 mb-2">Q1: Is this a standard NLP task (classification, generation, QA)?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-green-700">→ <strong>YES:</strong> Use pretrained Transformer (GPT, BERT, Claude API)</p>
                  <p className="text-blue-700">→ <strong>NO:</strong> Continue to Q2</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900 mb-2">Q2: Do you need real-time streaming or infinite sequences?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-green-700">→ <strong>YES:</strong> Consider RNN/LSTM or State-Space Models (Mamba)</p>
                  <p className="text-blue-700">→ <strong>NO:</strong> Continue to Q3</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900 mb-2">Q3: Are you deploying to memory-constrained edge devices?</p>
                <div className="ml-4 space-y-2">
                  <p className="text-green-700">→ <strong>YES:</strong> Consider quantized RNN or tiny Transformer</p>
                  <p className="text-blue-700">→ <strong>NO:</strong> Use Transformer (likely via API)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Comparison */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Cost Comparison</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-medium">Approach</th>
                    <th className="text-left py-3 px-4 font-medium">Dev Time</th>
                    <th className="text-left py-3 px-4 font-medium">Compute Cost</th>
                    <th className="text-left py-3 px-4 font-medium">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">API (Claude, GPT)</td>
                    <td className="py-3 px-4 text-green-700">Hours</td>
                    <td className="py-3 px-4 text-amber-700">Pay per token</td>
                    <td className="py-3 px-4">Most NLP tasks, prototyping</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Fine-tune Transformer</td>
                    <td className="py-3 px-4 text-amber-700">Days-Weeks</td>
                    <td className="py-3 px-4 text-amber-700">GPU hours (s-s)</td>
                    <td className="py-3 px-4">Domain-specific, proprietary data</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Train RNN from scratch</td>
                    <td className="py-3 px-4 text-red-700">Weeks</td>
                    <td className="py-3 px-4 text-green-700">Moderate (s-s)</td>
                    <td className="py-3 px-4">Streaming, edge, learning</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Train Transformer from scratch</td>
                    <td className="py-3 px-4 text-red-700">Months</td>
                    <td className="py-3 px-4 text-red-700">Massive (Ks+)</td>
                    <td className="py-3 px-4">Research, massive scale</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📅</span>
            <span className="text-sm font-medium text-slate-600">Historical Context</span>
          </div>
          <CardTitle>Sequence Model Evolution Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">1997</div>
              <div className="flex-1 rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">LSTM Introduced</p>
                <p className="text-sm text-slate-600">Hochreiter & Schmidhuber solve vanishing gradients</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">2014</div>
              <div className="flex-1 rounded-lg border border-slate-200 p-3">
                <p className="font-medium text-slate-900">Seq2Seq & Attention</p>
                <p className="text-sm text-slate-600">RNNs dominate NLP; attention mechanism introduced</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">2015</div>
              <div className="flex-1 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="font-medium text-blue-900">Karpathy&apos;s char-rnn</p>
                <p className="text-sm text-blue-700">&quot;The Unreasonable Effectiveness of RNNs&quot; published</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">2017</div>
              <div className="flex-1 rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="font-medium text-green-900">Transformer Paper</p>
                <p className="text-sm text-green-700">&quot;Attention Is All You Need&quot; - paradigm shift begins</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">2018+</div>
              <div className="flex-1 rounded-lg border border-purple-200 bg-purple-50 p-3">
                <p className="font-medium text-purple-900">Transformer Era</p>
                <p className="text-sm text-purple-700">BERT, GPT, T5 - Transformers dominate NLP</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-20 text-right text-sm font-medium text-slate-500">2023+</div>
              <div className="flex-1 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="font-medium text-amber-900">State-Space Models</p>
                <p className="text-sm text-amber-700">Mamba and others: RNN-like efficiency + Transformer quality</p>
              </div>
            </div>
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
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h5 className="font-semibold text-red-900 mb-3">RNN Limitations</h5>
              <ul className="space-y-2 text-sm text-red-800">
                <li>• Long-range dependencies still challenging</li>
                <li>• Sequential processing limits parallelism</li>
                <li>• Representation coupling reduces expressiveness</li>
                <li>• Training can be unstable</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h5 className="font-semibold text-green-900 mb-3">When RNNs Still Win</h5>
              <ul className="space-y-2 text-sm text-green-800">
                <li>• Real-time streaming data</li>
                <li>• Memory-constrained edge devices</li>
                <li>• Very long sequences (100K+ tokens)</li>
                <li>• Latency-critical applications</li>
              </ul>
            </div>
          </div>
          <p className="text-slate-600 text-sm mt-4">
            In the next module, we will dive into implementation details - how to actually build and train
            these models from scratch using NumPy, PyTorch, or Hugging Face.
          </p>
        </CardContent>
      </Card>

      {/* Knowledge Check Quiz */}
      <Card>
        <CardHeader>
          <CardTitle>Test Your Knowledge</CardTitle>
          <CardDescription>
            Check your understanding of RNN limitations and the modern landscape
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Quiz config={MODULE_8_QUIZ} />
        </CardContent>
      </Card>
    </div>
  )
}

export default Module8Content
