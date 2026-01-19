'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { MODULES } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { BadgeNotificationContainer } from '@/components/gamification'

// =============================================================================
// DATA: RNN Limitations
// =============================================================================

const rnnLimitations = [
  {
    id: 'long-range',
    title: 'Very Long-Range Dependencies',
    icon: '📏',
    severity: 'critical',
    description:
      'RNNs struggle to connect information across long sequences. Even with LSTMs, dependencies beyond ~100-200 tokens become unreliable.',
    example:
      'In the sentence "The cat, which was sitting on the mat in the living room next to the fireplace where the family gathered every evening, was sleeping." - connecting "cat" to "sleeping" is hard.',
    technical:
      'Information must flow through every timestep. Each step multiplies by weight matrices, causing exponential decay or explosion.',
    impact: 'Cannot handle documents, long conversations, or book-length contexts.',
    modernSolution: 'Transformers use direct attention - every token can "see" every other token.',
  },
  {
    id: 'sequential',
    title: 'Sequential Processing Bottleneck',
    icon: '⏱️',
    severity: 'critical',
    description:
      'RNNs must process sequences one step at a time. This fundamental constraint prevents parallelization during training and inference.',
    example:
      'Processing 1000 tokens requires 1000 sequential operations. No matter how many GPUs you have, you cannot speed this up.',
    technical:
      'h_t depends on h_{t-1}. This data dependency creates an inherently serial computation graph.',
    impact:
      'Training is slow (days/weeks vs hours). Real-time applications are bottlenecked by sequence length.',
    modernSolution:
      'Transformers compute all positions in parallel. O(n) sequential → O(1) with sufficient compute.',
  },
  {
    id: 'representation',
    title: 'Representation Coupling',
    icon: '🔗',
    severity: 'high',
    description:
      'The hidden state must simultaneously encode everything: what to output, what to remember, and how to update.',
    quote: {
      text: 'The hidden state has to do double duty: it has to both remember the past and predict the future.',
      author: 'Andrej Karpathy',
      context: 'On why LSTMs eventually hit a ceiling',
    },
    technical:
      'A single vector (typically 256-1024 dims) must represent arbitrarily complex information. This creates information bottlenecks.',
    impact: 'Limited capacity for complex reasoning, multi-step inference, or diverse output generation.',
    modernSolution:
      'Transformers separate queries, keys, and values. Different "heads" specialize in different aspects.',
  },
  {
    id: 'training',
    title: 'Training Instability',
    icon: '📉',
    severity: 'high',
    description:
      'RNN training is notoriously finicky. Gradient clipping, careful initialization, and hyperparameter tuning are essential.',
    example:
      'Without gradient clipping, gradients can explode to NaN within a few batches. Learning rates that work at step 1 may fail at step 1000.',
    technical:
      'Backpropagation through time (BPTT) compounds gradients over timesteps. The effective depth scales with sequence length.',
    impact:
      'Requires extensive hyperparameter search. Training can fail mysteriously. Hard to scale to large models.',
    modernSolution:
      'Transformers use layer normalization, residual connections, and fixed-depth backprop regardless of sequence length.',
  },
]

// =============================================================================
// DATA: Transformer Revolution Timeline
// =============================================================================

