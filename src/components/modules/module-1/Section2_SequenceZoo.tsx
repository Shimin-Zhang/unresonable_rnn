'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { SequenceArchitectureVisual } from './SequenceArchitectureVisual'
import { SEQUENCE_ARCHITECTURES } from '@/content/module-1/content'

export function Section2_SequenceZoo() {
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle as="h2">1.2 The Sequence Zoo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intro */}
          <div className="prose prose-slate max-w-none">
            <p>
              RNNs enable five fundamental types of sequence architectures. Understanding these
              patterns helps you recognize which problems can be solved with sequence models.
            </p>
          </div>

          {/* Karpathy quote */}
          <blockquote className="border-l-4 border-primary-500 bg-primary-50 p-4 italic text-slate-700">
            &ldquo;RNNs allow us to operate over sequences of vectors: sequences in the input,
            the output, or both.&rdquo;
            <footer className="mt-2 text-sm font-medium text-slate-600">
              &mdash; Andrej Karpathy
            </footer>
          </blockquote>

          {/* Architecture table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 rounded-lg border border-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Input
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Output
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Example
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {SEQUENCE_ARCHITECTURES.map((arch) => (
                  <tr key={arch.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                      {arch.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      <span className={arch.input === 'Sequence' ? 'font-semibold text-blue-600' : ''}>
                        {arch.input}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      <span className={arch.output === 'Sequence' ? 'font-semibold text-orange-600' : ''}>
                        {arch.output}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                      {arch.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Interactive visualization */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Interactive Architecture Diagrams
            </h3>
            <p className="mb-4 text-sm text-slate-600">
              Click on each architecture type to see how data flows through the network.
            </p>
            <SequenceArchitectureVisual />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
