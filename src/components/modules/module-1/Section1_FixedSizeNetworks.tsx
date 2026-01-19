'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { ExplanationCards } from '@/components/ui/ExplanationCards'
import { MODULE_1_EXPLANATIONS } from '@/content/module-1/content'

export function Section1_FixedSizeNetworks() {
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle as="h2">1.1 The Problem with Fixed-Size Networks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Narrative hook */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <p className="text-amber-900 italic">
              Imagine you&apos;re building an AI to read movie reviews. Some reviews are 10 words,
              others are 500. How do you handle this?
            </p>
          </div>

          {/* Core problem explanation */}
          <div className="prose prose-slate max-w-none">
            <p>
              Traditional neural networks have a fundamental constraint that makes them poorly
              suited for many real-world problems:
            </p>
          </div>

          {/* Visual representation of the constraint */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="mb-2 text-3xl font-bold text-slate-400">784</div>
              <div className="text-sm font-medium text-slate-700">Fixed Input Size</div>
              <div className="text-xs text-slate-500">e.g., MNIST images</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="mb-2 text-3xl font-bold text-slate-400">10</div>
              <div className="text-sm font-medium text-slate-700">Fixed Output Size</div>
              <div className="text-xs text-slate-500">e.g., 10 digit classes</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="mb-2 text-3xl font-bold text-slate-400">0</div>
              <div className="text-sm font-medium text-slate-700">Memory Between Predictions</div>
              <div className="text-xs text-slate-500">Each prediction is independent</div>
            </div>
          </div>

          {/* The hook question */}
          <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
            <p className="font-semibold text-primary-900 mb-1">The Key Question:</p>
            <p className="text-primary-800 text-lg">
              &ldquo;What if a neural network could remember?&rdquo;
            </p>
          </div>

          {/* Multi-audience explanations */}
          <ExplanationCards
            items={MODULE_1_EXPLANATIONS}
            title="Explain This to Different Audiences"
          />
        </CardContent>
      </Card>
    </section>
  )
}