const transformerTimeline = [
  {
    year: '2017',
    month: 'June',
    title: 'Attention Is All You Need',
    description:
      'Vaswani et al. publish the Transformer paper. Self-attention replaces recurrence entirely.',
    impact: 'Translation quality matches RNNs with 10x faster training.',
    icon: '⚡',
    milestone: true,
  },
  {
    year: '2018',
    month: 'June',
    title: 'GPT-1 Released',
    description:
      'OpenAI demonstrates that Transformer decoders can learn from unlabeled text at scale.',
    impact: '117M parameters. First glimpse of emergent capabilities.',
    icon: '🌱',
  },
  {
    year: '2018',
    month: 'October',
    title: 'BERT Changes NLP',
    description:
      'Google releases BERT. Bidirectional attention revolutionizes understanding tasks.',
    impact: 'State-of-the-art on 11 NLP benchmarks. Transfer learning becomes standard.',
    icon: '🔄',
  },
  {
    year: '2019',
    month: 'February',
    title: 'GPT-2: "Too Dangerous"',
    description: 'OpenAI initially withholds GPT-2 due to concerns about misuse.',
    impact: '1.5B parameters. Generates coherent long-form text.',
    icon: '⚠️',
  },
  {
    year: '2020',
    month: 'June',
    title: 'GPT-3 Emerges',
    description: 'OpenAI scales to 175B parameters. Few-shot learning without fine-tuning.',
    impact: 'In-context learning discovered. API-based AI becomes viable.',
    icon: '🚀',
    milestone: true,
  },
  {
    year: '2022',
    month: 'November',
    title: 'ChatGPT Moment',
    description:
      'ChatGPT launches and reaches 100M users in 2 months. AI goes mainstream.',
    impact: 'Transformers become household technology.',
    icon: '🌍',
    milestone: true,
  },
  {
    year: '2023-24',
    month: '',
    title: 'The LLM Era',
    description: 'GPT-4, Claude, Gemini, Llama, Mistral. Multimodal, reasoning, agents.',
    impact: 'Transformers dominate. RNNs become niche.',
    icon: '🏆',
  },
]

// =============================================================================
// DATA: Speed Comparison
// =============================================================================

const speedComparison = [
  {
    metric: 'Training Parallelization',
    rnn: 'Sequential (O(n) steps)',
    transformer: 'Parallel (O(1) with n GPUs)',
    winner: 'transformer',
    explanation: 'RNNs must wait for each step; Transformers compute all positions at once.',
  },
  {
    metric: 'Inference Latency (1K tokens)',
    rnn: '~100-500ms',
    transformer: '~10-50ms (cached)',
    winner: 'transformer',
    explanation: 'KV caching lets Transformers reuse previous computations.',
  },
  {
    metric: 'Memory (Training)',
    rnn: 'O(n) - linear in sequence',
    transformer: 'O(n²) - quadratic in sequence',
    winner: 'rnn',
    explanation: 'Attention matrices grow quadratically. RNNs have constant memory per step.',
  },
  {
    metric: 'Memory (Inference)',
    rnn: 'O(1) - constant',
    transformer: 'O(n) - KV cache grows',
    winner: 'rnn',
    explanation: 'RNN hidden state is fixed size. Transformer cache grows with context.',
  },
  {
    metric: 'Hardware Utilization',
    rnn: 'Poor (sequential ops)',
    transformer: 'Excellent (matrix ops)',
    winner: 'transformer',
    explanation: 'GPUs excel at parallel matrix multiplication, which Transformers maximize.',
  },
  {
    metric: 'Scaling Efficiency',
    rnn: 'Diminishing returns',
    transformer: 'Predictable scaling laws',
    winner: 'transformer',
    explanation: 'Transformers follow power laws. Doubling compute = predictable improvement.',
  },
]

// =============================================================================
// DATA: Decision Flowchart
// =============================================================================

interface FlowchartNode {
  id: string
  type: 'question' | 'answer'
  text: string
  yes?: string
  no?: string
  recommendation?: 'rnn' | 'transformer' | 'either'
  details?: string
}

