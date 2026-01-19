'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SEQUENCE_ARCHITECTURES } from '@/content/module-1/content'

interface ArchitectureCardProps {
  architecture: typeof SEQUENCE_ARCHITECTURES[number]
  isSelected: boolean
  onClick: () => void
}

function ArchitectureCard({ architecture, isSelected, onClick }: ArchitectureCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg border-2 p-4 text-left transition-all',
        'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-slate-200 bg-white hover:border-slate-300'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-slate-900">{architecture.name}</div>
          <div className="text-sm text-slate-600">{architecture.example}</div>
        </div>
        <div
          className={cn(
            'rounded-md px-2 py-1 text-xs font-bold',
            isSelected ? 'bg-primary-200 text-primary-800' : 'bg-slate-100 text-slate-600'
          )}
        >
          {architecture.icon}
        </div>
      </div>
    </button>
  )
}

interface SequenceDiagramProps {
  architecture: typeof SEQUENCE_ARCHITECTURES[number]
}

function SequenceDiagram({ architecture }: SequenceDiagramProps) {
  const renderDiagram = () => {
    switch (architecture.id) {
      case 'one-to-one':
        return (
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                x
              </div>
              <div className="mt-1 text-xs text-slate-500">Input</div>
            </div>
            <svg className="h-6 w-12" viewBox="0 0 48 24">
              <path d="M0 12 L40 12 M40 12 L32 6 M40 12 L32 18" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-3">
              <div className="h-8 w-8 rounded bg-emerald-500"></div>
            </div>
            <svg className="h-6 w-12" viewBox="0 0 48 24">
              <path d="M0 12 L40 12 M40 12 L32 6 M40 12 L32 18" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                y
              </div>
              <div className="mt-1 text-xs text-slate-500">Output</div>
            </div>
          </div>
        )

      case 'one-to-many':
        return (
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold">
                x
              </div>
              <div className="mt-1 text-xs text-slate-500">Input</div>
            </div>
            <svg className="h-6 w-12" viewBox="0 0 48 24">
              <path d="M0 12 L40 12 M40 12 L32 6 M40 12 L32 18" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-2">
                    <div className="h-6 w-6 rounded bg-emerald-500"></div>
                  </div>
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M12 0 L12 16 M12 16 L8 12 M12 16 L16 12" stroke="#94a3b8" strokeWidth="2" fill="none" />
                  </svg>
                  <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    y{i}
                  </div>
                </div>
              ))}
              <div className="flex items-center text-slate-400 text-xl">...</div>
            </div>
          </div>
        )

      case 'many-to-one':
        return (
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    x{i}
                  </div>
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path d="M12 0 L12 16 M12 16 L8 12 M12 16 L16 12" stroke="#94a3b8" strokeWidth="2" fill="none" />
                  </svg>
                  <div className="rounded-lg border-2 border-dashed border-slate-300 p-2">
                    <div className="h-6 w-6 rounded bg-emerald-500"></div>
                  </div>
                </div>
              ))}
              <div className="flex items-center text-slate-400 text-xl">...</div>
            </div>
            <svg className="h-6 w-12" viewBox="0 0 48 24">
              <path d="M0 12 L40 12 M40 12 L32 6 M40 12 L32 18" stroke="#94a3b8" strokeWidth="2" fill="none" />
            </svg>
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                y
              </div>
              <div className="mt-1 text-xs text-slate-500">Output</div>
            </div>
          </div>
        )

      case 'many-to-many-synced':
        return (
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  x{i}
                </div>
                <svg className="h-4 w-6" viewBox="0 0 24 16">
                  <path d="M12 0 L12 12 M12 12 L8 8 M12 12 L16 8" stroke="#94a3b8" strokeWidth="2" fill="none" />
                </svg>
                <div className="rounded-lg border-2 border-dashed border-slate-300 p-1.5">
                  <div className="h-5 w-5 rounded bg-emerald-500"></div>
                </div>
                <svg className="h-4 w-6" viewBox="0 0 24 16">
                  <path d="M12 0 L12 12 M12 12 L8 8 M12 12 L16 8" stroke="#94a3b8" strokeWidth="2" fill="none" />
                </svg>
                <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                  y{i}
                </div>
              </div>
            ))}
            <div className="flex items-center text-slate-400 text-xl self-center">...</div>
          </div>
        )

      case 'many-to-many-encoder-decoder':
        return (
          <div className="flex items-center justify-center gap-2">
            {/* Encoder */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-1">Encoder</div>
              <div className="flex gap-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-7 w-7 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      x{i}
                    </div>
                    <svg className="h-4 w-4" viewBox="0 0 16 16">
                      <path d="M8 0 L8 12 M8 12 L4 8 M8 12 L12 8" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    </svg>
                    <div className="h-5 w-5 rounded bg-emerald-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Context vector arrow */}
            <div className="flex flex-col items-center mx-2">
              <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                c
              </div>
              <svg className="h-4 w-8" viewBox="0 0 32 16">
                <path d="M0 8 L24 8 M24 8 L18 4 M24 8 L18 12" stroke="#a855f7" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Decoder */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-1">Decoder</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-5 w-5 rounded bg-emerald-500"></div>
                    <svg className="h-4 w-4" viewBox="0 0 16 16">
                      <path d="M8 0 L8 12 M8 12 L4 8 M8 12 L12 8" stroke="#94a3b8" strokeWidth="2" fill="none" />
                    </svg>
                    <div className="h-7 w-7 rounded bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                      y{i}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="rounded-lg bg-slate-50 p-6">
      <div className="flex flex-col items-center">
        {renderDiagram()}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-blue-500"></div>
            <span className="text-slate-600">Input</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-emerald-500"></div>
            <span className="text-slate-600">Hidden State</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-orange-500"></div>
            <span className="text-slate-600">Output</span>
          </div>
          {architecture.id === 'many-to-many-encoder-decoder' && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span className="text-slate-600">Context Vector</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SequenceArchitectureVisual() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedArchitecture = SEQUENCE_ARCHITECTURES[selectedIndex]

  return (
    <div className="space-y-4">
      {/* Architecture selector */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {SEQUENCE_ARCHITECTURES.map((arch, index) => (
          <ArchitectureCard
            key={arch.id}
            architecture={arch}
            isSelected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {/* Visualization */}
      <SequenceDiagram architecture={selectedArchitecture} />

      {/* Details panel */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase text-slate-500">Description</div>
            <div className="mt-1 text-slate-700">{selectedArchitecture.description}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase text-slate-500">Use Cases</div>
            <div className="mt-1 text-slate-700">{selectedArchitecture.useCase}</div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <div className="text-xs font-medium text-blue-600">Input</div>
            <div className="font-semibold text-blue-900">{selectedArchitecture.input}</div>
          </div>
          <div className="rounded-lg bg-orange-50 p-3 text-center">
            <div className="text-xs font-medium text-orange-600">Output</div>
            <div className="font-semibold text-orange-900">{selectedArchitecture.output}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
