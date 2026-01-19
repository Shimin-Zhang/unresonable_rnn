'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { BUSINESS_APPLICATIONS } from '@/content/module-1/content'

const APPLICATION_DOMAINS = [
  {
    title: 'Natural Language Processing',
    icon: '📝',
    examples: ['Text generation', 'Translation', 'Summarization', 'Sentiment analysis'],
    color: 'blue',
  },
  {
    title: 'Speech',
    icon: '🎤',
    examples: ['Speech recognition', 'Text-to-speech synthesis', 'Voice commands'],
    color: 'purple',
  },
  {
    title: 'Time Series',
    icon: '📈',
    examples: ['Stock prediction', 'Sensor data analysis', 'Anomaly detection'],
    color: 'green',
  },
  {
    title: 'Video',
    icon: '🎬',
    examples: ['Action recognition', 'Video captioning', 'Frame prediction'],
    color: 'orange',
  },
]

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-800',
    badge: 'bg-purple-100 text-purple-700',
  },
  green: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    badge: 'bg-orange-100 text-orange-700',
  },
}

export function Section3_Applications() {
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle as="h2">1.3 Real-World Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Intro */}
          <div className="prose prose-slate max-w-none">
            <p>
              Sequence models power applications across every industry. Understanding where
              sequence patterns appear helps you identify opportunities in your own domain.
            </p>
          </div>

          {/* Domain grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {APPLICATION_DOMAINS.map((domain) => {
              const colors = colorClasses[domain.color as keyof typeof colorClasses]
              return (
                <div
                  key={domain.title}
                  className={`rounded-lg border ${colors.border} ${colors.bg} p-4`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{domain.icon}</span>
                    <h3 className={`font-semibold ${colors.text}`}>{domain.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {domain.examples.map((example) => (
                      <span
                        key={example}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Business applications table */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Business Application Examples
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 rounded-lg border border-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Industry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Sequence Problem
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Architecture
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Business Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {BUSINESS_APPLICATIONS.map((app, index) => (
                    <tr key={index} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                        {app.industry}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {app.problem}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
                          {app.architecture}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {app.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reflection prompt */}
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
            <h4 className="font-semibold text-amber-900 mb-2">Reflection Exercise</h4>
            <p className="text-amber-800 text-sm mb-3">
              Take a moment to identify sequence problems in your own work domain:
            </p>
            <ol className="list-decimal list-inside text-sm text-amber-800 space-y-1">
              <li>List 3 sequence problems in your current work domain</li>
              <li>For each, identify the architecture type (one-to-one, many-to-one, etc.)</li>
              <li>Estimate: How much manual effort could this automate?</li>
              <li>Draft a one-sentence pitch: &ldquo;We could use sequence modeling to [X] which would [business outcome]&rdquo;</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