const flowchartNodes: FlowchartNode[] = [
  {
    id: 'start',
    type: 'question',
    text: 'Do you need to process sequences longer than 512 tokens?',
    yes: 'long-seq',
    no: 'realtime',
  },
  {
    id: 'long-seq',
    type: 'answer',
    text: 'Use Transformers',
    recommendation: 'transformer',
    details: 'Long-range dependencies are critical. RNNs will lose information.',
  },
  {
    id: 'realtime',
    type: 'question',
    text: 'Is this for real-time streaming (continuous input)?',
    yes: 'latency',
    no: 'edge',
  },
  {
    id: 'latency',
    type: 'question',
    text: 'Is per-token latency more important than throughput?',
    yes: 'rnn-streaming',
    no: 'transformer-batch',
  },
  {
    id: 'rnn-streaming',
    type: 'answer',
    text: 'Consider RNNs',
    recommendation: 'rnn',
    details:
      'RNNs excel at true streaming with constant memory. Good for IoT, audio, real-time sensors.',
  },
  {
    id: 'transformer-batch',
    type: 'answer',
    text: 'Use Transformers with batching',
    recommendation: 'transformer',
    details: 'Batch multiple requests. Higher throughput compensates for higher per-request latency.',
  },
  {
    id: 'edge',
    type: 'question',
    text: 'Is this for edge devices with <1GB memory?',
    yes: 'edge-compute',
    no: 'sota',
  },
  {
    id: 'edge-compute',
    type: 'answer',
    text: 'RNNs may be better',
    recommendation: 'rnn',
    details:
      'RNNs have O(1) memory per step. Small LSTMs can run on microcontrollers. Consider TinyML.',
  },
  {
    id: 'sota',
    type: 'question',
    text: 'Do you need state-of-the-art accuracy?',
    yes: 'transformer-sota',
    no: 'simple',
  },
  {
    id: 'transformer-sota',
    type: 'answer',
    text: 'Use Transformers',
    recommendation: 'transformer',
    details:
      'For benchmarks, competitions, or maximum accuracy, Transformers are almost always better.',
  },
  {
    id: 'simple',
    type: 'answer',
    text: 'Either can work',
    recommendation: 'either',
    details:
      'For simple tasks with short sequences, both architectures perform similarly. Choose based on team expertise.',
  },
]

// =============================================================================
// DATA: Build vs Buy Framework
// =============================================================================

const buildVsBuyFactors = [
  {
    factor: 'Time to Market',
    build: '3-12 months',
    buy: '1-4 weeks',
    recommendation: 'buy',
    notes: 'APIs get you started immediately. Build only after validating the use case.',
  },
  {
    factor: 'Upfront Cost',
    build: '$50K-500K+',
    buy: '$0-1K/month initially',
    recommendation: 'buy',
    notes: 'Pay-per-use APIs scale with demand. Building requires upfront infrastructure.',
  },
  {
    factor: 'Ongoing Cost (High Volume)',
    build: '$1-10K/month',
    buy: '$10-100K/month',
    recommendation: 'build',
    notes: 'At scale, self-hosted models can be 10-100x cheaper per inference.',
  },
  {
    factor: 'Data Privacy',
    build: 'Full control',
    buy: 'Data leaves your systems',
    recommendation: 'build',
    notes: 'Regulated industries (healthcare, finance) may require on-premise.',
  },
  {
    factor: 'Customization',
    build: 'Unlimited',
    buy: 'Limited to API features',
    recommendation: 'build',
    notes: 'Fine-tuning, custom architectures, domain-specific optimizations.',
  },
  {
    factor: 'Maintenance Burden',
    build: 'Full responsibility',
    buy: 'Provider handles it',
    recommendation: 'buy',
    notes: 'Model updates, security patches, scaling handled by provider.',
  },
  {
    factor: 'Talent Required',
    build: 'ML Engineers, MLOps',
    buy: 'Software Engineers',
    recommendation: 'buy',
    notes: 'API integration is standard engineering. Training models requires specialists.',
  },
  {
    factor: 'Latency Control',
    build: 'Full control',
    buy: 'Network + provider latency',
    recommendation: 'build',
    notes: 'P99 latency requirements may necessitate local deployment.',
  },
]

// =============================================================================
// DATA: When to Use RNNs
// =============================================================================

const rnnUseCases = [
  {
    category: 'Edge & IoT',
    icon: '📱',
    examples: ['Keyword spotting', 'Gesture recognition', 'Predictive text on-device'],
    why: 'Constant memory footprint, runs on microcontrollers',
  },
  {
    category: 'True Streaming',
    icon: '🎙️',
    examples: ['Live audio transcription', 'Real-time translation', 'Continuous sensor monitoring'],
    why: 'Process input as it arrives, no need to buffer',
  },
  {
    category: 'Resource-Constrained',
    icon: '💾',
    examples: ['Legacy systems', 'Embedded devices', 'High-frequency trading'],
    why: 'Minimal memory, predictable latency per step',
  },
  {
    category: 'Sequential Decision Making',
    icon: '🎮',
    examples: ['Game AI', 'Robot control', 'Trading strategies'],
    why: 'Natural fit for step-by-step state evolution',
  },
]

// =============================================================================
// DATA: Quiz Questions
// =============================================================================

