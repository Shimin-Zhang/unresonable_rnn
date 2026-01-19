'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { TIMELINE_EVENTS } from '@/content/module-1/content'

const typeColors = {
  origin: {
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    dot: 'bg-slate-500',
    text: 'text-slate-700',
  },
  milestone: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
  },
  breakthrough: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-400',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
  },
}

function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200 md:left-1/2 md:-translate-x-0.5" />

      <div className="space-y-6">
        {TIMELINE_EVENTS.map((event, index) => {
          const colors = typeColors[event.type]
          const isEven = index % 2 === 0

          return (
            <div
              key={event.year}
              className={`relative flex items-start gap-4 md:gap-8 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Year badge - mobile */}
              <div className={`md:hidden flex-shrink-0 w-8 h-8 rounded-full ${colors.dot} flex items-center justify-center z-10`}>
                <span className="text-white text-xs font-bold">{event.year.toString().slice(-2)}</span>
              </div>

              {/* Content card */}
              <div className={`flex-1 md:w-[calc(50%-2rem)] ${isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                <div className={`inline-block rounded-lg border ${colors.border} ${colors.bg} p-4 text-left`}>
                  <div className={`font-bold ${colors.text}`}>
                    <span className="hidden md:inline">{event.year}: </span>
                    {event.title}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{event.description}</p>
                </div>
              </div>

              {/* Center dot - desktop */}
              <div className={`hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${colors.dot} border-2 border-white shadow-sm`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Section4_HistoricalContext() {
  return (
    <section className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle as="h2">1.4 Historical Context: Why Now?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hook question */}
          <div className="rounded-lg bg-primary-50 border border-primary-200 p-4">
            <p className="font-semibold text-primary-900 mb-1">The Curious Question:</p>
            <p className="text-primary-800 text-lg">
              &ldquo;RNNs were invented in the 1980s. Why did they suddenly start working in 2015?&rdquo;
            </p>
          </div>

          {/* Three barriers */}
          <div className="prose prose-slate max-w-none">
            <p>
              RNNs existed for decades but faced three critical barriers that prevented practical use:
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-2xl">🖥️</div>
              <h4 className="font-semibold text-slate-900">Computational Power</h4>
              <p className="mt-1 text-sm text-slate-600">
                Training RNNs required GPUs and parallel processing that simply didn&apos;t exist or
                weren&apos;t accessible.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-2xl">📚</div>
              <h4 className="font-semibold text-slate-900">Data Availability</h4>
              <p className="mt-1 text-sm text-slate-600">
                Large text corpora weren&apos;t digitized or accessible. The internet changed this.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-2xl">🧮</div>
              <h4 className="font-semibold text-slate-900">Algorithmic Improvements</h4>
              <p className="mt-1 text-sm text-slate-600">
                LSTM (1997) solved vanishing gradients, but the solution needed time to be understood
                and adopted.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              The Convergence (2012-2015)
            </h3>
            <Timeline />
          </div>

          {/* Metacognition note */}
          <div className="rounded-lg bg-slate-100 border border-slate-300 p-4">
            <p className="text-slate-700 italic">
              <span className="font-semibold">Metacognition insight:</span> Understanding{' '}
              <em>why</em> something works now helps you predict what will work next. Each AI
              breakthrough requires the convergence of multiple enabling factors.
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
