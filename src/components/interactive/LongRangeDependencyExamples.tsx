'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ExampleWord {
  text: string
  type: 'normal' | 'subject' | 'verb' | 'open' | 'close' | 'positive' | 'negative' | 'target'
  highlight?: boolean
}

interface DependencyExample {
  id: string
  name: string
  category: string
  icon: string
  words: ExampleWord[]
  description: string
  dependency: string
  distance: number
  challenge: string
}

const EXAMPLES: DependencyExample[] = [
  {
    id: 'subject-verb-short',
    name: 'Simple Agreement',
    category: 'Subject-Verb Agreement',
    icon: '📝',
    words: [
      { text: 'The', type: 'normal' },
      { text: 'cat', type: 'subject', highlight: true },
      { text: 'sits', type: 'verb', highlight: true },
      { text: '.', type: 'normal' },
    ],
    description: 'Subject and verb are adjacent',
    dependency: 'cat → sits (singular)',
    distance: 1,
    challenge: 'Easy: minimal distance to track',
  },
  {
    id: 'subject-verb-long',
    name: 'Complex Agreement',
    category: 'Subject-Verb Agreement',
    icon: '📝',
    words: [
      { text: 'The', type: 'normal' },
      { text: 'cat', type: 'subject', highlight: true },
      { text: ',', type: 'normal' },
      { text: 'which', type: 'normal' },
      { text: 'my', type: 'normal' },
      { text: 'sister', type: 'normal' },
      { text: 'bought', type: 'normal' },
      { text: 'from', type: 'normal' },
      { text: 'the', type: 'normal' },
      { text: 'shelter', type: 'normal' },
      { text: 'last', type: 'normal' },
      { text: 'summer', type: 'normal' },
      { text: ',', type: 'normal' },
      { text: 'sits', type: 'verb', highlight: true },
      { text: '.', type: 'normal' },
    ],
    description: 'Subject and verb separated by a relative clause',
    dependency: 'cat (12 words ago) → sits (singular)',
    distance: 12,
    challenge: 'Hard: must remember "cat" is singular across many words',
  },
  {
    id: 'bracket-simple',
    name: 'Simple Brackets',
    category: 'Bracket Matching',
    icon: '{ }',
    words: [
      { text: 'if', type: 'normal' },
      { text: '(', type: 'open', highlight: true },
      { text: 'x', type: 'normal' },
      { text: '>', type: 'normal' },
      { text: '0', type: 'normal' },
      { text: ')', type: 'close', highlight: true },
      { text: '{', type: 'open', highlight: true },
      { text: 'return', type: 'normal' },
      { text: 'x', type: 'normal' },
      { text: '}', type: 'close', highlight: true },
    ],
    description: 'Matching parentheses and braces',
    dependency: '( → ) and { → }',
    distance: 4,
    challenge: 'Need to track both ( and { separately',
  },
  {
    id: 'bracket-nested',
    name: 'Nested Brackets',
    category: 'Bracket Matching',
    icon: '{ }',
    words: [
      { text: 'fn', type: 'normal' },
      { text: '(', type: 'open', highlight: true },
      { text: 'arr', type: 'normal' },
      { text: '[', type: 'open', highlight: true },
      { text: 'map', type: 'normal' },
      { text: '(', type: 'open', highlight: true },
      { text: 'x', type: 'normal' },
      { text: '=>', type: 'normal' },
      { text: 'x', type: 'normal' },
      { text: '*', type: 'normal' },
      { text: '2', type: 'normal' },
      { text: ')', type: 'close', highlight: true },
      { text: ']', type: 'close', highlight: true },
      { text: ')', type: 'close', highlight: true },
    ],
    description: 'Nested brackets require a stack',
    dependency: '( [ ( ... ) ] )',
    distance: 11,
    challenge: 'Must track bracket types and nesting depth (LIFO order)',
  },
  {
    id: 'sentiment-simple',
    name: 'Direct Sentiment',
    category: 'Sentiment Analysis',
    icon: '😊',
    words: [
      { text: 'The', type: 'normal' },
      { text: 'movie', type: 'normal' },
      { text: 'was', type: 'normal' },
      { text: 'great', type: 'positive', highlight: true },
      { text: '.', type: 'normal' },
    ],
    description: 'Sentiment word directly expresses opinion',
    dependency: 'great → positive sentiment',
    distance: 0,
    challenge: 'Easy: single sentiment word',
  },
  {
    id: 'sentiment-negation',
    name: 'Negated Sentiment',
    category: 'Sentiment Analysis',
    icon: '😊',
    words: [
      { text: 'I', type: 'normal' },
      { text: "don't", type: 'negative', highlight: true },
      { text: 'think', type: 'normal' },
      { text: 'this', type: 'normal' },
      { text: 'restaurant', type: 'normal' },
      { text: 'is', type: 'normal' },
      { text: 'particularly', type: 'normal' },
      { text: 'good', type: 'positive', highlight: true },
      { text: '.', type: 'normal' },
    ],
    description: 'Negation reverses the sentiment',
    dependency: "don't ... good → negative sentiment",
    distance: 6,
    challenge: 'Must remember negation across 6 words',
  },
  {
    id: 'sentiment-double-neg',
    name: 'Double Negation',
    category: 'Sentiment Analysis',
    icon: '😊',
    words: [
      { text: 'The', type: 'normal' },
      { text: 'plot', type: 'normal' },
      { text: 'was', type: 'normal' },
      { text: 'not', type: 'negative', highlight: true },
      { text: 'without', type: 'negative', highlight: true },
      { text: 'its', type: 'normal' },
      { text: 'flaws', type: 'normal' },
      { text: ',', type: 'normal' },
      { text: 'but', type: 'normal' },
      { text: 'I', type: 'normal' },
      { text: "wouldn't", type: 'negative', highlight: true },
      { text: 'call', type: 'normal' },
      { text: 'it', type: 'normal' },
      { text: 'bad', type: 'positive', highlight: true },
      { text: '.', type: 'normal' },
    ],
    description: 'Multiple negations create complex sentiment',
    dependency: "not without flaws... wouldn't... bad → mildly positive",
    distance: 10,
    challenge: 'Must track multiple negations and their interactions',
  },
]