const quizQuestions = [
  {
    id: 'q1',
    question:
      'Your startup needs to build a document summarization feature. You have 2 engineers and need to launch in 6 weeks. What should you do?',
    options: [
      { id: 'a', text: 'Train a custom RNN model from scratch', correct: false },
      { id: 'b', text: 'Use an LLM API (GPT-4, Claude, etc.)', correct: true },
      { id: 'c', text: 'Build a Transformer from the Vaswani paper', correct: false },
      { id: 'd', text: 'Wait for better technology', correct: false },
    ],
    explanation:
      'With limited time and team size, using an LLM API is the pragmatic choice. Validate the use case first, then consider building custom solutions if needed.',
  },
  {
    id: 'q2',
    question:
      'A medical device company needs real-time ECG anomaly detection on a wearable with 256KB RAM. Which architecture fits best?',
    options: [
      { id: 'a', text: 'GPT-4', correct: false },
      { id: 'b', text: 'BERT', correct: false },
      { id: 'c', text: 'Small LSTM/GRU', correct: true },
      { id: 'd', text: 'Vision Transformer', correct: false },
    ],
    explanation:
      'RNNs (LSTM/GRU) have constant memory per timestep and can run on microcontrollers. Transformers require memory proportional to sequence length.',
  },
  {
    id: 'q3',
    question:
      'Why did Transformers replace RNNs for most NLP tasks despite having quadratic memory complexity?',
    options: [
      { id: 'a', text: 'RNNs were too slow to train', correct: false },
      { id: 'b', text: 'Transformers can be parallelized, enabling much larger models', correct: true },
      { id: 'c', text: 'RNNs cannot learn language', correct: false },
      { id: 'd', text: 'Transformers use less memory', correct: false },
    ],
    explanation:
      'The key insight: parallelization enables scaling. Transformers can use thousands of GPUs efficiently. Scaling laws show bigger = better, and Transformers scale.',
  },
  {
    id: 'q4',
    question:
      'Your company processes 10 million customer support tickets per month. Currently using GPT-4 API at $0.03 per 1K tokens. What should you consider?',
    options: [
      { id: 'a', text: 'Keep using GPT-4 - it is the best', correct: false },
      { id: 'b', text: 'Switch to RNNs for cost savings', correct: false },
      { id: 'c', text: 'Evaluate self-hosted open-source LLMs', correct: true },
      { id: 'd', text: 'Stop using AI entirely', correct: false },
    ],
    explanation:
      'At high volume, self-hosted models (Llama, Mistral) can be 10-100x cheaper. The build vs buy calculus shifts with scale.',
  },
]

// =============================================================================
// COMPONENTS: Interactive Elements
// =============================================================================

