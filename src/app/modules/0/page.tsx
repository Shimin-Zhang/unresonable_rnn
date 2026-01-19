'use client'

import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Header, Footer } from '@/components/layout'
import { MODULES } from '@/lib/constants'
import { useProgressStore } from '@/stores/progressStore'

// Timeline milestone data
const timelineMilestones = [
  {
    year: '1980s',
    title: 'RNNs Invented',
    description: 'Theory ahead of compute - foundational concepts established',
    icon: '🔬',
  },
  {
    year: '1997',
    title: 'LSTM Published',
    description: 'Hochreiter & Schmidhuber solve the vanishing gradient problem',
    icon: '🧠',
  },
  {
    year: '2014',
    title: 'Seq2Seq Revolution',
    description: 'Sutskever et al. revolutionize machine translation',
    icon: '🌐',
  },
  {
    year: '2015',
    title: 'char-rnn Goes Viral',
    description: "Karpathy's blog post shows RNNs generating Shakespeare, code, and more",
    icon: '📝',
  },
  {
    year: '2017',
    title: 'Attention Is All You Need',
    description: 'Transformers born - the architecture behind modern AI',
    icon: '⚡',
  },
  {
    year: '2018+',
    title: 'The LLM Era',
    description: 'BERT, GPT, GPT-2, GPT-3, ChatGPT, Claude...',
    icon: '🚀',
  },
]

// Concept mapping table data
const conceptMappings = [
  {
    concept: 'Hidden State',
    whereToday: 'Every neural network that processes sequences',
    businessValue: "Understanding how AI \"remembers\" context",
  },
  {
    concept: 'Attention Mechanisms',
    whereToday: 'ChatGPT, Claude, Google Search, recommendation engines',
    businessValue: "Understanding how AI \"focuses\" on relevant information",
  },
  {
    concept: 'Temperature Sampling',
    whereToday: 'Every LLM API (OpenAI, Anthropic, etc.)',
    businessValue: 'Controlling creativity vs. accuracy trade-offs',
  },
  {
    concept: 'Sequence-to-Sequence',
    whereToday: 'Translation, summarization, code generation',
    businessValue: 'Understanding input → output AI pipelines',
  },
  {
    concept: 'Training Dynamics',
    whereToday: 'Fine-tuning, prompt engineering',
    businessValue: 'Understanding why AI behaves the way it does',
  },
]

// Industry applications table data
const industryApplications = [
  {
    industry: 'Finance',
    icon: '💰',
    problems: 'Transaction histories, market time series',
    solutions: 'Fraud detection, algorithmic trading signals',
  },
  {
    industry: 'Healthcare',
    icon: '🏥',
    problems: 'Patient event timelines, vital sign streams',
    solutions: 'Disease progression prediction, early warning systems',
  },
  {
    industry: 'E-commerce',
    icon: '🛒',
    problems: 'Clickstreams, purchase sequences',
    solutions: 'Recommendation engines, churn prediction',
  },
  {
    industry: 'DevOps',
    icon: '🔧',
    problems: 'Log streams, metric time series',
    solutions: 'Anomaly detection, incident prediction',
  },
  {
    industry: 'Marketing',
    icon: '📊',
    problems: 'Customer journey touchpoints',
    solutions: 'Attribution modeling, next-best-action',
  },
  {
    industry: 'Manufacturing',
    icon: '🏭',
    problems: 'Sensor readings over time',
    solutions: 'Predictive maintenance, quality control',
  },
  {
    industry: 'Legal',
    icon: '⚖️',
    problems: 'Document sequences, case histories',
    solutions: 'Contract analysis, outcome prediction',
  },
]

// Key takeaways
const keyTakeaways = [
  "RNNs pioneered the concepts that power today's AI language models",
  'Understanding RNN limitations explains why modern architectures exist',
  'Sequence modeling applies to any ordered data in your business',
  'The concepts (hidden state, attention, temperature) transfer directly to modern tools',
]