const CATEGORIES = ['Subject-Verb Agreement', 'Bracket Matching', 'Sentiment Analysis']

const WORD_COLORS: Record<ExampleWord['type'], string> = {
  normal: 'bg-slate-100 text-slate-700',
  subject: 'bg-blue-100 text-blue-700 border-blue-300',
  verb: 'bg-blue-100 text-blue-700 border-blue-300',
  open: 'bg-green-100 text-green-700 border-green-300',
  close: 'bg-green-100 text-green-700 border-green-300',
  positive: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  negative: 'bg-red-100 text-red-700 border-red-300',
  target: 'bg-purple-100 text-purple-700 border-purple-300',
}

/**
 * Interactive component showing practical examples of long-range dependencies
 * that RNNs need to handle.
 */
export function LongRangeDependencyExamples({ className }: { className?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0])

  const filteredExamples = useMemo(
    () => EXAMPLES.filter((ex) => ex.category === selectedCategory),
    [selectedCategory]
  )

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-white p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Long-Range Dependencies in Practice
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          These examples show why RNNs need long-term memory. The highlighted words must be
          connected across many intervening tokens.
        </p>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              selectedCategory === category
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Examples */}
      <div className="space-y-6">
        {filteredExamples.map((example) => (
          <div
            key={example.id}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">{example.icon}</span>
              <h4 className="font-semibold text-slate-900">{example.name}</h4>
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                Distance: {example.distance} {example.distance === 1 ? 'word' : 'words'}
              </span>
            </div>

            {/* Word sequence */}
            <div className="mb-3 flex flex-wrap gap-1.5">
              {example.words.map((word, i) => (
                <span
                  key={i}
                  className={cn(
                    'rounded px-2 py-1 text-sm font-mono',
                    WORD_COLORS[word.type],
                    word.highlight && 'border-2 font-semibold shadow-sm'
                  )}
                >
                  {word.text}
                </span>
              ))}
            </div>

            {/* Dependency arc visualization (simplified) */}
            <div className="mb-3 rounded bg-white p-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-slate-700">Dependency:</span>
                <span className="font-mono text-slate-600">{example.dependency}</span>
              </div>
            </div>

            {/* Challenge */}
            <div className="rounded bg-amber-50 p-3 text-sm">
              <span className="font-medium text-amber-800">Challenge: </span>
              <span className="text-amber-700">{example.challenge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Key insight */}
      <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4">
        <h4 className="font-semibold text-purple-900">Why LSTMs Excel Here</h4>
        <p className="mt-1 text-sm text-purple-800">
          Vanilla RNNs struggle with these examples because the gradient signal from the
          dependent word (e.g., &quot;sits&quot;) must travel back through many time steps to reach
          the source (e.g., &quot;cat&quot;). LSTMs solve this with their cell state, which can
          carry information across arbitrary distances with minimal degradation.
        </p>
      </div>
    </div>
  )
}

export default LongRangeDependencyExamples