// Long-Range Dependency Stress Test
function LongRangeDemo() {
  const [distance, setDistance] = useState(5)
  const [showResult, setShowResult] = useState(false)

  const generateSentence = (dist: number) => {
    const fillers = [
      'which was sitting on the mat',
      'who had been sleeping all morning',
      'that the family had adopted last year',
      'with the fluffy orange fur',
      'who loved to chase mice',
    ]
    const subject = 'The cat'
    const verb = 'meowed'

    const selectedFillers = fillers.slice(0, Math.min(dist, fillers.length))
    const middle = selectedFillers.join(', ')
    return { subject, middle, verb, full: `${subject}, ${middle}, ${verb} loudly.` }
  }

  const sentence = generateSentence(distance)
  const wordCount = sentence.full.split(' ').length

  const getGradientHealth = () => {
    if (distance <= 2) return { color: 'text-green-600', status: 'Strong', signal: 95 }
    if (distance <= 3) return { color: 'text-yellow-600', status: 'Degrading', signal: 70 }
    if (distance <= 4) return { color: 'text-orange-600', status: 'Weak', signal: 40 }
    return { color: 'text-red-600', status: 'Critical', signal: 15 }
  }

  const health = getGradientHealth()

  return (
    <Card className="border-l-4 border-l-amber-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🔬</span>
          Long-Range Dependency Stress Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          Slide to add more clauses between subject and verb. Watch how the &quot;gradient
          signal&quot; weakens.
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Distance: {distance} clauses</span>
            <span className="text-sm text-slate-500">{wordCount} words</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={distance}
            onChange={(e) => setDistance(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-sm">
            <span className="font-bold text-blue-600">{sentence.subject}</span>
            <span className="text-slate-500">, {sentence.middle}, </span>
            <span className="font-bold text-green-600">{sentence.verb}</span> loudly.
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3">
          <div>
            <div className="text-sm font-medium">Gradient Signal Strength</div>
            <div className={`text-lg font-bold ${health.color}`}>{health.status}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-700">{health.signal}%</div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-300">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
                style={{ width: `${health.signal}%` }}
              />
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowResult(!showResult)}>
          {showResult ? 'Hide' : 'Show'} Explanation
        </Button>

        {showResult && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <strong>What&apos;s happening:</strong> In an RNN, information about &quot;The
            cat&quot; must survive through every intermediate word to influence the prediction
            of &quot;meowed.&quot; With each step, gradients multiply by weight matrices. If
            weights are &lt; 1, signals vanish. If &gt; 1, they explode. LSTMs help but
            don&apos;t fully solve this.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Interactive Flowchart
function DecisionFlowchart() {
  const [currentNode, setCurrentNode] = useState('start')
  const [history, setHistory] = useState<string[]>([])

  const node = flowchartNodes.find((n) => n.id === currentNode)

  const handleAnswer = (nextId: string) => {
    setHistory([...history, currentNode])
    setCurrentNode(nextId)
  }

  const handleReset = () => {
    setCurrentNode('start')
    setHistory([])
  }

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history]
      const previousNode = newHistory.pop()!
      setHistory(newHistory)
      setCurrentNode(previousNode)
    }
  }

  if (!node) return null

  const getRecommendationStyle = (rec?: string) => {
    switch (rec) {
      case 'transformer':
        return 'bg-purple-100 border-purple-500 text-purple-900'
      case 'rnn':
        return 'bg-amber-100 border-amber-500 text-amber-900'
      case 'either':
        return 'bg-green-100 border-green-500 text-green-900'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧭</span>
          Should I Use an RNN?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Step {history.length + 1}</span>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← Back
            </Button>
          )}
        </div>

        {node.type === 'question' ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-lg font-medium text-slate-900">{node.text}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => handleAnswer(node.yes!)}>
                Yes
              </Button>
              <Button variant="outline" onClick={() => handleAnswer(node.no!)}>
                No
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`rounded-lg border-l-4 p-4 ${getRecommendationStyle(node.recommendation)}`}
            >
              <p className="text-lg font-bold">{node.text}</p>
              {node.details && <p className="mt-2 text-sm opacity-90">{node.details}</p>}
            </div>
            <Button variant="outline" onClick={handleReset}>
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Quiz Component
function LimitationsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const question = quizQuestions[currentQuestion]

  const handleSelect = (optionId: string) => {
    if (showExplanation) return
    setSelectedAnswer(optionId)
    setShowExplanation(true)
    const isCorrect = question.options.find((o) => o.id === optionId)?.correct
    if (isCorrect) setScore(score + 1)
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setCompleted(false)
  }

  if (completed) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    return (
      <Card className="border-l-4 border-l-primary-500">
        <CardHeader>
          <CardTitle>Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600">{percentage}%</div>
            <div className="text-slate-600">
              {score} of {quizQuestions.length} correct
            </div>
          </div>
          {percentage === 100 && (
            <div className="rounded-lg bg-green-50 p-4 text-center text-green-800">
              Perfect score! You understand the RNN vs Transformer decision landscape.
            </div>
          )}
          <Button variant="outline" onClick={handleReset} className="w-full">
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Decision Scenario Quiz</span>
          <span className="text-sm font-normal text-slate-500">
            {currentQuestion + 1} / {quizQuestions.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-medium text-slate-900">{question.question}</p>

        <div className="space-y-2">
          {question.options.map((option) => {
            let style = 'border-slate-200 hover:border-primary-300'
            if (showExplanation) {
              if (option.correct) {
                style = 'border-green-500 bg-green-50'
              } else if (option.id === selectedAnswer) {
                style = 'border-red-500 bg-red-50'
              }
            } else if (option.id === selectedAnswer) {
              style = 'border-primary-500 bg-primary-50'
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={showExplanation}
                className={`w-full rounded-lg border-2 p-3 text-left transition-all ${style} ${
                  showExplanation ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className="font-medium">{option.id.toUpperCase()}.</span> {option.text}
              </button>
            )
          })}
        </div>

        {showExplanation && (
          <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Explanation:</strong> {question.explanation}
          </div>
        )}

        {showExplanation && (
          <Button variant="primary" onClick={handleNext} className="w-full">
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

export default function Module8Page() {
  const moduleData = MODULES[8]
  const { completeModule, completedModules } = useProgressStore()
  const gamification = useGamificationStore()
  const prevModule = MODULES[7]
  const nextModule = MODULES[9]

  const isCompleted = completedModules.includes(8)

  const handleComplete = useCallback(() => {
    completeModule(8)
    gamification.completeModule(8)
    gamification.checkPathCompletion([...completedModules, 8])
  }, [completeModule, gamification, completedModules])

  // Key takeaways
  const keyTakeaways = [
    'RNNs have fundamental limitations: long-range dependencies, sequential processing, representation coupling, and training instability',
    'Transformers solved these problems through parallelization and direct attention, enabling massive scale',
    'RNNs still excel in specific niches: edge devices, true streaming, and resource-constrained environments',
    'Build vs Buy: Start with APIs, evaluate self-hosting at scale based on volume, privacy, and latency needs',
    'The choice is not RNN vs Transformer - it is choosing the right tool for your specific constraints',
  ]

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Module Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-lg font-medium text-primary-700">
              {moduleData.id}
            </span>
            <span className="text-sm text-slate-500">{moduleData.duration}</span>
            {isCompleted && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Completed
              </span>
            )}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">{moduleData.title}</h1>
          <p className="text-lg text-slate-600">{moduleData.subtitle}</p>
        </div>

        {/* TL;DR Section */}
        <Card className="mb-8 border-l-4 border-l-primary-500">
          <CardHeader>
            <CardTitle>5-Minute TL;DR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-slate-700">
              RNNs were revolutionary, but they have fundamental limitations that Transformers
              solved. Understanding these limitations helps you make informed decisions about
              when to use each architecture—and when to simply use an API.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-amber-50 p-4">
                <h4 className="mb-2 font-semibold text-amber-900">RNN Strengths</h4>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li>• Constant memory per timestep</li>
                  <li>• True streaming capability</li>
                  <li>• Runs on tiny devices</li>
                </ul>
              </div>
              <div className="rounded-lg bg-purple-50 p-4">
                <h4 className="mb-2 font-semibold text-purple-900">Transformer Strengths</h4>
                <ul className="space-y-1 text-sm text-purple-800">
                  <li>• Parallel processing</li>
                  <li>• Long-range dependencies</li>
                  <li>• Scales with compute</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 8.1: The Four Limitations */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8.1 The Four Fundamental Limitations
          </h2>
          <p className="mb-6 text-slate-600">
            Understanding why RNNs were replaced requires understanding what problems they
            couldn&apos;t solve. These aren&apos;t bugs—they&apos;re fundamental to the
            architecture.
          </p>

          <div className="space-y-6">
            {rnnLimitations.map((limitation) => (
              <Card
                key={limitation.id}
                className={`border-l-4 ${
                  limitation.severity === 'critical'
                    ? 'border-l-red-500'
                    : 'border-l-orange-500'
                }`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{limitation.icon}</span>
                    <span>{limitation.title}</span>
                    <span
                      className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${
                        limitation.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {limitation.severity.toUpperCase()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-700">{limitation.description}</p>

                  {limitation.quote && (
                    <blockquote className="border-l-4 border-slate-300 bg-slate-50 p-4 italic">
                      <p className="text-slate-700">&quot;{limitation.quote.text}&quot;</p>
                      <footer className="mt-2 text-sm text-slate-500">
                        — {limitation.quote.author}, {limitation.quote.context}
                      </footer>
                    </blockquote>
                  )}

                  {limitation.example && (
                    <div className="rounded bg-slate-50 p-3">
                      <span className="text-xs font-semibold uppercase text-slate-500">
                        Example
                      </span>
                      <p className="mt-1 text-sm text-slate-700">{limitation.example}</p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded bg-red-50 p-3">
                      <span className="text-xs font-semibold uppercase text-red-600">
                        Business Impact
                      </span>
                      <p className="mt-1 text-sm text-red-900">{limitation.impact}</p>
                    </div>
                    <div className="rounded bg-green-50 p-3">
                      <span className="text-xs font-semibold uppercase text-green-600">
                        Modern Solution
                      </span>
                      <p className="mt-1 text-sm text-green-900">{limitation.modernSolution}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 8.2: Interactive Demo */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">8.2 Experience the Limitation</h2>
          <p className="mb-6 text-slate-600">
            This interactive demo shows how information &quot;decays&quot; as sequences get
            longer. Try increasing the distance between subject and verb.
          </p>
          <LongRangeDemo />
        </section>

        {/* Section 8.3: Transformer Revolution */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8.3 The Transformer Revolution (2017-Present)
          </h2>
          <p className="mb-6 text-slate-600">
            In June 2017, everything changed. &quot;Attention Is All You Need&quot; showed that
            you don&apos;t need recurrence at all. Here&apos;s how it unfolded.
          </p>

          <div className="relative">
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 md:block" />

            <div className="space-y-6">
              {transformerTimeline.map((event, index) => (
                <div key={event.title} className="relative flex items-start gap-4 md:gap-6">
                  <div className="relative z-10 hidden md:block">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ${
                        event.milestone ? 'ring-4 ring-purple-400' : 'ring-4 ring-purple-100'
                      }`}
                    >
                      <span className="text-2xl">{event.icon}</span>
                    </div>
                  </div>

                  <Card
                    className={`flex-1 transition-all hover:shadow-md ${
                      event.milestone ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="text-2xl md:hidden">{event.icon}</span>
                        <span className="text-sm font-bold text-purple-600">
                          {event.year} {event.month}
                        </span>
                        {event.milestone && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                            MILESTONE
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
                      <p className="text-sm text-slate-600">{event.description}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        <strong>Impact:</strong> {event.impact}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 8.4: Speed Comparison */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8.4 Head-to-Head: RNN vs Transformer
          </h2>
          <p className="mb-6 text-slate-600">
            Let&apos;s compare these architectures across the metrics that matter for real-world
            deployment.
          </p>

          <Card>
            <CardContent className="overflow-x-auto py-4">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Metric
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-amber-700">RNN</th>
                    <th className="pb-3 text-left text-sm font-semibold text-purple-700">
                      Transformer
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Winner
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {speedComparison.map((row) => (
                    <tr key={row.metric} className="group">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-slate-900">{row.metric}</span>
                        <p className="text-xs text-slate-500">{row.explanation}</p>
                      </td>
                      <td
                        className={`py-3 pr-4 text-sm ${
                          row.winner === 'rnn' ? 'font-semibold text-amber-700' : 'text-slate-600'
                        }`}
                      >
                        {row.rnn}
                      </td>
                      <td
                        className={`py-3 pr-4 text-sm ${
                          row.winner === 'transformer'
                            ? 'font-semibold text-purple-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {row.transformer}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            row.winner === 'transformer'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {row.winner === 'transformer' ? 'Transformer' : 'RNN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card className="mt-6 bg-slate-50">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-slate-800">
                <strong>Key insight:</strong> Transformers win on most metrics, but RNNs still
                have an edge in memory-constrained scenarios. The &quot;right&quot; choice
                depends on your specific constraints.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 8.5: Decision Flowchart */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8.5 Interactive Decision Guide
          </h2>
          <p className="mb-6 text-slate-600">
            Answer a few questions to get a recommendation for your specific use case.
          </p>
          <DecisionFlowchart />
        </section>

        {/* Section 8.6: When to Still Use RNNs */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">8.6 When RNNs Still Shine</h2>
          <p className="mb-6 text-slate-600">
            Despite Transformer dominance, RNNs have legitimate use cases. Here&apos;s where
            they still make sense.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {rnnUseCases.map((useCase) => (
              <Card
                key={useCase.category}
                className="border-l-4 border-l-amber-400 transition-all hover:shadow-md"
              >
                <CardContent className="py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{useCase.icon}</span>
                    <h3 className="font-semibold text-slate-900">{useCase.category}</h3>
                  </div>
                  <ul className="mb-3 space-y-1 text-sm text-slate-600">
                    {useCase.examples.map((ex) => (
                      <li key={ex}>• {ex}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-amber-700">
                    <strong>Why RNN:</strong> {useCase.why}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Section 8.7: Build vs Buy */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            8.7 Build vs Buy Decision Framework
          </h2>
          <p className="mb-6 text-slate-600">
            For working professionals: should you train your own model, fine-tune an existing
            one, or just use an API? Here&apos;s a comprehensive framework.
          </p>

          <Card>
            <CardContent className="overflow-x-auto py-4">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Factor
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-blue-700">Build</th>
                    <th className="pb-3 text-left text-sm font-semibold text-green-700">Buy</th>
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Recommendation
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {buildVsBuyFactors.map((row) => (
                    <tr key={row.factor} className="group">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-slate-900">{row.factor}</span>
                        <p className="text-xs text-slate-500">{row.notes}</p>
                      </td>
                      <td
                        className={`py-3 pr-4 text-sm ${
                          row.recommendation === 'build'
                            ? 'font-semibold text-blue-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {row.build}
                      </td>
                      <td
                        className={`py-3 pr-4 text-sm ${
                          row.recommendation === 'buy'
                            ? 'font-semibold text-green-700'
                            : 'text-slate-600'
                        }`}
                      >
                        {row.buy}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            row.recommendation === 'build'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {row.recommendation === 'build' ? 'Build' : 'Buy'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="bg-green-50">
              <CardContent className="py-4">
                <h4 className="mb-2 font-semibold text-green-900">Start Here (Buy)</h4>
                <p className="text-sm text-green-800">
                  Use APIs (OpenAI, Anthropic, Google) to validate your use case. Ship in weeks,
                  not months.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50">
              <CardContent className="py-4">
                <h4 className="mb-2 font-semibold text-yellow-900">Evaluate (Fine-tune)</h4>
                <p className="text-sm text-yellow-800">
                  When API costs exceed $10K/month or you need customization, evaluate
                  fine-tuning open models.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50">
              <CardContent className="py-4">
                <h4 className="mb-2 font-semibold text-blue-900">Scale (Build)</h4>
                <p className="text-sm text-blue-800">
                  At massive scale (&gt;$100K/month), privacy requirements, or unique needs,
                  invest in custom infrastructure.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Section 8.8: Quiz */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">8.8 Test Your Understanding</h2>
          <p className="mb-6 text-slate-600">
            Apply what you&apos;ve learned to real-world scenarios. Each question presents a
            decision you might face in practice.
          </p>
          <LimitationsQuiz />
        </section>

        {/* Key Takeaways */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Key Takeaways</h2>
          <Card className="bg-slate-50">
            <CardContent className="py-6">
              <ol className="space-y-3">
                {keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-medium text-white">
                      {index + 1}
                    </span>
                    <span className="text-slate-700">{takeaway}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Transformer Teaser */}
        <section className="mb-12">
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                Coming Up: What&apos;s Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-slate-700">
                You now understand RNN limitations and when to use each architecture. In the
                remaining modules, you&apos;ll:
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">→</span>
                  <strong>Module 9:</strong> Implement RNNs from scratch (NumPy → PyTorch → Hugging Face)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">→</span>
                  <strong>Module 10:</strong> Train your own character-level language model
                </li>
              </ul>
              <p className="mt-4 text-sm text-purple-700">
                <strong>Bonus:</strong> Understanding RNNs deeply prepares you to understand
                Transformers even better. The concepts transfer directly.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-8">
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">← Home</Button>
            </Link>
            {prevModule && (
              <Link href={`/modules/${prevModule.id}`}>
                <Button variant="ghost">← {prevModule.title}</Button>
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            {!isCompleted && (
              <Button onClick={handleComplete} variant="primary">
                Mark as Complete
              </Button>
            )}
            {nextModule && (
              <Link href={`/modules/${nextModule.id}`}>
                <Button variant={isCompleted ? 'primary' : 'secondary'}>
                  {nextModule.title} →
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <BadgeNotificationContainer />
    </div>
  )
}