export default function Module0Page() {
  const moduleData = MODULES[0]
  const { completeModule, completedModules } = useProgressStore()
  const nextModule = MODULES[1]

  const isCompleted = completedModules.includes(0)

  const handleComplete = () => {
    completeModule(0)
  }

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
              Andrej Karpathy&apos;s 2015 blog post demonstrated that relatively simple neural
              networks (RNNs) could learn to generate surprisingly coherent text, code, and
              even mathematical proofs—character by character. While RNNs have since been
              largely replaced by Transformers (the architecture behind ChatGPT, Claude, and
              other modern AI), understanding RNNs is valuable because:
            </p>
            <ol className="list-inside list-decimal space-y-2 text-slate-700">
              <li>
                <strong>The concepts transfer directly</strong> - Hidden states, sequence
                processing, attention mechanisms, and training dynamics all appear in modern
                systems
              </li>
              <li>
                <strong>RNNs are still used</strong> - For real-time streaming, edge devices,
                and resource-constrained environments
              </li>
              <li>
                <strong>You&apos;ll understand the &quot;why&quot;</strong> - Knowing RNN
                limitations explains why Transformers were invented
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Section 0.1: AI Timeline */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            0.1 The AI Landscape: Where RNNs Fit
          </h2>
          <p className="mb-6 text-slate-600">
            The story of sequence modeling spans four decades. Every modern LLM uses concepts
            pioneered in RNN research. Understanding RNNs helps you understand why attention
            works and what problems it solves.
          </p>

          {/* Timeline visualization */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 hidden h-full w-0.5 bg-gradient-to-b from-primary-300 via-primary-500 to-primary-700 md:block" />

            <div className="space-y-6">
              {timelineMilestones.map((milestone, index) => (
                <div key={milestone.year} className="relative flex items-start gap-4 md:gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 hidden md:block">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-primary-100">
                      <span className="text-2xl">{milestone.icon}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <Card
                    className={`flex-1 transition-all hover:shadow-md ${
                      index === 3 ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <CardContent className="py-4">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="md:hidden text-2xl">{milestone.icon}</span>
                        <span className="text-sm font-bold text-primary-600">
                          {milestone.year}
                        </span>
                        {index === 3 && (
                          <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                            THIS COURSE!
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-slate-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <Card className="mt-6 bg-primary-50">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-primary-800">
                <strong>Key insight:</strong> Every modern LLM uses concepts pioneered in RNN
                research. Understanding RNNs helps you understand why attention works and what
                problems it solves.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 0.2: Concept Mapping */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            0.2 What You&apos;ll Learn and Why It Matters
          </h2>
          <Card>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Concept
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Where It Appears Today
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-slate-900">
                      Business Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {conceptMappings.map((row) => (
                    <tr key={row.concept} className="group">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-slate-900">{row.concept}</span>
                      </td>
                      <td className="py-3 pr-4 text-sm text-slate-600">{row.whereToday}</td>
                      <td className="py-3 text-sm text-slate-600">{row.businessValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        {/* Section 0.3: Industry Applications */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            0.3 Industry Applications of Sequence Modeling
          </h2>
          <p className="mb-6 text-slate-600">
            Find your domain and discover how sequence modeling applies to your work.
          </p>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industryApplications.map((app) => (
              <Card
                key={app.industry}
                className="transition-all hover:shadow-md hover:ring-1 hover:ring-primary-200"
              >
                <CardContent className="py-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">{app.icon}</span>
                    <h3 className="font-semibold text-slate-900">{app.industry}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-slate-700">Sequence Problems:</span>
                      <p className="text-slate-600">{app.problems}</p>
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Example Solutions:</span>
                      <p className="text-slate-600">{app.solutions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-l-4 border-l-amber-400 bg-amber-50">
            <CardContent className="py-4">
              <p className="text-sm font-medium text-amber-800">
                <strong>Reflection:</strong> Which of these industries applies to YOUR work?
                Keep this in mind as you progress through the modules.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Section 0.4: Stakeholder Explanations */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            0.4 Explaining This to Your Stakeholders
          </h2>
          <p className="mb-6 text-slate-600">
            Different audiences need different explanations. Here are three ways to explain
            sequence modeling depending on your context.
          </p>

          <div className="space-y-6">
            {/* Dinner Party */}
            <Card className="border-l-4 border-l-purple-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🍷</span>
                  Dinner Party Explanation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">
                  &quot;You know how when you&apos;re reading a sentence, you understand each
                  word based on the words that came before? RNNs do exactly that—they process
                  information step by step, keeping a &apos;memory&apos; of what they&apos;ve
                  seen. This is how early AI learned to write text, translate languages, and
                  even generate code.&quot;
                </blockquote>
              </CardContent>
            </Card>

            {/* Executive Pitch */}
            <Card className="border-l-4 border-l-blue-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  Elevator Pitch for Executives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">
                  &quot;Sequence models are the foundation of modern AI language capabilities.
                  They enable systems to process any ordered data—text, time series, user
                  behavior—and make predictions based on patterns. Understanding these
                  fundamentals helps us make better decisions about where AI can add value and
                  what its limitations are.&quot;
                </blockquote>
              </CardContent>
            </Card>

            {/* ROI Statement */}
            <Card className="border-l-4 border-l-green-400">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📈</span>
                  ROI Statement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">
                  &quot;Sequence modeling enables us to extract value from our temporal
                  data—customer journeys, transaction histories, operational logs—that
                  traditional analytics can&apos;t capture. Companies using these techniques
                  see improvements in prediction accuracy, fraud detection rates, and customer
                  experience personalization.&quot;
                </blockquote>
              </CardContent>
            </Card>
          </div>
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

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-8">
          <div>
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
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
    </div>
  )
}
